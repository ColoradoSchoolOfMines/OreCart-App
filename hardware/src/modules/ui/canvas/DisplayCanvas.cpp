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
    int w;
    int h;
};

DisplayCanvas::DisplayCanvas() {
    const device *display = nullptr; // TODO: Get the display device
	if (!device_is_ready(display)) {
		printk("Device %s not found. Aborting.", display->name);
        return;
    }

	if (display_set_pixel_format(display, PIXEL_FORMAT_MONO10) != 0) {
		if (display_set_pixel_format(display, PIXEL_FORMAT_MONO01) != 0) {
            throw std::runtime_error("Failed to set pixel format");
		}
	}

	if (display_blanking_off(display) != 0) {
        throw std::runtime_error("Failed to turn off display blanking");
	}

    display_capabilities capabilities;
    display_get_capabilities(display, &capabilities);

    int width = capabilities.x_resolution;
    int height = capabilities.y_resolution;

    std::vector<char> clear_buf ( depth * width, '\0' );

    display_buffer_descriptor buf_desc;
    buf_desc.buf_size = clear_buf.size();
    buf_desc.pitch = width;
    buf_desc.width = width;
    buf_desc.height = 1;

    for (int i=0; i < height; i++) {
        display_write(display, 0, i, &buf_desc, clear_buf.data());
    }

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

void DisplayCanvas::blit(unsigned int x, unsigned int y, unsigned int w, unsigned int h, char *glyph)  {
    display_buffer_descriptor buf_desc;
    buf_desc.buf_size = w * h * depth;
    buf_desc.pitch = w;
    buf_desc.width = w;
    buf_desc.height = h;
    display_write(data->display, x, y, &buf_desc, glyph);
}
