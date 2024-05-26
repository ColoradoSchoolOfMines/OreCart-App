#include "UIEvent.hpp"

UIEvent UIEvent::button_pressed(Button button)
{
    return {Type::BUTTON, button};
}

UIEvent UIEvent::net_result(NetResult result)
{
    return {Type::NET_RESULT, {}, result};
}