#pragma once

#include <memory>
#include <cstdint>

#include "ICanvas.hpp"

class DisplayCanvas : public ICanvas
{
public:
    DisplayCanvas();
    ~DisplayCanvas();

    Dimension size() const final override;

    void blit(const uint16_t *pixels, Rect bounds) const final override;

    void clear(Rect bounds) const final override;

private:
    struct DisplayCanvasImpl;
    std::unique_ptr<DisplayCanvasImpl> data;
};
