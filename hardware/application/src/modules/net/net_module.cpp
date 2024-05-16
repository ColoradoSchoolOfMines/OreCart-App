#include "task/NetTask.hpp"
#include "task/net_task_terminal.hpp"
#include "result/NetResult.hpp"
#include "result/net_result_terminal.hpp"
#include "NetWorker.hpp"
#include <app_event_manager.h>

NetWorker *net_worker = nullptr;

extern void net_thread(void *d0, void *d1, void *d2)
{
    net_worker = new NetWorker();
    while (true) {
        net_result_terminal::send(net_worker->step());
    }
    delete net_worker;
    net_worker = nullptr;
}

#define NET_STACK 1024

K_THREAD_DEFINE(net_module_thread, NET_STACK,
                net_thread, NULL, NULL, NULL,
                K_LOWEST_APPLICATION_THREAD_PRIO, 0, K_TICKS_FOREVER);

static bool net_event_handler(const app_event_header *aeh)
{
    if (net_worker == nullptr)
    {
        return false;
    }
    std::optional<NetTask> task = net_task_terminal::recieve(aeh);
    if (!task.has_value()) {
        return false;
    }
    net_worker->add_task(*task);
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
        net_task_terminal::send(NetTask::start_tracking(route_id));
    }
}
