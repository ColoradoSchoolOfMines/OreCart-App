#include "RouteSelectScreen.hpp"

#include <memory>

#include "../text/Text.hpp"
#include "../spacer/Spacer.hpp"

#include "../../net/net_module.hpp"

RouteSelectScreen::RouteSelectScreen(ICanvas &canvas) : AScreen(canvas)
{
    // Create a text view
    std::shared_ptr<Text> header = std::make_shared<Text>();
    header->set_text("Please select a route:");
    add_view(header);

    // Create a spacer view
    std::shared_ptr<Spacer> spacer = std::make_shared<Spacer>(8);
    add_view(spacer);

    loading = std::make_shared<Text>();
    loading->set_text("Loading...");

    route_options = std::make_shared<SelectGroup>();
    add_view(route_options);
}

void RouteSelectScreen::attach()
{
    // Call the parent class method
    AScreen::attach();
    net::get_routes();
}

void RouteSelectScreen::on_button(Button &button)
{
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
        net::begin_tracking(routes[new_selected].id);
        break;
    default:
        break;
    }
    route_options->set_selected(new_selected);
    redraw();
}

void RouteSelectScreen::on_net_result(NetResult &result)
{
    if (result.type == NetResult::GOT_ROUTES) {
        routes = result.routes;
        // Map result.routes to route.name
        std::vector<std::string_view> route_names;
        for (auto &route : routes) {
            route_names.push_back(route.name);
        }
        route_options->set_options(route_names);
        loading->set_text("");
        redraw();
    } else if (result.type == NetResult::STARTED_TRACKING) {
        // TODO: Transition to tracking screen
    }
}