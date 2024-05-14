#pragma once

#include <string_view>

#include "../IView.hpp"
#include "../canvas/Geometry.hpp"

class Text : public IView {
public:
    Text();
    ~Text();

    void set_text(const std::string_view text);

    Dimension measure(Dimension limits) const final override;
    void draw(ICanvas &canvas) const final override;

private:
    std::string_view text;
};