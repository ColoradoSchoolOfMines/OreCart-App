#include "control_module.hpp"

#include <zephyr/kernel.h>
#include <zephyr/devicetree.h>
#include <zephyr/drivers/gpio.h>

#include "button/ButtonInterface.hpp"

#define LEFT_BTN_NODE	DT_ALIAS(leftbutton)
#define RIGHT_BTN_NODE  DT_ALIAS(rightbutton)
#define CENTER_BTN_NODE DT_ALIAS(centerbutton)

static const struct gpio_dt_spec left_btn = GPIO_DT_SPEC_GET_OR(LEFT_BTN_NODE, gpios, {0});
static const struct gpio_dt_spec right_btn = GPIO_DT_SPEC_GET_OR(RIGHT_BTN_NODE, gpios, {0});
static const struct gpio_dt_spec center_btn = GPIO_DT_SPEC_GET_OR(CENTER_BTN_NODE, gpios, {0});

static struct gpio_callback left_button_cb_data;
static struct gpio_callback right_button_cb_data;
static struct gpio_callback center_button_cb_data;
static int _config_btn(const gpio_dt_spec* btn);

void button_left_pressed(const struct device *dev, struct gpio_callback *cb, uint32_t pins) {
    ButtonInterface::send(Button::LEFT);
}

void button_right_pressed(const struct device *dev, struct gpio_callback *cb, uint32_t pins) {
    ButtonInterface::send(Button::RIGHT);
}

void button_center_pressed(const struct device *dev, struct gpio_callback *cb, uint32_t pins) {
    ButtonInterface::send(Button::CENTER);
}

void control::start() {
    _config_btn(&left_btn);
    gpio_init_callback(&left_button_cb_data, button_left_pressed, BIT(left_btn.pin));
	gpio_add_callback(left_btn.port, &left_button_cb_data);

    _config_btn(&right_btn);
    gpio_init_callback(&right_button_cb_data, button_right_pressed, BIT(right_btn.pin));
	gpio_add_callback(right_btn.port, &right_button_cb_data);

    _config_btn(&center_btn);
    gpio_init_callback(&center_button_cb_data, button_center_pressed, BIT(center_btn.pin));
	gpio_add_callback(center_btn.port, &center_button_cb_data);
}