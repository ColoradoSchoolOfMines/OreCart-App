#include <memory>
#include <vector>

#include "Modem.hpp"

int main()
{
    std::shared_ptr<Modem> modem = std::make_shared<Modem>("example.com");
    modem->set_speed(Modem::Speed::NORMAL);
    std::vector<char> data = { 1, 2, 3, 4 };
    modem->send(data);
}
