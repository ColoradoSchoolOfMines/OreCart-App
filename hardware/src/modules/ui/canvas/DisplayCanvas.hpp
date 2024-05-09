#pragma once

#include <memory>
#include "ICanvas.hpp"

class DisplayCanvas : public ICanvas<2> {
public:
    DisplayCanvas();
    ~DisplayCanvas();
    
    unsigned int width() const;
    unsigned int height() const;

    void blit(unsigned int x, unsigned int y, unsigned int w, unsigned int h, char *glyph);

private:
    struct DisplayCanvasImpl;
    std::unique_ptr<DisplayCanvasImpl> data;
};
