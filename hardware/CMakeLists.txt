# SPDX-License-Identifier: Apache-2.0

cmake_minimum_required(VERSION 3.13.1)

find_package(Zephyr HINTS $ENV{ZEPHYR_BASE})
project(orecart)

target_sources(app PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src/main.cpp)
