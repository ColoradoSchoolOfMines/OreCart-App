#include "control_module.hpp"

#include <zephyr/kernel.h>
#include <zephyr/devicetree.h>
#include <zephyr/drivers/gpio.h>

#include "button/ButtonInterface.hpp"

#define DOWN_BTN_NODE	DT_ALIAS(downbutton)
#define UP_BTN_NODE  DT_ALIAS(upbutton)
#define SELECT_BTN_NODE DT_ALIAS(selectbutton)

static const struct gpio_dt_spec down_btn = GPIO_DT_SPEC_GET_OR(DOWN_BTN_NODE, gpios, {0});
static const struct gpio_dt_spec up_btn = GPIO_DT_SPEC_GET_OR(UP_BTN_NODE, gpios, {0});
static const struct gpio_dt_spec select_btn = GPIO_DT_SPEC_GET_OR(SELECT_BTN_NODE, gpios, {0});

static struct gpio_callback down_button_cb_data;
static struct gpio_callback up_button_cb_data;
static struct gpio_callback select_button_cb_data;


static int _config_btn(const gpio_dt_spec* btn) {
    int ret = gpio_pin_configure_dt(btn, GPIO_INPUT);
    if (ret) return ret;
	ret &= gpio_pin_interrupt_configure_dt(btn, GPIO_INT_EDGE_TO_ACTIVE);
	if (ret) return ret;
    return 0;
}

void button_down_pressed(const struct device *dev, struct gpio_callback *cb, uint32_t pins) {
    printk("Down button pressed\n");
    ButtonInterface::send(Button::DOWN);
}

void button_up_pressed(const struct device *dev, struct gpio_callback *cb, uint32_t pins) {
    printk("Up button pressed\n");
    ButtonInterface::send(Button::UP);
}

void button_select_pressed(const struct device *dev, struct gpio_callback *cb, uint32_t pins) {
    printk("Select button pressed\n");
    ButtonInterface::send(Button::SELECT);
}

void control::start() {
    printk("Down pin: %d\n", down_btn.pin);
    printk("Up pin: %d\n", up_btn.pin);
    printk("Select pin: %d\n", select_btn.pin);
    _config_btn(&down_btn);
    gpio_init_callback(&down_button_cb_data, button_down_pressed, BIT(down_btn.pin));
	gpio_add_callback(down_btn.port, &down_button_cb_data);

    _config_btn(&up_btn);
    gpio_init_callback(&up_button_cb_data, button_up_pressed, BIT(up_btn.pin));
	gpio_add_callback(up_btn.port, &up_button_cb_data);

    _config_btn(&select_btn);
    gpio_init_callback(&select_button_cb_data, button_select_pressed, BIT(select_btn.pin));
	gpio_add_callback(select_btn.port, &select_button_cb_data);
}