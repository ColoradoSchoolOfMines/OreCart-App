#include "RouteSelectScreen.hpp"

#include <memory>

#include "../text/Text.hpp"

RouteSelectScreen::RouteSelectScreen(ICanvas &canvas) : AScreen(canvas)
{
    // Create a text view
    std::shared_ptr<Text> text = std::make_shared<Text>();
    text->set_text("Route Select");
    std::shared_ptr<Text> text2 = std::make_shared<Text>();
    text2->set_text("Gold");
    add_view(text);
    add_view(text2);
}

void RouteSelectScreen::attach()
{
    // Call the parent class method
    AScreen::attach();
}