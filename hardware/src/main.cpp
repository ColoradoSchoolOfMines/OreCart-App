#include <memory>

#include "modules/net/NetModule.hpp"

int main()
{
    std::unique_ptr<HTTP> http = std::make_unique<HTTP>();
    std::shared_ptr<Modem> modem = std::make_shared<Modem>("");
    std::unique_ptr<API> api = std::make_unique<API>(modem, std::move(http), "");
    std::unique_ptr<NetModule> net_module = std::make_unique<NetModule>(modem, std::move(api));
    net_module->begin_tracking(0);
    return 0;
}
