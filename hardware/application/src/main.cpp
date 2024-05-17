#include <zephyr/kernel.h>

#include <vector>

// #include "modules/ui/route_select/RouteSelectScreen.hpp"
// #include "modules/ui/canvas/DisplayCanvas.hpp"
#include "modules/control/control_module.hpp"
#include "modules/ui/ui_module.hpp"
#include "modules/net/stack/Modem.hpp"

#include "Config.hpp"

int main()
{
    try {
        Modem modem { DOMAIN };
    } catch (std::runtime_error &e) {
        printf("Modem");
    }
    control::start();
    ui::start();
    while (1) {
        k_sleep(K_MSEC(1000));
    }
}