#include "NetWorker.hpp"

#include <memory>
#include <exception>
#include <stdexcept>
#include <queue>
#include <functional>

#include "result/NetResult.hpp"
#include "../../Config.hpp"

struct NetWorker::Connection
{
    std::shared_ptr<Modem> modem;
    std::unique_ptr<API> api;
    std::optional<int> current_tracking_route_id;
};

NetWorker::NetWorker() {
}

NetWorker::~NetWorker() {
}

NetResult NetWorker::step()
{
    if (!conn.has_value())
    {
        conn = connect();
    }
    Connection& c = **conn;
    if (c.current_tracking_route_id.has_value())
    {
        // Just send locations until we need to do something else.
        while (tasks.empty()) {
            Coordinate coordinate = c.modem->locate();
            Location location = {
                .timestamp = 0,
                .coord = coordinate};
            c.api->send_location(location);
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
    Connection& c = **conn;
    if (task.type == NetTask::Type::START_TRACKING)
    {
        c.api->send_route_selection(task.route_id);
        c.current_tracking_route_id = task.route_id;
        return NetResult::started_tracking();
    }
    else if (task.type == NetTask::Type::GET_ROUTES)
    {
        std::vector<Route> routes = c.api->get_routes();
        return NetResult::got_routes(routes);
    }
    else
    {
        throw std::invalid_argument("Invalid task type");
    }
}

std::unique_ptr<NetWorker::Connection> NetWorker::connect()
{
    std::unique_ptr<HTTP> http = std::make_unique<HTTP>();
    std::shared_ptr<Modem> modem = std::make_shared<Modem>(DOMAIN);
    std::unique_ptr<API> api = std::make_unique<API>(modem, std::move(http), modem->id());
    return std::make_unique<Connection>(modem, std::move(api), std::nullopt);
}