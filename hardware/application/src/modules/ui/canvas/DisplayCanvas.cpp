#include "DisplayCanvas.hpp"

#include <zephyr/kernel.h>
#include <zephyr/drivers/display.h>
#include <zephyr/devicetree.h>
#include <zephyr/drivers/spi.h>
#include <zephyr/drivers/gpio.h>

#include <zephyr/fs/fs.h>

#include <zephyr/display/cfb.h>

#include <vector>

struct DisplayCanvas::DisplayCanvasImpl
{
    const device *display;
    const Dimension size;
    std::vector<uint16_t> clear_buf;
};

DisplayCanvas::DisplayCanvas()
{
    const device *display = DEVICE_DT_GET(DT_CHOSEN(zephyr_display));
    if (!device_is_ready(display))
    {
        throw std::runtime_error("Display device is not ready");
    }

    if (display_blanking_off(display) != 0)
    {
        throw std::runtime_error("Failed to turn off display blanking");
    }
    
    display_capabilities capabilities;
    display_get_capabilities(display, &capabilities);
    
    Dimension size {capabilities.x_resolution, capabilities.y_resolution};
    std::vector<uint16_t> clear_buf(size.w * size.h, 0x0000);
    this->data = std::make_unique<DisplayCanvasImpl>(display, size, std::move(clear_buf));

    Rect bounds = {0, 0, capabilities.x_resolution, capabilities.y_resolution};
    clear(bounds);
}

DisplayCanvas::~DisplayCanvas() {}

Dimension DisplayCanvas::size() const
{
    return data->size;
}

void DisplayCanvas::blit(const uint16_t *pixels, Rect bounds) const
{    
    display_buffer_descriptor buf_desc;
    buf_desc.buf_size = bounds.w * bounds.h * sizeof(uint16_t);
    buf_desc.pitch = bounds.w;
    buf_desc.width = bounds.w;
    buf_desc.height = bounds.h;
    int res = display_write(data->display, bounds.x, bounds.y, &buf_desc, pixels);
}

void DisplayCanvas::clear(Rect bounds) const
{
    blit(data->clear_buf.data(), bounds);
}