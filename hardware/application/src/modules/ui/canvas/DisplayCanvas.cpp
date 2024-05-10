#include "DisplayCanvas.hpp"

#include <zephyr/kernel.h>
#include <zephyr/drivers/display.h>
#include <zephyr/devicetree.h>
#include <zephyr/drivers/spi.h>
#include <zephyr/drivers/gpio.h>

#include <zephyr/fs/fs.h>

#include <zephyr/display/cfb.h>

#include <vector>

struct DisplayCanvas::DisplayCanvasImpl {
    const device *display;
    const unsigned int w, h, d;
};

DisplayCanvas::DisplayCanvas() {
    const device *display = DEVICE_DT_GET(DT_CHOSEN(zephyr_display));
	if (!device_is_ready(display)) {
		printk("Device %s not found. Aborting.", display->name);
        return;
    }

	if (display_set_pixel_format(display, PIXEL_FORMAT_RGB_565) != 0) {
        throw std::runtime_error("Failed to set pixel format");
    }

	if (display_blanking_off(display) != 0) {
        throw std::runtime_error("Failed to turn off display blanking");
	}

    display_capabilities capabilities;
    display_get_capabilities(display, &capabilities);

    const unsigned int width = capabilities.x_resolution;
    const unsigned int height = capabilities.y_resolution;
    const unsigned int depth = 2;

    std::vector<char> clear_buf ( width * height * depth, '\0' );
    blit(clear_buf.data(), {0, 0, width, height}, depth);

    data = std::make_unique<DisplayCanvasImpl>(display, width, height);
}

DisplayCanvas::~DisplayCanvas() {
    
}

unsigned int DisplayCanvas::width() const {
    return data->w;
}

unsigned int DisplayCanvas::height() const {
    return data->h;
}

unsigned int DisplayCanvas::depth() const {
    return data->d;
}

void DisplayCanvas::blit(char *pixels, Rect bounds, unsigned int depth) const {
    display_buffer_descriptor buf_desc;
    buf_desc.buf_size = bounds.w * bounds.h * depth;
    buf_desc.pitch = bounds.w;
    buf_desc.width = bounds.w;
    buf_desc.height = bounds.h;
    display_write(data->display, bounds.x, bounds.y, &buf_desc, pixels);
}
