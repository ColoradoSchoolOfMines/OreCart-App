#pragma once

#include "net_task_event.h"
#include "NetTask.hpp"

#include <optional>

namespace net_task_terminal {
    void send(const NetTask &task);

    std::optional<NetTask> recieve(const app_event_header *aeh);
}