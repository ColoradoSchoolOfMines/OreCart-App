#pragma once

struct Point
{
    unsigned int x, y;

    Point() : x(0), y(0) {}

    Point(const unsigned int x, const unsigned int y) : x(x), y(y) {}

    Point(const Point &rhs) : x(rhs.x), y(rhs.y) {}

    Point(const Point &&rhs) : x(rhs.x), y(rhs.y) {}

    void operator=(const Point &rhs)
    {
        x = rhs.x;
        y = rhs.y;
    }

    bool operator==(const Point &rhs) const
    {
        return x == rhs.x && y == rhs.y;
    }

    bool operator!=(const Point &rhs) const
    {
        return !(*this == rhs);
    }

    bool operator<(const Point &rhs) const
    {
        return x < rhs.x || y < rhs.y;
    }

    bool operator>(const Point &rhs) const
    {
        return x > rhs.x || y > rhs.y;
    }

    Point operator+(const Point &rhs) const
    {
        return {x + rhs.x, y + rhs.y};
    }

    Point operator-(const Point &rhs) const
    {
        return {x - rhs.x, y - rhs.y};
    }

    Point operator/(const unsigned int rhs) const
    {
        return {x / rhs, y / rhs};
    }

    Point operator*(const unsigned int rhs) const
    {
        return {x * rhs, y * rhs};
    }
};

// void operator+=(Point &lhs, const Point &rhs)
// {
//     lhs.x += rhs.x;
//     lhs.y += rhs.y;
// }

// void operator-=(Point &lhs, const Point &rhs)
// {
//     lhs.x -= rhs.x;
//     lhs.y -= rhs.y;
// }

// void operator/=(Point &lhs, const unsigned int rhs)
// {
//     lhs.x /= rhs;
//     lhs.y /= rhs;
// }

// void operator*=(Point &lhs, const unsigned int rhs)
// {
//     lhs.x *= rhs;
//     lhs.y *= rhs;
// }

struct Dimension
{
    unsigned int w, h;

    Dimension() : w(0), h(0) {}

    Dimension(const unsigned int w, const unsigned int h) : w(w), h(h) {}

    Dimension(const Dimension &rhs) : w(rhs.w), h(rhs.h) {}

    Dimension(const Dimension &&rhs) : w(rhs.w), h(rhs.h) {}

    void operator=(const Dimension &rhs)
    {
        w = rhs.w;
        h = rhs.h;
    }

    bool operator==(const Dimension &rhs) const
    {
        return w == rhs.w && h == rhs.h;
    }

    bool operator!=(const Dimension &rhs) const
    {
        return !(*this == rhs);
    }

    bool operator<(const Dimension &rhs) const
    {
        return w < rhs.w || h < rhs.h;
    }

    bool operator>(const Dimension &rhs) const
    {
        return w > rhs.w || h > rhs.h;
    }

    Dimension operator+(const Dimension &rhs) const
    {
        return {w + rhs.w, h + rhs.h};
    }

    Dimension operator-(const Dimension &rhs) const
    {
        return {w - rhs.w, h - rhs.h};
    }

    Dimension operator/(const unsigned int rhs) const
    {
        return {w / rhs, h / rhs};
    }

    Dimension operator*(const unsigned int rhs) const
    {
        return {w * rhs, h * rhs};
    }
};

// void operator+=(Dimension &lhs, const Dimension &rhs)
// {
//     lhs.w += rhs.w;
//     lhs.h += rhs.h;
// }

// void operator-=(Dimension &lhs, const Dimension &rhs)
// {
//     lhs.w -= rhs.w;
//     lhs.h -= rhs.h;
// }

// void operator/=(Dimension &lhs, const unsigned int rhs)
// {
//     lhs.w /= rhs;
//     lhs.h /= rhs;
// }

// void operator*=(Dimension &lhs, const unsigned int rhs)
// {
//     lhs.w *= rhs;
//     lhs.h *= rhs;
// }

struct Rect
{
    unsigned int x, y, w, h;

    Rect(const unsigned int x, const unsigned int y, const unsigned int w, const unsigned int h) : x(x), y(y), w(w), h(h) {}

    Rect(const Point &p, const Dimension &d) : x(p.x), y(p.y), w(d.w), h(d.h) {}

    Rect(const unsigned int x, const unsigned int y, const Dimension &d) : x(x), y(y), w(d.w), h(d.h) {}

    Rect(const Point &p, const unsigned int w, const unsigned int h) : x(p.x), y(p.y), w(w), h(h) {}

    Rect(const Rect &rhs) : x(rhs.x), y(rhs.y), w(rhs.w), h(rhs.h) {}

    Rect(const Rect &&rhs) : x(rhs.x), y(rhs.y), w(rhs.w), h(rhs.h) {}

    Point pos() const
    {
        return {x, y};
    }

    Dimension size() const
    {
        return {w, h};
    }

    void operator=(const Rect &rhs)
    {
        x = rhs.x;
        y = rhs.y;
        w = rhs.w;
        h = rhs.h;
    }

    bool operator==(const Rect &rhs) const
    {
        return x == rhs.x && y == rhs.y && w == rhs.w && h == rhs.h;
    }

    bool operator!=(const Rect &rhs) const
    {
        return !(*this == rhs);
    }
};

