#pragma once

#include <vector>

#include "../IView.hpp"
#include "../canvas/ICanvas.hpp"
#include "../canvas/SubCanvas.hpp"

#include "../../control/button/Button.hpp"
#include "../../net/result/NetResult.hpp"

class AScreen
{
public:
    AScreen(ICanvas &canvas);
    virtual ~AScreen(){};

    virtual void attach();
    virtual void detach();

    virtual void on_button(Button &button);
    virtual void on_net_result(NetResult &result);

protected:
    void redraw();
    
    void add_view(std::shared_ptr<IView> view);

private:
    ICanvas &canvas;
    Rect drawn_area;
    std::vector<std::shared_ptr<IView>> views;
};
