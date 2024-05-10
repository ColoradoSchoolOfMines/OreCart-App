#pragma once

#include <array>
#include <cinttypes>

#include "ICanvas.hpp"
#include "Rect.hpp"

template <unsigned int W, unsigned int H>
class Glyph
{
public:
    Glyph(std::array<uint16_t, W * H> arr);

    void draw(ICanvas &canvas, unsigned int x, unsigned int y);

private:
    std::array<uint16_t, W * H> arr;
};

template <unsigned int W, unsigned int H>
Glyph<W, H>::Glyph(std::array<uint16_t, W * H> arr) : arr(arr) {}

template <unsigned int W, unsigned int H>
void Glyph<W, H>::draw(ICanvas &canvas, unsigned int x, unsigned int y)
{
    if (x < 0 || y < 0 || x + W >= canvas.width() || y + H >= canvas.height() || canvas.depth() != sizeof(uint16_t))
    {
        throw std::runtime_error("Invalid blit parameters");
    }
    Rect bounds = {x, y, W, H};
    canvas.blit((char *) arr.data(), bounds, sizeof(uint16_t));
}
