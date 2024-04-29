#include "NetWorker.hpp"

#include <memory>
#include <exception>
#include <queue>


NetWorker::NetWorker(const std::shared_ptr<Modem> modem, std::unique_ptr<API> api) : modem(modem), api(std::move(api)) {}

void NetWorker::operate() {
    while (true) {
        while (!tasks.empty()) {
            consume(tasks.front());
            tasks.pop();
        }
        
        if (current_tracking_route_id.has_value()) {
            Coordinate coordinate = modem->locate();
            Location location = {
                .timestamp = 0,
                .coord = coordinate
            };
            api->send_location(location);
        }
    }
}

void NetWorker::add_task(NetTask task) {
    tasks.push(task);
}

void NetWorker::consume(NetTask task) {
    switch (task.type) {
        case NetTaskType::BEGIN_TRACKING:
            api->send_route_selection(task.route_id);
            current_tracking_route_id = task.route_id;
            break;
        default:
            break;
    }
}