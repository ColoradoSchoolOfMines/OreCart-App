#pragma once

#include "net_result_event.h"
#include "NetResult.hpp"

#include <optional>

namespace net_result_terminal {
    void send(const NetResult &Result);

    std::optional<NetResult> recieve(const app_event_header *aeh);
}