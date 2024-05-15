#include "ButtonInterface.hpp"

void ButtonInterface::send(const Button &button) {
    button_event *event = new_button_event();
    event->button = button;
    APP_EVENT_SUBMIT(event);
}


std::optional<Button> ButtonInterface::recieve(const app_event_header *aeh) {
    if (!is_button_event(aeh))
    {
        return std::nullopt;
    }
    const button_event *event = cast_button_event(aeh);
    return event->button;
}