#pragma once

#include <memory>
#include <optional>
#include <functional>

#include "../../common/Channel.hpp"

#include "stack/Modem.hpp"
#include "stack/HTTP.hpp"
#include "stack/API.hpp"
#include "task/NetTask.hpp"
#include "result/NetResult.hpp"

class NetWorker
{
public:
    NetWorker();
    NetWorker(const std::shared_ptr<Modem> modem, std::unique_ptr<API> api);

    NetResult step();
    void add_task(NetTask task);

private:
    NetResult consume(NetTask task);

    std::shared_ptr<Modem> modem;
    std::unique_ptr<API> api;

    Channel<NetTask> tasks;
    std::optional<int> current_tracking_route_id;
};