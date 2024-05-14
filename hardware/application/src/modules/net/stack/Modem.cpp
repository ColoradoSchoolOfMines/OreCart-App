#include <memory>
#include <stdexcept>
#include <string_view>
#include <vector>
#include <optional>

#include <modem/lte_lc.h>
#include <modem/nrf_modem_lib.h>
#include <nrf_modem.h>
#include <nrf_modem_gnss.h>
#include <nrf_socket.h>

#include "Modem.hpp"

#include "../../../common/Semaphore.hpp"

/**
 * Controls the pace in which packets will be sent over lte.
 */
enum Speed
{
    /**
     * Ensure the packet is sent and a response recieved. May delay connecting to GNSS.
     */
    NORMAL,

    /**
     * Just yeet the packet into the void, don't even expect a response. Will ensure that
     * connecting to GNSS will be as fast as possible.
     */
    YEET
};

#define NRF_SO_RAI 61

// Use a PIMPL struct here so we can fully hide all of the modem-specific types
// required.
struct Modem::ModemImpl
{
    std::unique_ptr<nrf_addrinfo, decltype(&nrf_freeaddrinfo)> addr;
    int socket;
    Speed speed;

    void set_speed(const Speed speed)
    {
        if (speed == this->speed)
        {
            return;
        }
        this->speed = speed;
        int option;
        if (speed == Speed::YEET)
        {
            // This indicates that we will send just one packet of data and then
            // disconnect, which prevents the LTE window from bleeding into the GNSS
            // window and delaying location pinging. This allows for the fastest
            // possible operation of the Modem.
            option = NRF_SO_RAI_LAST;
        }
        else
        {
            // This indicates that we intend to send more data, and so the window may be
            // extended into the GNSS window.
            option = NRF_SO_RAI_ONGOING;
        }
        const int err = nrf_setsockopt(socket, NRF_SOL_SECURE, NRF_SO_RAI,
                                       &option, sizeof(option));
        if (err != 0)
        {
            throw std::runtime_error("Failed to set NRF_SO_RAI option, error: " +
                                     std::to_string(err));
        }
        this->speed = speed;
    }
};

// Here's more or less the issue with the NRF modem: It uses the same antenna to
// connect GNSS and connect to LTE, which requires it to alternate between the
// two services in periods we call "windows" for simplicity. This in turn
// requires us to make locks that we can block on until we can definitively make
// sure we are in the correct window required to connect to LTE or GNSS. Hence,
// this semaphore struct.
Semaphore lte{0, 1};
Semaphore gnss{0, 1};

// A total window cycle will run for 5.12s, split evenly between LTE and GNSS,
// UNLESS LTE still has data to send, in which it's window will bleed over and
// deny GNSS connectivity for the entire window cycle.
#define MODEM_WINDOW_SIZE ((1 << 9) * 10)

static void lte_event_handler(const lte_lc_evt *const evt)
{
    if (evt->type != LTE_LC_EVT_RRC_UPDATE)
    {
        // Not a LTE window update, ignore
        return;
    }
    if (evt->rrc_mode == LTE_LC_RRC_MODE_CONNECTED)
    {
        // Connected to LTE network, can't use GNSS
        lte.give();
        gnss.reset();
    }
    else
    {
        // Connected to GNSS network, can't use LTE
        lte.reset();
        gnss.give();
    }
}

static nrf_modem_gnss_pvt_data_frame pvt;
static Coordinate location;

static void gnss_event_handler(int event)
{
    if (event != NRF_MODEM_GNSS_EVT_PVT)
    {
        // Not a GNSS update, don't care
        return;
    }
    nrf_modem_gnss_read(&pvt, sizeof(pvt), NRF_MODEM_GNSS_DATA_PVT);
    if ((pvt.flags & NRF_MODEM_GNSS_PVT_FLAG_FIX_VALID) == 0)
    {
        // We aren't in the GNSS window, do nothing
        return;
    }
    location.latitude = pvt.latitude;
    location.longitude = pvt.longitude;
}

Modem::Modem(const std::string_view domain)
{
    // Modem library initialization.
    if (nrf_modem_is_initialized())
    {
        throw std::logic_error("Only one Modem can exist at a time");
    }
    nrf_modem_lib_init();

    lte.reset();
    gnss.reset();

    // lte_lc_connect_async adds a handler before connecting, so presumably so
    // can we. Assume the same for GNSS.
    lte_lc_register_handler(&lte_event_handler);
    nrf_modem_gnss_event_handler_set(&gnss_event_handler);

    // LTE & GNSS initialization
    lte_lc_connect();
    lte_lc_func_mode_set(LTE_LC_FUNC_MODE_ACTIVATE_LTE);
    lte_lc_func_mode_set(LTE_LC_FUNC_MODE_ACTIVATE_GNSS);

    // Domain resolution
    const nrf_addrinfo hints{.ai_family = NRF_AF_INET,
                             .ai_socktype = NRF_SOCK_STREAM};
    nrf_addrinfo *res;
    const int err = nrf_getaddrinfo(domain.data(), nullptr, &hints, &res);
    if (err != 0)
    {
        throw std::runtime_error("Failed to resolve domain address, error: " +
                                 std::to_string(err));
    }

    // Socket and data initialization.
    std::unique_ptr<nrf_addrinfo, decltype(&nrf_freeaddrinfo)> addr{
        res, nrf_freeaddrinfo};
    const int socket = nrf_socket(NRF_AF_INET, NRF_SOCK_STREAM, NRF_IPPROTO_TCP);
    if (socket < 0)
    {
        throw std::runtime_error("Failed to create socket, error: " +
                                 std::to_string(socket));
    }
    this->data = std::make_unique<ModemImpl>(std::move(addr), socket, Speed::NORMAL);
}

Modem::~Modem()
{
    lte_lc_deregister_handler(&lte_event_handler);
    nrf_modem_gnss_event_handler_set(nullptr);
    nrf_close(data->socket);
    nrf_modem_lib_shutdown();
}

std::vector<char> Modem::send(const std::vector<char> &packet)
{
    // Block until our LTE window is available. We shouldn't need to wait longer
    // than the entire window size.
    try
    {
        lte.take(MODEM_WINDOW_SIZE);
    }
    catch (const std::exception &e)
    {
        throw std::runtime_error("Failed to obtain LTE window");
    }

    data->set_speed(Speed::NORMAL);
    send_impl(packet);
    std::vector<char> resp(1 << 10);
    recieve_impl(resp);
    return resp;
}

void Modem::yeet(const std::vector<char> &packet)
{
    // Block until our LTE window is available. We shouldn't need to wait longer
    // than the entire window size.
    try
    {
        lte.take(MODEM_WINDOW_SIZE);
    }
    catch (const std::exception &e)
    {
        throw std::runtime_error("Failed to obtain LTE window");
    }

    data->set_speed(Speed::YEET);
    send_impl(packet);
}

void Modem::send_impl(const std::vector<char> &packet)
{
    const int res = nrf_sendto(data->socket, packet.data(), packet.size(), 0,
                               data->addr->ai_addr, data->addr->ai_addrlen);
    if (res < 0)
    {
        throw std::runtime_error(
            "Failed to send TCP packet, error: " +
            std::to_string(res));
    }
}

void Modem::recieve_impl(std::vector<char> &resp)
{
    int res = nrf_recvfrom(data->socket, resp.data(), resp.size(), 0,
                           data->addr->ai_addr, &data->addr->ai_addrlen);
    if (res < 0)
    {
        throw std::runtime_error(
            "Failed to recieve TCP response, error: " +
            std::to_string(res));
    }
}

Coordinate Modem::locate() const
{
    // First wait for the GNSS window to be available.
    try
    {
        gnss.take(MODEM_WINDOW_SIZE);
    }
    catch (const std::exception &e)
    {
        throw std::runtime_error("Failed to obtain GNSS window");
    }
    // Then let GNSS data collect until the window is over.
    try
    {
        lte.take(MODEM_WINDOW_SIZE);
    }
    catch (const std::exception &e)
    {
        throw std::runtime_error("Failed to obtain LTE window");
    }
    // Whatever location was collected will be set to the static variable and
    // should be completely up-to-date.
    return location;
}
