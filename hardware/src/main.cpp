#include <memory>

#include "modules/net/net_module.hpp"

int main()
{
    net::start();
    net::begin_tracking(0);
    return 0;
}
