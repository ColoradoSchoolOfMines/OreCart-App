#include <zephyr/kernel.h>

// #include "modules/ui/route_select/RouteSelectScreen.hpp"
// #include "modules/ui/canvas/DisplayCanvas.hpp"
#include "modules/control/control_module.hpp"
#include "modules/ui/ui_module.hpp"

int main()
{
    control::start();
    // Modem modem { DOMAIN };
    // DisplayCanvas canvas;
    // RouteSelectScreen screen(canvas);
    // screen.attach();
    // Select select;
    // select.set_text("Hello, World!");
    // select.measure({200, 200});
    // select.draw(canvas);

    ui::start();
    while (1) {
        k_sleep(K_MSEC(1000));
    }
}