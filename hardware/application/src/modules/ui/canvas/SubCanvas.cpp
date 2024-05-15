#include "SubCanvas.hpp"

SubCanvas::SubCanvas(ICanvas& parent, Rect adj) : parent(parent), adj(adj){};

SubCanvas::~SubCanvas(){};

Dimension SubCanvas::size() const
{
    return adj.size();
}

void SubCanvas::blit(const uint16_t *pixels, Rect bounds) const
{
    parent.blit(pixels, {bounds.x + adj.x, bounds.y + adj.y, bounds.w, bounds.h});
}

void SubCanvas::clear(Rect bounds) const
{
    parent.clear({bounds.x + adj.x, bounds.y + adj.y, bounds.w, bounds.h});
}