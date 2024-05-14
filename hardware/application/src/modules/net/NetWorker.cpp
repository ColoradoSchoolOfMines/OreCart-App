#include "NetWorker.hpp"

#include <memory>
#include <exception>
#include <queue>

NetWorker::NetWorker(const std::shared_ptr<Modem> modem, std::unique_ptr<API> api) : modem(modem), api(std::move(api)) {}

void NetWorker::operate()
{
    while (true)
    {
        if (current_tracking_route_id.has_value())
        {
            Coordinate coordinate = modem->locate();
            Location location = {
                .timestamp = 0,
                .coord = coordinate};
            api->send_location(location);

            // We want to ping as frequently as possible, so only consume one task every
            // location ping (if we even have one).
            if (!tasks.empty())
            {
                consume(tasks.recieve());
            }
        }
        else
        {
            consume(tasks.recieve());
        }
    }
}

void NetWorker::add_task(NetTask task)
{
    tasks.send(task);
}

void NetWorker::consume(NetTask task)
{
    switch (task.type)
    {
    case NetTask::Type::START_TRACKING:
        api->send_route_selection(task.route_id);
        current_tracking_route_id = task.route_id;
        break;
    default:
        break;
    }
}