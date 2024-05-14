#include "stack/Modem.hpp"
#include "stack/HTTP.hpp"
#include "stack/API.hpp"
#include "task/NetTask.hpp"
#include "task/NetTaskInterface.hpp"
#include "result/NetResult.hpp"
#include "result/NetResultInterface.hpp"
#include "result/NetResult.hpp"
#include "NetWorker.hpp"
#include <app_event_manager.h>

NetWorker *worker = nullptr;

extern void net_thread(void *d0, void *d1, void *d2)
{
    std::unique_ptr<HTTP> http = std::make_unique<HTTP>();
    std::shared_ptr<Modem> modem = std::make_shared<Modem>("");
    std::unique_ptr<API> api = std::make_unique<API>(modem, std::move(http), "");
    worker = new NetWorker(modem, std::move(api));
    while (true) {
        NetResultInterface::send(worker->step());
    }
    delete worker;
    worker = nullptr;
}

#define NET_STACK 1024

K_THREAD_DEFINE(net_module_thread, NET_STACK,
                net_thread, NULL, NULL, NULL,
                K_LOWEST_APPLICATION_THREAD_PRIO, 0, 0);

static bool net_event_handler(const app_event_header *aeh)
{
    if (worker == nullptr)
    {
        return false;
    }
    std::optional<NetTask> task = NetTaskInterface::recieve(aeh);
    if (task.has_value())
    {
        worker->add_task(task.value());
    }
    return false;
}

APP_EVENT_LISTENER(net_module, net_event_handler);
APP_EVENT_SUBSCRIBE(net_module, net_task_event);

namespace net
{
    void start()
    {
        k_thread_start(net_module_thread);
    }

    void begin_tracking(const int route_id)
    {
        NetTaskInterface::send(NetTask::start_tracking(route_id));
    }
}
