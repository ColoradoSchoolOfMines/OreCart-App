#include "NetWorker.hpp"

#include <memory>
#include <exception>
#include <queue>
#include <functional>

#include "result/NetResult.hpp"

NetWorker::NetWorker() {
    std::unique_ptr<HTTP> http = std::make_unique<HTTP>();
    std::shared_ptr<Modem> modem = std::make_shared<Modem>("");
    std::unique_ptr<API> api = std::make_unique<API>(modem, std::move(http), "");
    this->modem = modem;
    this->api = std::move(api);
    this->current_tracking_route_id = std::nullopt;
}

NetWorker::NetWorker(const std::shared_ptr<Modem> modem, std::unique_ptr<API> api) : modem(modem), api(std::move(api)) {}

NetResult NetWorker::step()
{
    if (current_tracking_route_id.has_value())
    {
        // Just send locations until we need to do something else.
        while (tasks.empty()) {
            Coordinate coordinate = modem->locate();
            Location location = {
                .timestamp = 0,
                .coord = coordinate};
            api->send_location(location);
        }
    }
    return consume(tasks.recieve());
}

void NetWorker::add_task(NetTask task)
{
    tasks.send(task);
}

NetResult NetWorker::consume(NetTask task)
{
    if (task.type == NetTask::Type::START_TRACKING)
    {
        api->send_route_selection(task.route_id);
        current_tracking_route_id = task.route_id;
        return NetResult::started_tracking();
    }
    else if (task.type == NetTask::Type::GET_ROUTES)
    {
        std::vector<Route> routes = api->get_routes();
        return NetResult::got_routes(routes);
    }
    else
    {
        throw std::invalid_argument("Invalid task type");
    }
}