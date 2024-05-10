#pragma once

enum NetTaskType
{
    BEGIN_TRACKING
};

struct NetTask
{
    enum NetTaskType type;
    int route_id;
};
