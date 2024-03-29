#include <stdexcept>
#include <vector>
#include <string_view>
#include <memory>

#include <nrf_modem.h>
#include <nrf_socket.h>
#include <modem/lte_lc.h>
#include <modem/nrf_modem_lib.h>

#include "Modem.hpp"


struct Modem::ModemImpl {
    std::unique_ptr<nrf_addrinfo, decltype(&nrf_freeaddrinfo)> addr;
    int socket;
    Speed speed;
};

// We would scope these sempahores to the Modem, but since we need to use
// a C-style fixed function pointer we can't bring the instance along.
// Instead, isolate the lock to some static memory under the assumption that
// Modem remains a singleton.
static struct ModemLock {
    k_sem lte;
    k_sem gnss;
} modem_lock;

// In our current configuration our modem alternatives between LTE and GNSS
// every 5.12 seconds. This is the absolute minimum time interval we can send
// location pings in.
#define MODEM_WINDOW_SIZE K_MSEC((1<<9)*10)

void lte_event_handler(const lte_lc_evt *const evt) {
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

Modem::Modem(std::string_view domain)
{
    if (nrf_modem_is_initialized())
    {
        throw std::runtime_error("Only one Modem can exist at a time");
    }
    nrf_modem_lib_init();

    k_sem_init(&modem_lock.lte, 0, 1);
    k_sem_init(&modem_lock.gnss, 0, 1);
    // lte_lc_connect_async adds a handler before connecting, so presumably so
    // can we.
    lte_lc_register_handler(&lte_event_handler);
    lte_lc_connect();
    lte_lc_func_mode_set(LTE_LC_FUNC_MODE_ACTIVATE_LTE);
    lte_lc_func_mode_set(LTE_LC_FUNC_MODE_ACTIVATE_GNSS);

    nrf_addrinfo hints{
        .ai_family = NRF_AF_INET,
        .ai_socktype = NRF_SOCK_STREAM};
    nrf_addrinfo *res;
    int err = nrf_getaddrinfo(domain.data(), nullptr, &hints, &res);
    if (err)
    {
        throw std::runtime_error("Failed to resolve domain address, error: " + std::to_string(err));
    }
    
    std::unique_ptr<nrf_addrinfo, decltype(&nrf_freeaddrinfo)> addr { res, nrf_freeaddrinfo };
    int socket = nrf_socket(NRF_AF_INET, NRF_SOCK_STREAM, NRF_IPPROTO_TCP);
    Speed speed = Speed::NORMAL;
    this->data = std::make_unique<ModemImpl>(std::move(addr), socket, speed);
}

Modem::~Modem() {
    lte_lc_deregister_handler(&lte_event_handler);
    nrf_close(data->socket);
    nrf_modem_shutdown();
}

#define NRF_SO_RAI 61

void Modem::set_speed(Speed speed) {
    int option;
    if (speed == Speed::YEET) {
        option = NRF_SO_RAI_LAST;
    } else {
        option = NRF_SO_RAI_ONGOING;
    }
    int err = nrf_setsockopt(data->socket, NRF_SOL_SECURE, NRF_SO_RAI, &option, sizeof(option));
    if (err)
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
    if (err) {
        throw std::runtime_error("Failed to obtain LTE window, error: " + std::to_string(err));
    }
    err = nrf_sendto(data->socket, packet.data(), packet.size(), 0, data->addr->ai_addr, sizeof(data->addr));
    if (err < 0)
    {
        throw std::runtime_error("Failed to send TCP packet with RAI_LAST, error: " + std::to_string(err));
    }
}
