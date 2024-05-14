#pragma once

#include <memory>
#include <string_view>
#include <optional>
#include <vector>

#include "../model/Location.hpp"

/**
 * An abstraction around the NRF9160 modem that provides optimized and guaranteed
 * LTE and GNSS communication. Only one instance can exist at a time, so share it
 * with a smart pointer.
 * @author Alexander Capehart, Dorian Cauwe
 */
class Modem
{
public:

    /**
     * Create a new and internally activate the Modem.
     * @param domain The domain for the Modem to resolve and connect to,
     * @throws std::logic_error if there is already a Modem instance.
     * @throws std::runtime_error if the domain cannot be resolved.
     */
    Modem(const std::string_view domain);
    ~Modem();
    Modem(const Modem &) = delete;
    Modem &operator=(const Modem &) = delete;

    /**
     * Send a packet over LTE to the server and wait for a response. Will block for at most 5 seconds
     * until the Modem is connected to the LTE network.
     * 
     * @param packet the packet to send
     * @return the response from the server
     * @throws std::runtime_error if the packet was not sent
     */
    std::vector<char> send(const std::vector<char> &packet);

    /**
     * Yeet a packet over LTE to the server without expecting any response. Will block for at most 5 seconds
     * until the Modem is connected to the LTE network. 
     *
     * @param packet the packet to send
     * @throws std::runtime_error if the packet was not sent
     */
    void yeet(const std::vector<char> &packet);

    /**
     * Poll and then return the current location from GNSS. Will block for at most 5 seconds to ensure
     * the Modem connects to GNSS and polls as many location updates as possible.
     *
     * @return The last polled Coordinate from GNSS.
     */
    Coordinate locate() const;

private:
    struct ModemImpl;
    std::unique_ptr<ModemImpl> data;

    void send_impl(const std::vector<char> &packet);
    void recieve_impl(std::vector<char> &resp);
};
