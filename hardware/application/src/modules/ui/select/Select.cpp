#include "Select.hpp"

#include "../canvas/SubCanvas.hpp"

Select::Select() : Text(), rect(2), selected(false) {}

void Select::set_selected(bool selected) {
    this->selected = selected;
    printf("Selected 1: %d\n", selected);
    printf("Selected 2: %d\n", this->selected);
}

Dimension Select::measure(Dimension limits) {
    Dimension text_size = Text::measure(limits);
    unsigned int adj = rect.get_stroke() * 4;
    rect.set_size({text_size.w + adj, text_size.h + adj});
    return {text_size.w + adj, text_size.h + rect.get_stroke() + adj};
}

void Select::draw(ICanvas &canvas) const {
    if (selected) {
        rect.draw(canvas, 0, 0);
    }
    unsigned int adj = rect.get_stroke() * 2;
    Dimension size = rect.get_size();
    SubCanvas sub_canvas(canvas, { adj, adj, size.w - adj, size.h - adj });
    Text::draw(sub_canvas);
}
