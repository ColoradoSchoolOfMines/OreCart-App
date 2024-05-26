#include <memory>
#include <stdexcept>
#include <string_view>
#include <vector>
#include <optional>

#include <modem/modem_info.h>
#include <modem/lte_lc.h>
#include <modem/nrf_modem_lib.h>
#include <nrf_modem.h>
#include <nrf_modem_gnss.h>
#include <nrf_socket.h>

#include "Modem.hpp"

#include "../../../common/Channel.hpp"

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

Channel<Coordinate> gps_pings;

// A total window cycle will run for 5.12s, split evenly between LTE and GNSS,
// UNLESS LTE still has data to send, in which it's window will bleed over and
// deny GNSS connectivity for the entire window cycle.
#define MODEM_WINDOW_SIZE ((1 << 9) * 10)


static nrf_modem_gnss_pvt_data_frame pvt;

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
    Coordinate location;
    location.latitude = pvt.latitude;
    location.longitude = pvt.longitude;
    gps_pings.send(location);
}

Modem::Modem(const std::string_view domain)
{
    // Modem library initialization.
    if (nrf_modem_is_initialized())
    {
        throw std::logic_error("Only one Modem can exist at a time");
    }

    int err;
    err = nrf_modem_lib_init();
    if (err != 0)
    {
        throw std::runtime_error("Failed to initialize modem library, error: " +
                                 std::to_string(err));
    }

    // lte_lc_connect_async adds a handler before connecting, so presumably so
    // can we. Assume the same for GNSS.
    nrf_modem_gnss_event_handler_set(&gnss_event_handler);

    // LTE & GNSS initialization
    err = lte_lc_init();
    if (err != 0)
    {
        throw std::runtime_error("Failed to initialize LTE, error: " +
                                 std::to_string(err));
    }

    err = lte_lc_connect();
    if (err != 0)
    {
        printf("NRF init 5 throw %d", err);
        throw std::runtime_error("Failed to connect to LTE network, error: " +
                                 std::to_string(err));
    }
    
    err = lte_lc_func_mode_set(LTE_LC_FUNC_MODE_ACTIVATE_LTE);
    if (err != 0)
    {
        throw std::runtime_error("Failed to activate LTE, error: " +
                                 std::to_string(err));
    }

    err = lte_lc_func_mode_set(LTE_LC_FUNC_MODE_ACTIVATE_GNSS);
    if (err != 0)
    {
        throw std::runtime_error("Failed to activate GNSS, error: " +
                                 std::to_string(err));
    }

    // Domain resolution
    const nrf_addrinfo hints{.ai_family = NRF_AF_INET,
                             .ai_socktype = NRF_SOCK_STREAM};
    nrf_addrinfo *res;
    err = nrf_getaddrinfo(domain.data(), nullptr, &hints, &res);
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
    nrf_modem_gnss_event_handler_set(nullptr);
    nrf_close(data->socket);
    nrf_modem_lib_shutdown();
}

std::vector<char> Modem::send(const std::vector<char> &packet)
{
    data->set_speed(Speed::NORMAL);
    send_impl(packet);
    std::vector<char> resp(1 << 10);
    recieve_impl(resp);
    return resp;
}

void Modem::yeet(const std::vector<char> &packet)
{
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
    Coordinate location = gps_pings.recieve();
    while (gps_pings.empty())
    {
        location = gps_pings.recieve();
    }
}

std::string_view Modem::id() const
{
    char *iccid_str = new char[23];
    int res = modem_info_string_get(MODEM_INFO_ICCID, iccid_str, 23);
    if (res < 0)
    {
        throw std::runtime_error("Failed to get ICCID, error: " +
                                 std::to_string(res));
    }
    return std::string_view(iccid_str);
}
