#pragma once

#include <vector>
#include <string_view>
#include <memory>

enum Speed {
    NORMAL,
    YEET
};

class Modem
{
public:
    Modem(std::string_view domain);
    ~Modem();

    void setSpeed(Speed speed);
    void send(std::vector<char> &packet);

private:
    struct ModemImpl;
    std::unique_ptr<ModemImpl> data;
};
