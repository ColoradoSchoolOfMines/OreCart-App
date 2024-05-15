#pragma once

#include <app_event_manager.h>

enum net_task_event_type
{
    GET_ROUTES,
    START_TRACKING,
};

struct net_task_event
{
    struct app_event_header header;
    enum net_task_event_type type;
    union {
        int route_id;
    };
};

APP_EVENT_TYPE_DECLARE(net_task_event);
