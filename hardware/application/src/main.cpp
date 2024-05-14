#include <array>

#include <zephyr/kernel.h>
#include <zephyr/drivers/display.h>
#include <zephyr/devicetree.h>
#include <zephyr/drivers/spi.h>
#include <zephyr/drivers/gpio.h>

#include <zephyr/fs/fs.h>

#include <zephyr/display/cfb.h>

#include <vector>
#include <stdexcept>


#include "modules/ui/canvas/Geometry.hpp"
#include "modules/ui/canvas/DisplayCanvas.hpp"
#include "modules/ui/canvas/Glyph.hpp"
#include "modules/ui/text/Text.hpp"
#include "modules/ui/route_select/RouteSelectScreen.hpp"

int main()
{
    DisplayCanvas canvas;
    RouteSelectScreen screen(canvas);
    screen.attach();
    while(1){}
}