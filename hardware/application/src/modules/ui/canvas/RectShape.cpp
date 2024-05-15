#include "RectShape.hpp"

#include <algorithm>

RectShape::RectShape(unsigned int stroke) : size({0, 0}), stroke(stroke) {
    set_size(size);
}

Dimension RectShape::get_size() const
{
    return size;
}

void RectShape::set_size(Dimension size)
{
    if (size == this->size) {
        return;
    }
    this->size = size;
    ones.resize(std::max(size.w, size.h) * stroke, 0xFFFF);
}

void RectShape::draw(ICanvas &canvas, unsigned int x, unsigned int y) const
{
    canvas.blit(ones.data(), {x, y, size.w, stroke});
    canvas.blit(ones.data(), { x, y, stroke, size.h});
    canvas.blit(ones.data(), { x + size.w - stroke, y, stroke, size.h});
    canvas.blit(ones.data(), { x, y + size.h - stroke, size.w, stroke});
}

unsigned int RectShape::get_stroke() const
{
    return stroke;
}