#include <zephyr/kernel.h>

#include "modules/ui/route_select/RouteSelectScreen.hpp"

#include "modules/ui/canvas/DisplayCanvas.hpp"

int main()
{
    // Modem modem { DOMAIN };
    DisplayCanvas canvas;
    RouteSelectScreen screen(canvas);
    screen.attach();
    // Select select;
    // select.set_text("Hello, World!");
    // select.measure({200, 200});
    // select.draw(canvas);
}