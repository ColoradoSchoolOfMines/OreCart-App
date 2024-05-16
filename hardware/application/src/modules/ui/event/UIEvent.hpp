#pragma once

#include "../../control/button/Button.hpp"

struct UIEvent {
    enum Type {
        BUTTON,
        NET_RESULT
    };

    Type type;
    Button button;

    static UIEvent button_pressed(Button button);
};