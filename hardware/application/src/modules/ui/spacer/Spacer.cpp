#include "Spacer.hpp"

Spacer::Spacer(unsigned int height) : height(height) {}

Spacer::~Spacer() {}

Dimension Spacer::measure(Dimension limits) {
    return {0, height};
}

void Spacer::draw(ICanvas &canvas) const {
    (void)canvas;
}