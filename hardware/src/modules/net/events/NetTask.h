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

struct NetTask net_task_begin_tracking(int route_id);
