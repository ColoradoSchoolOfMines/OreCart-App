#include "NetResult.hpp"

NetResult NetResult::started_tracking()
{
    return {STARTED_TRACKING, {}};
}

NetResult NetResult::got_routes(const std::vector<Route> routes)
{
    return {GOT_ROUTES, routes};
}