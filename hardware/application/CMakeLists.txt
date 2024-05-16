cmake_minimum_required(VERSION 3.20.0)
find_package(Zephyr HINTS $ENV{ZEPHYR_BASE})
project(orecart)

target_sources(
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/common/Semaphore.cpp

    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/net/stack/API.cpp
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/net/stack/HTTP.cpp
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/net/stack/Modem.cpp
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/net/task/net_task_event.c
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/net/task/NetTask.cpp
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/net/task/net_task_terminal.cpp
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/net/result/net_result_event.c
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/net/result/NetResult.cpp
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/net/result/net_result_terminal.cpp
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/net/NetWorker.cpp
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/net/net_module.cpp
    
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/control/button/button_event.c
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/control/button/button_terminal.cpp
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/control/control_module.cpp

    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/ui/canvas/DisplayCanvas.cpp   
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/ui/canvas/SubCanvas.cpp   
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/ui/canvas/RectShape.cpp   
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/ui/text/Text.cpp
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/ui/select/Select.cpp
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/ui/select/SelectGroup.cpp
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/ui/spacer/Spacer.cpp
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/ui/screen/AScreen.cpp
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/ui/route_select/RouteSelectScreen.cpp
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/ui/event/UIEvent.cpp
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/ui/UIWorker.cpp
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/ui/ui_module.cpp

    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/main.cpp
)