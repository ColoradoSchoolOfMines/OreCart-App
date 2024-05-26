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
    
    NetResult step();
    void add_task(NetTask task);

private:
    Channel<NetTask> tasks;
    NetResult consume(NetTask task);

    struct Connection;
    std::unique_ptr<Connection> connect();
    std::optional<std::unique_ptr<Connection>> conn;
};