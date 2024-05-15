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
    RouteSelectScreen screen(canvas);
    screen.attach();
    // Select select;
    // select.set_text("Hello, World!");
    // select.measure({200, 200});
    // select.draw(canvas);
}