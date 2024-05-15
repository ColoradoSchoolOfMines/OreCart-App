#include "RouteSelectScreen.hpp"

#include <memory>

#include "../text/Text.hpp"
#include "../select/SelectGroup.hpp"
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

    std::shared_ptr<SelectGroup> group = std::make_shared<SelectGroup>();
    group->set_options({"Silver", "Tungsten", "Gold"});
    add_view(group);
}

void RouteSelectScreen::attach()
{
    // Call the parent class method
    AScreen::attach();
}