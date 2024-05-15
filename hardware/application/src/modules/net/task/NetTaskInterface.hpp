#pragma once

#include "net_task_event.h"
#include "NetTask.hpp"

#include <optional>

namespace NetTaskInterface {
    void send(const NetTask &task);

    std::optional<NetTask> recieve(const app_event_header *aeh);
}