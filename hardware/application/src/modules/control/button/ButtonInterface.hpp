#pragma once

#include "button_event.h"
#include "Button.hpp"

#include <optional>

namespace ButtonInterface {
    static void send(const Button &button);

    static std::optional<Button> recieve(const app_event_header *aeh);
}