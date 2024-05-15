#pragma once

#include <array>
#include <cinttypes>

#include "ICanvas.hpp"
#include "Geometry.hpp"

template <unsigned int W, unsigned int H>
class Glyph
{
public:
    Glyph(const std::array<uint16_t, W * H> &arr);

    void draw(ICanvas &canvas, unsigned int x, unsigned int y) const;

private:
    const std::array<uint16_t, W * H> &arr;
};

template <unsigned int W, unsigned int H>
Glyph<W, H>::Glyph(const std::array<uint16_t, W * H> &arr) : arr(arr) {}

template <unsigned int W, unsigned int H>
void Glyph<W, H>::draw(ICanvas &canvas, unsigned int x, unsigned int y) const
{
    Dimension size = canvas.size();
    printf("size: %d %d\n", size.w, size.h);
    printf("x: %d y: %d\n", x, y);
    printf("W: %d H: %d\n", W, H);
    printf("W: %d H: %d\n", x+W, y+H);
    if (x < 0 || y < 0 || x + W > size.w || y + H > size.h)
    {
        throw std::runtime_error("Invalid blit parameters");
    }
    Rect bounds = {x, y, W, H};
    canvas.blit(arr.data(), bounds);
}
