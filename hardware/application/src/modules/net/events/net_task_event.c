#include "net_task_event.h"

static void log_net_task_event(const struct app_event_header *aeh)
{
    struct net_task_event *event = cast_net_task_event(aeh);
    printk("Received net task event with type: %d", event->net_task.type);
}

APP_EVENT_TYPE_DEFINE(net_task_event,                                                /* Unique event name. */
                      log_net_task_event,                                            /* Function logging event data. */
                      NULL,                                                          /* No event info provided. */
                      APP_EVENT_FLAGS_CREATE(APP_EVENT_TYPE_FLAGS_INIT_LOG_ENABLE)); /* Flags managing event type. */