#pragma once

#include <vector>
#include <string_view>

#include "../IView.hpp"
#include "Select.hpp"

class SelectGroup : public IView {
public:
    SelectGroup();

    std::vector<std::string_view> get_options() const;
    void set_options(std::vector<std::string_view> options);
    size_t get_selected() const;
    void set_selected(size_t i);

    Dimension measure(Dimension limits) final override;
    void draw(ICanvas &canvas) const final override;

private:
    std::vector<Select> options;
    std::vector<Dimension> sizes;
    size_t selected;
};