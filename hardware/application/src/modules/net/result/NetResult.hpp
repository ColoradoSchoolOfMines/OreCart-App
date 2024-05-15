#pragma once

#include <vector>

#include "../model/Route.hpp"

struct NetResult {
    enum Type {
        GOT_ROUTES,
        STARTED_TRACKING
    };

    Type type;
    std::vector<Route> routes;

    static NetResult started_tracking();
    static NetResult got_routes(const std::vector<Route> routes);
};