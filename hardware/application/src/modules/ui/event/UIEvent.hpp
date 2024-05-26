#pragma once

#include "../../control/button/Button.hpp"
#include "../../net/result/NetResult.hpp"

struct UIEvent {
    enum Type {
        BUTTON,
        NET_RESULT
    };

    Type type;
    Button button;
    NetResult result;

    static UIEvent button_pressed(Button button);
    static UIEvent net_result(NetResult result);
};