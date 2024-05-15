#pragma once

#include "../text/Text.hpp"
#include "../canvas/RectShape.hpp"

class Select : public Text {
public:
    Select();

    Dimension measure(Dimension limits) final override;
    void draw(ICanvas &canvas) const final override;

    void set_selected(bool selected);

private:
    RectShape rect;
    bool selected;
};