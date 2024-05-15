#include "button_event.h"

static void log_button_event(const struct app_event_header *aeh)
{
    struct button_event *event = cast_button_event(aeh);
    printk("Received button event with button: %d", event->button);
}

APP_EVENT_TYPE_DEFINE(button_event,                                                /* Unique event name. */
                      log_button_event,                                            /* Function logging event data. */
                      NULL,                                                          /* No event info provided. */
                      APP_EVENT_FLAGS_CREATE(APP_EVENT_TYPE_FLAGS_INIT_LOG_ENABLE)); /* Flags managing event type. */