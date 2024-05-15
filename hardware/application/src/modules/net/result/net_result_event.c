#include "net_result_event.h"

static void log_net_result_event(const struct app_event_header *aeh)
{
    struct net_result_event *event = cast_net_result_event(aeh);
    printk("Received net result event with type: %d", event->type);
}

APP_EVENT_TYPE_DEFINE(net_result_event,                                                /* Unique event name. */
                      log_net_result_event,                                            /* Function logging event data. */
                      NULL,                                                          /* No event info provided. */
                      APP_EVENT_FLAGS_CREATE(APP_EVENT_TYPE_FLAGS_INIT_LOG_ENABLE)); /* Flags managing event type. */