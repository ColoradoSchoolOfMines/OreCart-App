#pragma once

#include <memory>

#include "ICanvas.hpp"

template<unsigned int D>
class SubCanvas : public ICanvas<D> {
public:
    SubCanvas(std::shared_ptr<ICanvas<D>> parent, unsigned int x, unsigned int y, unsigned int w, unsigned int h);

    unsigned int width() const override;
    unsigned int height() const override;

    void blit(unsigned int x, unsigned int y, unsigned int w, unsigned int h, char *glyph) override;

private:
    std::shared_ptr<ICanvas<D>> parent;
    unsigned int x, y, w, h;
};

template<unsigned int D>
SubCanvas<D>::SubCanvas(std::shared_ptr<ICanvas<D>> parent, unsigned int x, unsigned int y, unsigned int w, unsigned int h) :
    parent(parent), x(x), y(y), w(w), h(h) {}

template<unsigned int D>
unsigned int SubCanvas<D>::width() const {
    return w;
}

template<unsigned int D>
unsigned int SubCanvas<D>::height() const {
    return h;
}

template<unsigned int D>
void SubCanvas<D>::blit(unsigned int x, unsigned int y, unsigned int w, unsigned int h, char *glyph) {
    parent->blit(this->x + x, this->y + y, w, h, glyph);
}