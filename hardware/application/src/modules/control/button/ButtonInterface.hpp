#pragma once

#include "button_event.h"
#include "Button.hpp"

#include <optional>

namespace ButtonInterface {
    void send(const Button &button);

    std::optional<Button> recieve(const app_event_header *aeh);
}