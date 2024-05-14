#pragma once

#include <memory>
#include <cstdint>

#include "Geometry.hpp"
#include "ICanvas.hpp"

class SubCanvas : public ICanvas
{
public:
    SubCanvas(ICanvas& parent, Rect adj);
    ~SubCanvas();

    Dimension size() const final override;

    void blit(const uint16_t *pixels, Rect bounds) const final override;

    void clear(Rect bounds) const final override;

private:
    ICanvas& parent;
    Rect adj;
};
