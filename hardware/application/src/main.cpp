#include <zephyr/kernel.h>

#include <vector>

// #include "modules/ui/route_select/RouteSelectScreen.hpp"
// #include "modules/ui/canvas/DisplayCanvas.hpp"
#include "modules/control/control_module.hpp"
#include "modules/ui/ui_module.hpp"
#include "modules/net/net_module.hpp"

#include "Config.hpp"

int main()
{
    net::start();
    control::start();
    ui::start();
    while (1) {
        k_sleep(K_FOREVER);
    }
}