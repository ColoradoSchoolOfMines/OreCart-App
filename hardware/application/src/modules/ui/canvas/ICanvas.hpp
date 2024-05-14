#pragma once

#include <memory>
#include <cstdint>

#include "Geometry.hpp"

class ICanvas
{
public:
    ICanvas() {}
    virtual ~ICanvas() {}

    virtual Dimension size() const = 0;

    virtual void blit(const uint16_t *pixels, Rect bounds) const = 0;
    virtual void clear(Rect bounds) const = 0;
};
