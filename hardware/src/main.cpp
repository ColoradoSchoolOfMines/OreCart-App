#include <memory>
#include <vector>

#include "Modem.hpp"
#include "HTTP.hpp"

int main()
{
    std::shared_ptr<Modem> modem = std::make_shared<Modem>("example.com");
    std::shared_ptr<HTTP> http = std::make_shared<HTTP>();
    std::vector<char> data = http->get("/", {});
    modem->set_speed(Modem::Speed::NORMAL);
    modem->send(data);
}
