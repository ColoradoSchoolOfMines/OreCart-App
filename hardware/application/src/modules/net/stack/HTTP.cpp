#include "HTTP.hpp"
#include <sstream>
#include <string_view>

HTTP::HTTP() {}

std::vector<char> HTTP::get(const std::string_view route, const std::vector<char> &body) const
{
    std::string_view header = build_header("GET", route, body.size());
    return construct_packet(header, body);
}

std::vector<char> HTTP::post(const std::string_view route, const std::vector<char> &body) const
{
    std::string_view header = build_header("POST", route, body.size());
    return construct_packet(header, body);
}

std::string_view HTTP::build_header(const std::string_view &method, const std::string_view route, const size_t contentLength) const
{
    std::ostringstream oss;
    oss << method << " " << route << " HTTP/1.1\r\n";
    oss << "Connection: close\r\n";
    oss << "User-Agent: PostManRuntime/10.24.11\r\n";
    oss << "Content-Type: application/octet-stream\r\n";
    oss << "Content-Length: " << contentLength << "\r\n";
    oss << "\r\n";
    return oss.str();
}

std::vector<char> HTTP::construct_packet(const std::string_view &header, const std::vector<char> &body) const
{
    std::vector<char> packet(header.begin(), header.end());
    packet.insert(packet.end(), body.begin(), body.end());
    return packet;
}
