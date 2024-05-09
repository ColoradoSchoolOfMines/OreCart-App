#include "stack/Modem.hpp"
#include "stack/HTTP.hpp"
#include "stack/API.hpp"
#include "events/net_task_event.h"
#include "events/net_task_factory.h"
#include "NetWorker.hpp"
#include <app_event_manager.h>

NetWorker *worker = nullptr;

extern void net_thread(void *d0, void *d1, void *d2)
{
    std::unique_ptr<HTTP> http = std::make_unique<HTTP>();
    std::shared_ptr<Modem> modem = std::make_shared<Modem>("");
    std::unique_ptr<API> api = std::make_unique<API>(modem, std::move(http), "");
    worker = new NetWorker(modem, std::move(api));
    worker->operate();
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
    if (!is_net_task_event(aeh))
    {
        return false;
    }
    const net_task_event *event = cast_net_task_event(aeh);
    const NetTask task = event->net_task;
    worker->add_task(task);
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
        net_task_event *event = new_net_task_event();
        event->net_task = net_task_begin_tracking(route_id);
        APP_EVENT_SUBMIT(event);
    }
}
