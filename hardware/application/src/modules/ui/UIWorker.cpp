#include "UIWorker.hpp"

#include "route_select/RouteSelectScreen.hpp"
#include "canvas/DisplayCanvas.hpp"

UIWorker::UIWorker() : UIWorker(std::make_unique<DisplayCanvas>()) {
}

UIWorker::UIWorker(std::unique_ptr<ICanvas> canvas) : canvas(std::move(canvas)), current_screen(std::make_unique<RouteSelectScreen>(*this->canvas)) {
    current_screen->attach();
}

void UIWorker::step()
{
    consume(events.recieve());
}

void UIWorker::add_event(UIEvent event)
{
    events.send(event);
}

void UIWorker::consume(UIEvent event)
{
    printf("UI event handler\n");
    if (event.type == UIEvent::Type::BUTTON)
    {
        printf("Button event\n");
        current_screen->on_button(event.button);
    }
    else
    {
        throw std::invalid_argument("Invalid event type");
    }
}
