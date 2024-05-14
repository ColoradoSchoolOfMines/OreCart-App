#include "API.hpp"

#include <memory>
#include <algorithm>
#include <sstream>

API::API(std::shared_ptr<Modem> modem, std::unique_ptr<HTTP> http, std::string_view van_guid)
    : http(std::move(http)), modem(modem), van_guid(van_guid) {}

std::vector<Route> API::get_routes() const {
    std::stringstream route;
    route << "/routes/hardware" << van_guid << "/";
    std::vector<char> packet = http->get(route.str(), {});
    std::vector<char> resp = modem->send(packet);
    std::vector<char> body = http->body(resp);
    // <amount of routes, 1 byte> [<route id, 4 bytes> <length of route name, 1 byte> <route name, variable>] * amount of routes
    std::vector<Route> routes;
    std::vector<char>::iterator it = body.begin();
    while (it != body.end()) {
        // Check if there are enough bytes to read the route_id
        if (std::distance(it, body.end()) < sizeof(std::int32_t)) {
            throw std::runtime_error("Malformed response: Insufficient bytes for route_id");
        }
        std::int32_t route_id = *reinterpret_cast<std::int32_t*>(&(*it));
        it += sizeof(std::int32_t);

        // Check if there are enough bytes to read the route_name_length
        if (std::distance(it, body.end()) < sizeof(std::int8_t)) {
            throw std::runtime_error("Malformed response: Insufficient bytes for route_name_length");
        }
        std::int8_t route_name_length = *reinterpret_cast<std::int8_t*>(&(*it));
        it++;

        // Check if there are enough bytes to read the route_name
        if (std::distance(it, body.end()) < route_name_length) {
            throw std::runtime_error("Malformed response: Insufficient bytes for route_name");
        }
        std::string route_name(it, it + route_name_length);
        it += route_name_length;

        routes.push_back({route_id, route_name});
    }
    return routes;
}

void API::send_route_selection(const int route_id) const
{
    std::int32_t id = static_cast<std::int32_t>(route_id);
    std::vector<char> body(sizeof(route_id));
    std::copy_n(reinterpret_cast<const char *>(&id), sizeof(route_id), body.begin());

    std::stringstream route;
    route << "/vans/routeselect/" << van_guid << "/";
    std::vector<char> packet = http->post(route.str(), body);
    modem->send(packet);
}

void API::send_location(const Location &location) const
{
    std::int64_t timestamp_ms = static_cast<std::int64_t>(location.timestamp) * 1000;
    double lat = location.coord.latitude;
    double lon = location.coord.longitude;

    std::vector<char> body;
    body.reserve(sizeof(timestamp_ms) + sizeof(lat) + sizeof(lon));

    auto iter = body.begin();
    iter = std::copy_n(reinterpret_cast<const char *>(&timestamp_ms), sizeof(timestamp_ms), iter);
    iter = std::copy_n(reinterpret_cast<const char *>(&lat), sizeof(lat), iter);
    iter = std::copy_n(reinterpret_cast<const char *>(&lon), sizeof(lon), iter);

    std::ostringstream route;
    route << "/vans/location/" << van_guid << "/";
    std::vector<char> packet = http->post(route.str(), body);
    modem->yeet(packet);
}
