#include "NetModule.hpp"

#include <memory>
#include <exception>
#include <queue>

#include <app_event_manager.h>


NetModule::NetModule(const std::shared_ptr<Modem> modem, std::unique_ptr<API> api) : modem(modem), api(std::move(api)) {}

void NetModule::begin_tracking(const int route_id) {
    api->send_route_selection(route_id);
    while (true) {
        Coordinate coordinate = modem->locate();
        Location location = {
            .timestamp = 0,
            .coord = coordinate
        };
        api->send_location(location);
    }
}
