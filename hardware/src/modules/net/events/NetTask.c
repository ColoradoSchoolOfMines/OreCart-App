#include "NetTask.h"

struct NetTask net_task_begin_tracking(int route_id) {
    struct NetTask task = {
        .type = BEGIN_TRACKING,
        .route_id = route_id
    };
    return task;
}