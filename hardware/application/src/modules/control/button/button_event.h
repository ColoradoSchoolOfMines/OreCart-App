#pragma once

#include <app_event_manager.h>

#include "Button.hpp"

struct button_event
{
    struct app_event_header header;
    enum Button button;
};

APP_EVENT_TYPE_DECLARE(button_event);
