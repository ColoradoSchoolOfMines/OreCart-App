#pragma once

#include <memory>

#include "../../common/Channel.hpp"
#include "../net/NetWorker.hpp"
#include "screen/AScreen.hpp"
#include "event/UIEvent.hpp"

class UIWorker {
public:
    UIWorker();
    UIWorker(std::unique_ptr<ICanvas> canvas);
    
    void step();
    void add_event(UIEvent event);

private:
    std::unique_ptr<ICanvas> canvas;
    Channel<UIEvent> events;
    std::unique_ptr<AScreen> current_screen;
    void consume(UIEvent event);
};