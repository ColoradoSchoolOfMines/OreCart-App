#pragma once

#include <app_event_manager.h>

enum net_result_event_type
{
    GOT_ROUTES,
    STARTED_TRACKING,
};

struct net_result_event
{
    struct app_event_header header;
    enum net_result_event_type type;
    struct event_dyndata dyndata;
};

APP_EVENT_TYPE_DYNDATA_DECLARE(net_result_event);
