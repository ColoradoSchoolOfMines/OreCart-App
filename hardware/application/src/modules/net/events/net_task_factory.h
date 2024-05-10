#pragma once

#include "NetTask.h"

struct NetTask net_task_begin_tracking(const int route_id) {
    struct NetTask task = {
        .type = BEGIN_TRACKING,
        .route_id = route_id};
    return task;
}