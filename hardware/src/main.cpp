#include <memory>
#include <vector>

#include "Modem.hpp"

int main()
{
    std::unique_ptr<Modem> modem = std::make_unique<Modem>("example.com");
    modem->setSpeed(Speed::NORMAL);
    std::vector<char> data{0, 1, 2, 3};
    modem->send(data);
}
