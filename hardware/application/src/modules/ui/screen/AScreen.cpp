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

void AScreen::on_button(Button &button)
{
    // Do nothing
}

void AScreen::on_net_result(NetResult &result)
{
    // Do nothing
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
    
    Dimension half_canvas = (canvas.size() - bounds) / 2;
    canvas.clear(drawn_area);
    drawn_area = {half_canvas.w, half_canvas.h, bounds};

    Point pos = drawn_area.pos();
    for (size_t i = 0; i < sizes.size(); i++)
    {
        Dimension size = sizes[i];
        Dimension half_bounds = (bounds - size) / 2;
        Rect area{pos.x + half_bounds.w, pos.y, size};
        SubCanvas subcanvas{canvas, area};
        views[i]->draw(subcanvas);
        pos.y += size.h;
    }
}

void AScreen::add_view(std::shared_ptr<IView> view)
{
    views.push_back(view);
}

void AScreen::remove_view(std::shared_ptr<IView> view)
{
    views.erase(std::remove(views.begin(), views.end(), view), views.end());
}