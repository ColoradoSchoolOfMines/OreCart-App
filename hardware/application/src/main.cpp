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

int main()
{
    DisplayCanvas canvas;
    Text text;
    text.set_text("Welcome To OreCart!");
    text.draw(canvas);
}