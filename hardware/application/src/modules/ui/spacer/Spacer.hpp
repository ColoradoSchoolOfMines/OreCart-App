#pragma once

#include "../IView.hpp"

class Spacer : public IView {
public:
    Spacer(unsigned int height);
    ~Spacer();

    Dimension measure(Dimension limits) final override;
    void draw(ICanvas &canvas) const final override;

private:
    unsigned int height;
};