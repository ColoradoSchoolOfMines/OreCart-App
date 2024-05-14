#pragma once

#include <queue>

#include "Semaphore.hpp"

template<typename T>
class IInChannel {
public:
    IInChannel() {}
    virtual ~IInChannel() {}

    virtual T recieve() = 0;
};

template<typename T>
class IOutChannel {
public:
    IOutChannel() {}
    virtual ~IOutChannel() {}

    virtual void send(T value) = 0;
};

template<typename T>
class Channel : public IInChannel<T>, public IOutChannel<T> {
public:
    Channel();
    ~Channel();
    Channel(const Channel &other) = delete;
    Channel &operator=(const Channel &other) = delete;
    
    T recieve() final override;
    void send(T value) final override;
    bool empty();

private:
    Semaphore sem;
    std::queue<T> queue;
};

template<typename T>
Channel<T>::Channel() : sem(0) {}

template<typename T>
Channel<T>::~Channel() {}

template<typename T>
T Channel<T>::recieve() {
    sem.take();
    T value = queue.front();
    queue.pop();
    return value;
}

template<typename T>
void Channel<T>::send(T value) {
    queue.push(value);
    sem.give();
}

template<typename T>
bool Channel<T>::empty() {
    return sem.count() == 0;
}