#pragma once

#include <app_event_manager.h>

#include "NetTask.h"

struct net_task_event {
    struct app_event_header header;
    struct NetTask net_task;
};

APP_EVENT_TYPE_DECLARE(net_task_event);