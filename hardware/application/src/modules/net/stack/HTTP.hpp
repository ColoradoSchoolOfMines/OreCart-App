#pragma once

#include <string_view>
#include <vector>

class HTTP
{
public:
    HTTP();
    std::vector<char> get(const std::string_view route, const std::vector<char> &body) const;
    std::vector<char> post(const std::string_view route, const std::vector<char> &body) const;

private:
    std::string_view build_header(const std::string_view &method, const std::string_view route, const size_t contentLength) const;
    std::vector<char> construct_packet(const std::string_view &header, const std::vector<char> &body) const;
};