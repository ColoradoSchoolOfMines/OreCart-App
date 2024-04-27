#pragma once

#include <memory>
#include <string_view>
#include <optional>
#include <vector>

#include "Location.hpp"

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

    /**
     * Create a new and internally activate the Modem.
     * @param domain The domain for the Modem to resolve and connect to,
     * @throws std::logic_error if there is already a Modem instance.
     * @throws std::runtime_error if the domain cannot be resolved.
     */
    Modem(const std::string_view domain);
    ~Modem();

    /**
     * Send a packet over LTE to the server at the specified domain. Will block for at most 5 seconds
     * until the Modem is connected to the LTE network.
     *
     * @param packet the packet to send
     * @param speed the speed to send the packet
     * @throws std::runtime_error if the packet was not sent
     */
    std::optional<std::vector<char>> send(const std::vector<char> &packet, const Speed speed);

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
};
