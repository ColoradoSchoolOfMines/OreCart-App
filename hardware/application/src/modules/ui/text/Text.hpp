#pragma once

#include <string_view>

#include "../IView.hpp"
#include "../canvas/Geometry.hpp"

class Text : public IView {
public:
    Text();
    ~Text();

    std::string_view get_text() const;
    void set_text(const std::string_view text);

    Dimension measure(Dimension limits) override;
    void draw(ICanvas &canvas) const override;

private:
    std::string_view text;
};