cmake_minimum_required(VERSION 3.20.0)
find_package(Zephyr HINTS $ENV{ZEPHYR_BASE})
project(orecart)

target_sources(
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/common/Semaphore.cpp

    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/net/stack/API.cpp
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/net/stack/HTTP.cpp
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/net/stack/Modem.cpp
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/net/events/net_task_event.c
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/net/net_module.cpp
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/net/NetWorker.cpp

    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/ui/canvas/DisplayCanvas.cpp   
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/ui/canvas/SubCanvas.cpp   
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/ui/text/Text.cpp 
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/ui/AScreen.cpp

    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/main.cpp
)