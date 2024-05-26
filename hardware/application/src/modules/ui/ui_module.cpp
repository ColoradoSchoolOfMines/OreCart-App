
#include <app_event_manager.h>

#include "UIWorker.hpp"

#include "../control/button/button_terminal.hpp"
#include "../net/result/net_result_terminal.hpp"

UIWorker *ui_worker = nullptr;

extern void ui_thread(void *d0, void *d1, void *d2)
{
    printf("UI thread\n");
    ui_worker = new UIWorker();
    while (true) {
        ui_worker->step();
    }
    delete ui_worker;
    ui_worker = nullptr;
}

#define NET_STACK 1024

K_THREAD_DEFINE(ui_module_thread, NET_STACK,
                ui_thread, NULL, NULL, NULL,
                K_LOWEST_APPLICATION_THREAD_PRIO, 0, K_TICKS_FOREVER);

static bool ui_event_handler(const app_event_header *aeh)
{
    if (ui_worker == nullptr)
    {
        return false;
    }
    std::optional<Button> button = button_terminal::recieve(aeh);
    if (button.has_value()) {
        ui_worker->add_event(UIEvent::button_pressed(*button));
    }
    std::optional<NetResult> result = net_result_terminal::recieve(aeh);
    if (result.has_value()) {
        ui_worker->add_event(UIEvent::net_result(*result));
    }
    return false;
}

APP_EVENT_LISTENER(ui_module, ui_event_handler);
APP_EVENT_SUBSCRIBE(ui_module, button_event);

namespace ui
{
    void start()
    {
        k_thread_start(ui_module_thread);
    }
}
