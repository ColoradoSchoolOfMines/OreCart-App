#include "NetTask.hpp"

NetTask NetTask::get_routes() {
    return NetTask{Type::GET_ROUTES};
}

NetTask NetTask::start_tracking(const int route_id) {
    return NetTask{Type::START_TRACKING, route_id};
}