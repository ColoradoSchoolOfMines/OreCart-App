#include "NetResultInterface.hpp"

void NetResultInterface::send(const NetResult &result) {
    size_t size = result.routes.size() * sizeof(Route);
    net_result_event *event = new_net_result_event(size);
    switch (result.type) {
        case NetResult::Type::GOT_ROUTES:
            event->type = net_result_event_type::GOT_ROUTES;
            memcpy(event->dyndata.data, result.routes.data(), size);
            break;
        case NetResult::Type::STARTED_TRACKING:
            event->type = net_result_event_type::STARTED_TRACKING;
            break;
        default:
            break;
    }
    APP_EVENT_SUBMIT(event);
}


std::optional<NetResult> NetResultInterface::recieve(const app_event_header *aeh) {
    if (!is_net_result_event(aeh))
    {
        return std::nullopt;
    }
    const net_result_event *event = cast_net_result_event(aeh);
    if (event->type == net_result_event_type::GOT_ROUTES) {
        std::vector<Route> routes;
        size_t size = event->dyndata.size / sizeof(Route);
        routes.resize(size);
        memcpy(routes.data(), event->dyndata.data, event->dyndata.size);
        return NetResult::got_routes(routes);
    } else if (event->type == net_result_event_type::STARTED_TRACKING) {
        return NetResult::started_tracking();
    } else {
        return std::nullopt;
    }
}
