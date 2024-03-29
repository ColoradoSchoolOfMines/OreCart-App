#include <stdexcept>
#include <vector>
#include <string_view>
#include <memory>

#include <nrf_modem.h>
#include <nrf_socket.h>
#include <nrf_modem_gnss.h>
#include <modem/lte_lc.h>
#include <modem/nrf_modem_lib.h>

#include "Modem.hpp"
#include "Model.hpp"

struct Modem::ModemImpl {
    std::unique_ptr<nrf_addrinfo, decltype(&nrf_freeaddrinfo)> addr;
    int socket;
    Speed speed;
};

static struct ModemLock {
    k_sem lte;
    k_sem gnss;
} modem_lock;

// In our current configuration our modem alternates between LTE and GNSS
// every 5.12 seconds. This is the absolute minimum time interval we can send
// location pings in.
#define MODEM_WINDOW_SIZE K_MSEC((1<<9)*10)

static void lte_event_handler(const lte_lc_evt *const evt) {
    if (evt->type != LTE_LC_EVT_RRC_UPDATE) {
        return;
    }
    if (evt->rrc_mode == LTE_LC_RRC_MODE_CONNECTED) {
        // Connected to LTE network, can't use GNSS
        k_sem_give(&modem_lock.lte);
        k_sem_reset(&modem_lock.gnss);
    } else {
        // Disconnected from LTE network, can use GNSS
        k_sem_give(&modem_lock.gnss);
        k_sem_reset(&modem_lock.lte);
    }
}

static nrf_modem_gnss_pvt_data_frame pvt;
static Coordinate location;

static void gnss_event_handler(int event) {
    if (event != NRF_MODEM_GNSS_EVT_PVT) {
        return;
    }
    nrf_modem_gnss_read(&pvt, sizeof(pvt), NRF_MODEM_GNSS_DATA_PVT);
    if ((pvt.flags & NRF_MODEM_GNSS_PVT_FLAG_FIX_VALID) == 0) {
        // We aren't in the GNSS window, do nothing
        return;
    }
    location.latitude = pvt.latitude;
    location.longitude = pvt.longitude;
}

Modem::Modem(std::string_view domain)
{
    // Modem library initialization.
    if (nrf_modem_is_initialized())
    {
        throw std::runtime_error("Only one Modem can exist at a time");
    }
    nrf_modem_lib_init();

    // Lock initialization
    k_sem_init(&modem_lock.lte, 0, 1);
    k_sem_init(&modem_lock.gnss, 0, 1);
    // lte_lc_connect_async adds a handler before connecting, so presumably so
    // can we. Assume the same for GNSS.
    lte_lc_register_handler(&lte_event_handler);
    nrf_modem_gnss_event_handler_set(&gnss_event_handler);

    // LTE & GNSS initialization
    lte_lc_connect();
    lte_lc_func_mode_set(LTE_LC_FUNC_MODE_ACTIVATE_LTE);
    lte_lc_func_mode_set(LTE_LC_FUNC_MODE_ACTIVATE_GNSS);

    // Domain resolution
    nrf_addrinfo hints{
        .ai_family = NRF_AF_INET,
        .ai_socktype = NRF_SOCK_STREAM};
    nrf_addrinfo *res;
    int err = nrf_getaddrinfo(domain.data(), nullptr, &hints, &res);
    if (err != 0)
    {
        throw std::runtime_error("Failed to resolve domain address, error: " + std::to_string(err));
    }
    
    // Socket and data initialization.
    std::unique_ptr<nrf_addrinfo, decltype(&nrf_freeaddrinfo)> addr { res, nrf_freeaddrinfo };
    int socket = nrf_socket(NRF_AF_INET, NRF_SOCK_STREAM, NRF_IPPROTO_TCP);
    Speed speed = Speed::NORMAL; // This will be the default socket speed.
    this->data = std::make_unique<ModemImpl>(std::move(addr), socket, speed);
}

Modem::~Modem() {
    lte_lc_deregister_handler(&lte_event_handler);
    nrf_modem_gnss_event_handler_set(nullptr);
    nrf_close(data->socket);
    nrf_modem_lib_shutdown();
}

#define NRF_SO_RAI 61

void Modem::set_speed(Speed speed) {
    int option;
    if (speed == Speed::YEET) {
        // This indicates that we will send just one packet of data and then disconnect,
        // which prevents the LTE window from bleeding into the GNSS window and delaying
        // location pinging. This allows for the fastest possible operation of the Modem.
        option = NRF_SO_RAI_LAST;
    } else {
        // This indicates that we intend to send more data, and so the window may be extended
        // as to bleed into the GNSS time.
        option = NRF_SO_RAI_ONGOING;
    }
    int err = nrf_setsockopt(data->socket, NRF_SOL_SECURE, NRF_SO_RAI, &option, sizeof(option));
    if (err != 0)
    {
        throw std::runtime_error("Failed to set NRF_SO_RAI option, error: " + std::to_string(err));
    }
}

void Modem::send(std::vector<char> &packet)
{
    int err;
    // Block until our LTE window is available. We shouldn't need to wait longer than the entire
    // window size.
    err = k_sem_take(&modem_lock.lte, MODEM_WINDOW_SIZE); 
    if (err != 0) {
        throw std::runtime_error("Failed to obtain LTE window, error: " + std::to_string(err));
    }
    // We are on LTE now, send the packet.
    err = nrf_sendto(data->socket, packet.data(), packet.size(), 0, data->addr->ai_addr, sizeof(data->addr));
    if (err < 0)
    {
        throw std::runtime_error("Failed to send TCP packet with RAI_LAST, error: " + std::to_string(err));
    }
}

Coordinate Modem::locate() {
    int err;
    // Block until our GNSS window is available.
    err = k_sem_take(&modem_lock.gnss, MODEM_WINDOW_SIZE); 
    if (err != 0) {
        throw std::runtime_error("Failed to obtain GNSS window, error: " + std::to_string(err));
    }
    // Then let GNSS data collect until the window is over.
    err = k_sem_take(&modem_lock.lte, MODEM_WINDOW_SIZE); 
    if (err != 0) {
        throw std::runtime_error("Failed to finish GNSS window, error: " + std::to_string(err));
    }
    // Whatever location was collected will be set to the static variable and should be completely
    // up-to-date.
    return location;
}
