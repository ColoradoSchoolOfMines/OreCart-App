#pragma once

#include "canvas/Geometry.hpp"
#include "canvas/ICanvas.hpp"

class IView
{
public:
    IView() {}
    virtual ~IView(){};

    virtual Dimension measure(Dimension limits) = 0;
    virtual void draw(ICanvas &canvas) const = 0;
};
