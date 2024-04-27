#pragma once

#include <memory>

#include "Modem.hpp"
#include "HTTP.hpp"
#include "API.hpp"

class NetModule {
public:
    NetModule(const std::shared_ptr<Modem> modem, std::unique_ptr<API> api);

    void begin_tracking(const int route_id);

private:
    std::shared_ptr<Modem> modem;
    std::unique_ptr<API> api;
};