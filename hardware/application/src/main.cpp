#include <array>

#include <vector>
#include <stdexcept>

#include <zephyr/kernel.h>

#include "modules/ui/canvas/Geometry.hpp"
#include "modules/ui/canvas/DisplayCanvas.hpp"
#include "modules/ui/canvas/Glyph.hpp"
#include "modules/ui/text/Text.hpp"
#include "modules/ui/route_select/RouteSelectScreen.hpp"

#include "Config.hpp"
#include "modules/ui/select/SelectGroup.hpp"

int main()
{
    // Modem modem { DOMAIN };
    DisplayCanvas canvas;
    // RouteSelectScreen screen(canvas);
    // screen.attach();
    // Select select;
    // select.set_text("Hello, World!");
    // select.measure({200, 200});
    // select.draw(canvas);
    SelectGroup group;
    group.set_options({"Option 1", "Option 2", "Option 3"});
    group.measure({500, 500});
    group.draw(canvas);
    size_t i = 0;
    while(1){
        ++i;
        k_sleep(K_MSEC(1000));
        group.set_selected((group.get_selected() + 1) % group.get_options().size());
        group.measure({500, 500});
        canvas.clear({0, 0, 200, 200});
        group.draw(canvas);
    }
}