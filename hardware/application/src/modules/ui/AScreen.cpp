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
    std::vector<std::shared_ptr<IView>> valid_views;
    for (size_t i = 0; i < views.size(); i++)
    {
        IView &view = *views[i];
        Dimension size = view.measure(canvas.size());
        Dimension new_bounds = bounds;
        if (size.w > bounds.w)
        {
            new_bounds.w = size.w;
        }
        new_bounds.h += size.h;
        if (new_bounds > canvas.size())
        {
            break;
        }
        bounds = new_bounds;
        sizes.push_back(size);
        valid_views.push_back(views[i]);
    }
    printf("bounds: %d %d\n", bounds.w, bounds.h);
    
    Dimension half = (canvas.size() - bounds) / 2;
    printf("half: %d %d\n", half.w, half.h);
    // canvas.clear(drawn_area);
    drawn_area = {half.w, half.h, bounds};
    printf("drawn_area: %d %d %d %d\n", drawn_area.x, drawn_area.y, drawn_area.w, drawn_area.h);
    

    Point pos = drawn_area.pos();
    for (size_t i = 0; i < sizes.size(); i++)
    {
    printf("pos: %d %d\n", pos.x, pos.y);
        Dimension size = sizes[i];
        Rect area{pos, size};
        SubCanvas subcanvas{canvas, area};
        views[i]->draw(subcanvas);
        pos.y += size.h;
    }
}

void AScreen::add_view(std::shared_ptr<IView> view)
{
    views.push_back(view);
}
