#pragma once

#include <vector>

#include "ICanvas.hpp"
#include "Geometry.hpp"

class RectShape {
public:
    RectShape(unsigned int stroke);
    void draw(ICanvas &canvas, unsigned int x, unsigned int y) const;

    Dimension get_size() const;
    void set_size(Dimension size);

    unsigned int get_stroke() const;

private:
    std::vector<uint16_t> ones;
    Dimension size;
    unsigned int stroke;
};