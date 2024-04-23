#pragma once

#include <string_view>
#include <vector>
#include <memory>

#include "HTTP.hpp"
#include "Modem.hpp"

class API
{
public:
    API(std::shared_ptr<Modem> modem, std::unique_ptr<HTTP> http, std::string_view van_guid);

    void send_route_selection(const int route_id) const;
    void send_location(const Location &location) const;

private:
    std::unique_ptr<HTTP> http;
    std::shared_ptr<Modem> modem;
    std::string_view van_guid;
};