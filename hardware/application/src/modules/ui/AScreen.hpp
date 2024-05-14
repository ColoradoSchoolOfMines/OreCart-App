#pragma once

#include <vector>

#include "IView.hpp"
#include "canvas/ICanvas.hpp"
#include "canvas/SubCanvas.hpp"

class AScreen
{
    AScreen(ICanvas &canvas);
    virtual ~AScreen(){};

    void attach();
    void detach();

protected:
    void redraw();
    
    void add_view(std::shared_ptr<IView> view);

private:
    ICanvas &canvas;
    Rect drawn_area;
    std::vector<std::shared_ptr<IView>> views;
};
