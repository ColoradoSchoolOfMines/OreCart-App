#include "UIEvent.hpp"

UIEvent UIEvent::button_pressed(Button button)
{
    return {Type::BUTTON, button};
}