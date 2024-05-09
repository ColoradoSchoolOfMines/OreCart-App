#pragma once

#include <memory>

template <unsigned int D>
class ICanvas
{
public:
    ICanvas() : depth(D) {}
    virtual ~ICanvas() {}

    virtual unsigned int width() const = 0;
    virtual unsigned int height() const = 0;

    virtual void blit(unsigned int x, unsigned int y, unsigned int w, unsigned int h, char *glyph) = 0;

protected:
    int depth;
};
