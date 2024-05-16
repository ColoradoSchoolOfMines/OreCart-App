#include "RouteSelectScreen.hpp"

#include <memory>

#include "../text/Text.hpp"
#include "../spacer/Spacer.hpp"

RouteSelectScreen::RouteSelectScreen(ICanvas &canvas) : AScreen(canvas)
{
    // Create a text view
    std::shared_ptr<Text> header = std::make_shared<Text>();
    header->set_text("Please select a route:");
    add_view(header);

    // Create a spacer view
    std::shared_ptr<Spacer> spacer = std::make_shared<Spacer>(8);
    add_view(spacer);

    route_options = std::make_shared<SelectGroup>();
    route_options->set_options({"Silver", "Tungsten", "Gold"});
    add_view(route_options);
}

void RouteSelectScreen::attach()
{
    // Call the parent class method
    AScreen::attach();
}

void RouteSelectScreen::on_button(Button &button)
{
    printf("RouteSelectScreen::on_button\n");
    size_t new_selected = route_options->get_selected();
    switch (button)
    {
    case Button::UP:
        new_selected = new_selected == 0 ? route_options->get_options().size() - 1 : new_selected - 1;
        break;
    case Button::DOWN:
        new_selected = (new_selected + 1) % route_options->get_options().size();
        break;
    case Button::SELECT:
        printf("Selected route");
        break;
    default:
        break;
    }
    route_options->set_selected(new_selected);
    redraw();
}