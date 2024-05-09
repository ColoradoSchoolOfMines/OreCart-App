#pragma once

#include <array>
#include "ICanvas.hpp"

template <unsigned int W, unsigned int H, unsigned int D>
class Glyph
{
public:
    Glyph(std::array<char, W * H * D> arr);

    void draw(ICanvas<2> &canvas, unsigned int x, unsigned int y);

private:
    std::array<char, W * H * D> arr;
};

template <unsigned int W, unsigned int H, unsigned int D>
Glyph<W, H, D>::Glyph(std::array<char, W * H * D> arr) : arr(arr) {}

template <unsigned int W, unsigned int H, unsigned int D>
void Glyph<W, H, D>::draw(ICanvas<2> &canvas, unsigned int x, unsigned int y)
{
    if (x < 0 || y < 0 || x + W >= canvas.width() || y + H >= canvas.height())
    {
        throw std::runtime_error("Invalid blit parameters");
    }
    canvas.blit(x, y, W, H, arr.data());
}
