#include <stdexcept>
#include <vector>
#include <string_view>
#include <memory>

#include <nrf_modem.h>
#include <nrf_socket.h>
#include <modem/lte_lc.h>

#include "Modem.hpp"


#define NRF_SO_RAI 61
#define PACKED_ADDR(addr) ((long)addr.a << 24 | (long)addr.b << 16 | (long)addr.c << 8 | (long)addr.d)

struct Modem::ModemImpl {
    std::unique_ptr<nrf_addrinfo, decltype(&nrf_freeaddrinfo)> addr;
    int socketFd;
    Speed speed;

    ~ModemImpl() {
        nrf_close(socketFd);
        nrf_modem_shutdown();
    }
};

Modem::Modem(std::string_view domain) : data(std::make_unique<ModemImpl>())
{
    if (nrf_modem_is_initialized())
    {
        throw std::runtime_error("Only one Modem can exist at a time");
    }
    nrf_modem_init(nullptr);
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
    data->addr = std::unique_ptr<nrf_addrinfo, decltype(&nrf_freeaddrinfo)>(res, nrf_freeaddrinfo);
    data->socketFd = nrf_socket(NRF_AF_INET, NRF_SOCK_STREAM, NRF_IPPROTO_TCP);
    data->speed = Speed::NORMAL;
}

Modem::~Modem() = default;

void Modem::setSpeed(Speed speed) {
    int option;
    if (speed == Speed::YEET) {
        option = NRF_SO_RAI_LAST;
    } else {
        option = NRF_SO_RAI_ONGOING;
    }
    int err = nrf_setsockopt(data->socketFd, NRF_SOL_SECURE, NRF_SO_RAI, &option, sizeof(option));
    if (err)
    {
        throw std::runtime_error("Failed to set NRF_SO_RAI option, error: " + std::to_string(err));
    }
}

void Modem::send(std::vector<char> &packet)
{
    /* Transmit the message */
    int err = nrf_sendto(data->socketFd, packet.data(), packet.size(), 0, data->addr->ai_addr, sizeof(data->addr));
    if (err < 0)
    {
        throw std::runtime_error("Failed to send TCP packet with RAI_LAST, error: " + std::to_string(err));
    }
}

