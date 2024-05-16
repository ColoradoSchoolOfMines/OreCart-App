#include "button_terminal.hpp"

void button_terminal::send(const Button &button) {
    button_event *event = new_button_event();
    event->button = button;
    APP_EVENT_SUBMIT(event);
}


std::optional<Button> button_terminal::recieve(const app_event_header *aeh) {
    if (!is_button_event(aeh))
    {
        return std::nullopt;
    }
    const button_event *event = cast_button_event(aeh);
    return event->button;
}