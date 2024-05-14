#pragma once

#include <memory>

class Semaphore {
public:
    Semaphore();
    Semaphore(const int initial_count);
    Semaphore(const int initial_count, const int max_count);
    Semaphore(const Semaphore &) = delete;
    Semaphore &operator=(const Semaphore &) = delete;
    ~Semaphore();

    void take();
    void take(const unsigned long timeout_ms);
    void give();
    void reset();
    unsigned int count();

private:
    struct SemaphoreImpl;
    std::unique_ptr<SemaphoreImpl> data;
};