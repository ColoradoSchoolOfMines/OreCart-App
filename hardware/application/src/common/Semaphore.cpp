#include "Semaphore.hpp"

#include <zephyr/kernel.h>

struct Semaphore::SemaphoreImpl {
    struct k_sem semaphore;
};

Semaphore::Semaphore() : Semaphore(0) {}

Semaphore::Semaphore(const int initial_count) : Semaphore(initial_count, K_SEM_MAX_LIMIT) {}

Semaphore::Semaphore(const int initial_count, const int max_count) {
    data = std::make_unique<SemaphoreImpl>();
    k_sem_init(&data->semaphore, initial_count, max_count);
}

Semaphore::~Semaphore() {}

void Semaphore::take() {
    const int res = k_sem_take(&data->semaphore, K_FOREVER);
    if (res != 0) {
        throw std::runtime_error("Failed to take semaphore");
    }
}

void Semaphore::take(const unsigned long timeout_ms) {
    const int res = k_sem_take(&data->semaphore, K_MSEC(timeout_ms));
    if (res != 0) {
        throw std::runtime_error("Failed to take semaphore");
    }
}

void Semaphore::give() {
    k_sem_give(&data->semaphore);
}

void Semaphore::reset() {
    k_sem_reset(&data->semaphore);
}

unsigned int Semaphore::count() {
    return k_sem_count_get(&data->semaphore);
}

