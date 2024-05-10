#pragma once

#include <memory>
#include <cstdint>

#include "ICanvas.hpp"

class DisplayCanvas : public ICanvas
{
public:
    DisplayCanvas();
    ~DisplayCanvas();

    unsigned int width() const final override;
    unsigned int height() const final override;
    
    void blit(uint16_t *pixels, Rect bounds) const final override;

private:
    struct DisplayCanvasImpl;
    std::unique_ptr<DisplayCanvasImpl> data;
};
