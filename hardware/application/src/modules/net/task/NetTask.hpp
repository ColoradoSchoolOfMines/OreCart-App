#pragma once

struct NetTask {
    enum Type {
        GET_ROUTES,
        START_TRACKING,
    };

    Type type;
    union {
        int route_id;
    };

    static NetTask get_routes();

    static NetTask start_tracking(const int route_id);
};