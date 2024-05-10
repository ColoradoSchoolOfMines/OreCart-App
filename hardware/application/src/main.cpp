#include <zephyr/kernel.h>
#include <array>

#include "modules/net/net_module.hpp"
#include "modules/ui/canvas/Glyph.hpp"
#include "modules/ui/canvas/DisplayCanvas.hpp"
#include "modules/ui/canvas/SubCanvas.hpp"

int main()
{
    net::start();
    net::begin_tracking(0);
    
    std::shared_ptr<ICanvas<2>> canvas = std::make_shared<DisplayCanvas>();
    Glyph<2, 2, 2> glyph = { { 1, 1, 0, 0, 1, 1, 0, 0 } };
    glyph.draw(*canvas, 0, 0); // This should draw the glyph at (0, 0)

    std::unique_ptr<ICanvas<2>> sub = std::make_unique<SubCanvas<2>>(canvas, 16, 16, 2, 2);
    glyph.draw(*canvas, 0, 0); // This should draw the glyph at (16, 16)

    while (1) {
        k_sleep(K_FOREVER);
    }
}
