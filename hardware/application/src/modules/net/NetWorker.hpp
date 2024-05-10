#pragma once

#include <memory>
#include <queue>
#include <optional>

#include "stack/Modem.hpp"
#include "stack/HTTP.hpp"
#include "stack/API.hpp"
#include "events/NetTask.h"

class NetWorker
{
public:
    NetWorker(const std::shared_ptr<Modem> modem, std::unique_ptr<API> api);

    void operate();
    void add_task(NetTask task);

private:
    void consume(NetTask task);

    std::shared_ptr<Modem> modem;
    std::unique_ptr<API> api;
    std::queue<NetTask> tasks;
    std::optional<int> current_tracking_route_id;
};