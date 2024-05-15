#pragma once

#include <app_event_manager.h>

#include "Button.hpp"

enum button_event_type
{
    GOT_ROUTES,
    STARTED_TRACKING,
};

struct button_event
{
    struct app_event_header header;
    enum Button button;
};

APP_EVENT_TYPE_DECLARE(button_event);
