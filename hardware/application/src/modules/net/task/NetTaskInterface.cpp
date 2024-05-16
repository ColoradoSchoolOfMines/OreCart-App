#include "NetTaskInterface.hpp"

void NetTaskInterface::send(const NetTask &task) {
    net_task_event *event = new_net_task_event();
    switch (task.type) {
        case NetTask::Type::GET_ROUTES:
            event->type = net_task_event_type::GET_ROUTES;
            break;
        case NetTask::Type::START_TRACKING:
            event->type = net_task_event_type::START_TRACKING;
            event->route_id = task.route_id;
            break;
        default:
            break;
    }
    APP_EVENT_SUBMIT(event);
}


std::optional<NetTask> NetTaskInterface::recieve(const app_event_header *aeh) {
    if (!is_net_task_event(aeh))
    {
        return std::nullopt;
    }
    const net_task_event *event = cast_net_task_event(aeh);
    switch (event->type) {
        case net_task_event_type::GET_ROUTES:
            return NetTask::get_routes();
        case net_task_event_type::START_TRACKING:
            return NetTask::start_tracking(event->route_id);
        default:
            return std::nullopt;
    }
}