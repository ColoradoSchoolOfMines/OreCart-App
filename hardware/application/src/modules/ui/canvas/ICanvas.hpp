#pragma once

#include <memory>
#include <cstdint>

#include "Rect.hpp"

class ICanvas
{
public:
    ICanvas() {}
    virtual ~ICanvas() {}

    virtual unsigned int width() const = 0;
    virtual unsigned int height() const = 0;
    virtual unsigned int depth() const = 0;

    virtual void blit(uint16_t *pixels, Rect bounds, unsigned int depth) const = 0;
};
