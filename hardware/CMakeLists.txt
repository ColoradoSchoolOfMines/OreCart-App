# SPDX-License-Identifier: Apache-2.0

cmake_minimum_required(VERSION 3.13.1)

find_package(Zephyr HINTS $ENV{ZEPHYR_BASE})
project(orecart)

target_sources(
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/main.cpp

    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/net/stack/API.cpp
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/net/stack/HTTP.cpp
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/net/stack/Modem.cpp

    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/net/events/net_task_event.c

    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/net/net_module.cpp
    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/net/NetWorker.cpp

    app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/ui/canvas/DisplayCanvas.cpp    
)