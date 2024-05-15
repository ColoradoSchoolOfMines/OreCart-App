#pragma once

#include "../AScreen.hpp"

class RouteSelectScreen : public AScreen {
public:
    RouteSelectScreen(ICanvas &canvas);

    void attach() final override;
};