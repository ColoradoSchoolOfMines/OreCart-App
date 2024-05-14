#include "AScreen.hpp"

AScreen::AScreen(ICanvas &canvas) : canvas(canvas), drawn_area({0, 0, 0, 0}) {}

void AScreen::attach()
{
    redraw();
}

void AScreen::detach()
{
    canvas.clear(drawn_area);
}

void AScreen::redraw()
{
    Dimension bounds;
    std::vector<Dimension> sizes;
    std::vector<IView> valid_views;
    for (int i = 0; i < views.size(); i++)
    {
        IView &view = *views[i];
        Dimension size = view.measure(canvas.size());
        if (size.w > bounds.w)
        {
            bounds.w = size.w;
        }
        bounds.h += size.h;
        sizes.push_back(size);
    }
    if (bounds > canvas.size())
    {
        throw std::runtime_error("AFragment::redraw: bounds exceed canvas size");
    }
    
    Dimension half = (canvas.size() - bounds) / 2;
    canvas.clear(drawn_area);
    drawn_area = {half.w, half.h, bounds};

    Point pos = drawn_area.pos();
    for (size_t i = 0; i < views.size(); i++)
    {
        Dimension size = sizes[i];
        Rect area{0, 0, size};
        SubCanvas subcanvas{canvas, area};
        views[i]->draw(subcanvas);
        pos.y += size.h;
    }
}

void AScreen::add_view(std::shared_ptr<IView> view)
{
    views.push_back(view);
}
