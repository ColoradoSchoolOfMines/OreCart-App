#pragma once

#include "net_result_event.h"
#include "NetResult.hpp"

#include <optional>

namespace NetResultInterface {
    void send(const NetResult &Result);

    std::optional<NetResult> recieve(const app_event_header *aeh);
}