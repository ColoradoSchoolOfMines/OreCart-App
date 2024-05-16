#pragma once

#include <memory>

#include "../screen/AScreen.hpp"
#include "../select/SelectGroup.hpp"

class RouteSelectScreen : public AScreen {
public:
    RouteSelectScreen(ICanvas &canvas);

    void attach() final override;
    void on_button(Button &button) final override;

private:
    std::shared_ptr<SelectGroup> route_options;
};