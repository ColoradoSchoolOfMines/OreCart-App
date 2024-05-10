#pragma once

#include <memory>

#include "Rect.hpp"
#include "ICanvas.hpp"

class SubCanvas : public ICanvas {
public:
    SubCanvas(std::shared_ptr<ICanvas> parent, Rect adj);
    ~SubCanvas();

    unsigned int width() const final override;
    unsigned int height() const final override;
    unsigned int depth() const final override;

    void blit(char *pixels, Rect bounds, unsigned int depth) const final override;

private:
    std::shared_ptr<ICanvas> parent;
    Rect adj;
};
