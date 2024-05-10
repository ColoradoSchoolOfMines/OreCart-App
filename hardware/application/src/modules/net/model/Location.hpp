#pragma once

#include <ctime>

struct Coordinate
{
    double latitude;
    double longitude;
};

struct Location
{
    time_t timestamp;
    Coordinate coord;
};