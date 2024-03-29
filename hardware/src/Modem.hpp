#pragma once

#include <vector>
#include <string_view>
#include <memory>

#include "Model.hpp"

class Modem
{
public:
    enum Speed {
        NORMAL,
        YEET
    };

    Modem(std::string_view domain);
    ~Modem();

    void set_speed(Speed speed);
    void send(std::vector<char> &packet);
    Coordinate locate();

private:
    struct ModemImpl;
    std::unique_ptr<ModemImpl> data;
};
