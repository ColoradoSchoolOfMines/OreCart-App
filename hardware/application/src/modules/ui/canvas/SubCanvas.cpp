#include "SubCanvas.hpp"

SubCanvas::SubCanvas(ICanvas& parent, Rect adj) : parent(parent), adj(adj){};

SubCanvas::~SubCanvas(){};

Dimension SubCanvas::size() const
{
    return parent.size();
}

void SubCanvas::blit(uint16_t *pixels, Rect bounds) const
{
    parent.blit(pixels, {bounds.x, bounds.y, bounds.w + adj.w, bounds.h + adj.h});
}

void SubCanvas::clear(Rect bounds) const
{
    parent.clear({bounds.x, bounds.y, bounds.w + adj.w, bounds.h + adj.h});
}