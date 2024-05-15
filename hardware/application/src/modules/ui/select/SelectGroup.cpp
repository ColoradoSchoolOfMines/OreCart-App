#include "SelectGroup.hpp"

#include <algorithm>

#include "../canvas/SubCanvas.hpp"

SelectGroup::SelectGroup() : selected(0) {}

std::vector<std::string_view> SelectGroup::get_options() const {
    std::vector<std::string_view> options;
    for (auto &option : this->options) {
        options.push_back(option.get_text());
    }
    return options;
}

void SelectGroup::set_options(std::vector<std::string_view> options) {
    this->options.clear();
    for (auto &option : options) {
        Select select;
        select.set_text(option);
        this->options.push_back(select);
    }
    set_selected(0);
}

size_t SelectGroup::get_selected() const {
    return selected;
}

void SelectGroup::set_selected(size_t i) {
    if (i >= options.size() || i < 0) {
        return;
    }
    this->options[this->selected].set_selected(false);
    selected = i;
    this->options[i].set_selected(true);
}

Dimension SelectGroup::measure(Dimension limits) {
    sizes.clear();
    Dimension size = {0, 0};
    for (auto &option : options) {
        Dimension option_size = option.measure(limits);
        size.w = std::max(size.w, option_size.w);
        size.h += option_size.h;
        if (size > limits) {
            break;
        }
        sizes.push_back(option_size);
    }
    return size;
}

void SelectGroup::draw(ICanvas &canvas) const {
    Point pos = {0, 0};
    for (size_t i = 0; i < sizes.size(); i++) {
        const Dimension &size = sizes[i];
        SubCanvas sub_canvas(canvas, {pos.x, pos.y, size.w, size.h});
        options[i].draw(sub_canvas);
        pos.y += size.h;
    }
}