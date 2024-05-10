#pragma once

#include <memory>
#include "ICanvas.hpp"

class DisplayCanvas : public ICanvas {
public:
    DisplayCanvas();
    ~DisplayCanvas();
    
    unsigned int width() const final override;
    unsigned int height() const final override;
    unsigned int depth() const final override;

    void blit(char *pixels, Rect bounds, unsigned int depth) const final override;

private:
    struct DisplayCanvasImpl;
    std::unique_ptr<DisplayCanvasImpl> data;
};
