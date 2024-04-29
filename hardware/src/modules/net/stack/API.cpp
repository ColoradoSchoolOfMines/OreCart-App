#include "API.hpp"

#include <memory>
#include <algorithm>
#include <sstream>

API::API(std::shared_ptr<Modem> modem, std::unique_ptr<HTTP> http, std::string_view van_guid)
    : http(std::move(http)), modem(modem), van_guid(van_guid) {}

void API::send_route_selection(const int route_id) const {
    std::int32_t id = static_cast<std::int32_t>(route_id);
    std::vector<char> body(sizeof(route_id));
    std::copy_n(reinterpret_cast<const char*>(&id), sizeof(route_id), body.begin());

    std::stringstream route;
    route << "/vans/routeselect/" << van_guid << "/";
    std::vector<char> packet = http->post(route.str(), body);
    modem->send(packet, Modem::Speed::NORMAL);
}

void API::send_location(const Location& location) const {
    std::int64_t timestamp_ms = static_cast<std::int64_t>(location.timestamp) * 1000;
    double lat = location.coord.latitude;
    double lon = location.coord.longitude;

    std::vector<char> body;
    body.reserve(sizeof(timestamp_ms) + sizeof(lat) + sizeof(lon));

    auto iter = body.begin();
    iter = std::copy_n(reinterpret_cast<const char*>(&timestamp_ms), sizeof(timestamp_ms), iter);
    iter = std::copy_n(reinterpret_cast<const char*>(&lat), sizeof(lat), iter);
    iter = std::copy_n(reinterpret_cast<const char*>(&lon), sizeof(lon), iter);   

    std::ostringstream route;
    route << "/vans/location/" << van_guid << "/";
    std::vector<char> packet = http->post(route.str(), body);
    modem->send(packet, Modem::Speed::YEET);
}
