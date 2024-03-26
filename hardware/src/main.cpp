#include <stdio.h>
#include <string.h>

#include <zephyr/net/socket.h>
#include <zephyr/drivers/uart.h>
#include <zephyr/kernel.h>
// #include <nrfxlib/nrf_modem/include/nrf_modem_at.h>
#include <nrf_modem.h>
#include <nrf_modem_at.h>
#include <nrf_socket.h>

#include <errno.h>
#include <fcntl.h>

#include <string>
#include <string_view>
#include <stdexcept>
#include <memory>
#include <vector>

class Modem {
public:
	Modem() {
		start_modem();

		// Activate LTE
		// command("AT+CFUN=21");
		// Activate GNSS
		// command("AT+CFUN=31");
		// Allow LTE-M, NB-IoT, GNSS, prefer LTE-M
		// command("AT%XSYSTEMMODE=1,1,1,1");
		// Page Cycle length is total length of both GPS + LTE
		// https://docs.monogoto.io/tips-and-tutorials/low-power-modes-edrx-and-psm
		// command("AT+CEDRXS=1,4,\"0000\",\"0000\"");

		
	}

	~Modem() {
		stop_modem();
	}

	void send_once(std::vector<char> &packet) {
		pre_send_once();
		send_packet(packet);
	}

private:
	int socketHandle;

	void start_modem() {
		nrf_modem_init(nullptr);
	}
	
	void open_socket() {
		socketHandle = nrf_socket(NRF_AF_INET, NRF_SOCK_STREAM, NRF_IPPROTO_TCP);
	}

	void pre_send_once() {
		int option = NRF_SO_RAI_LAST;
		int err = nrf_setsockopt(socketHandle, NRF_SOL_SECURE, 61, &option, sizeof(NRF_SO_RAI_LAST));
    if (err) {
				throw std::runtime_error("Failed to set NRF_SO_RAI option, error: " + std::to_string(err));
    }
	}

	void send_packet(std::vector<char> &packet) {
    struct nrf_sockaddr_in dest_addr = {
        .sin_family = NRF_AF_INET,
        .sin_port = nrf_htons(2000),
        .sin_addr = {
            .s_addr = nrf_htonl(0x08080808)
        }
    };

    /* Transmit the message */
    int err = nrf_sendto(socketHandle, packet.data(), packet.size(), 0, (struct nrf_sockaddr *)&dest_addr, sizeof(dest_addr));
    if (err < 0) {
				throw std::runtime_error("Failed to send UDP packet with RAI_LAST, error: " + std::to_string(err));
    }
	}

	void stop_modem() {
		nrf_modem_shutdown();
	}
};

int main() {
	std::unique_ptr<Modem> modem = std::make_unique<Modem>();
}


