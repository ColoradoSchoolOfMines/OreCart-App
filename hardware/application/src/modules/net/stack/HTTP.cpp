#include "HTTP.hpp"
#include <sstream>
#include <string_view>
#include <algorithm>
#include <string>

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

std::vector<char> HTTP::body(const std::vector<char> &response) const
{
    // Convert the response to a string
    std::string responseStr(response.begin(), response.end());

    // Find the position of the double line break that separates the header and body
    size_t bodyStartPos = responseStr.find("\r\n\r\n");

    if (bodyStartPos == std::string::npos) {
        // Invalid response, return an empty body
        return {};
    }

    // Extract the body from the response
    std::vector<char> responseBody(response.begin() + bodyStartPos + 4, response.end());

    // Check the status of the response
    std::string responseHeader(response.data(), bodyStartPos);
    std::istringstream iss(responseHeader);
    std::string httpVersion;
    int statusCode;
    iss >> httpVersion >> statusCode;

    if (httpVersion != "HTTP/1.1" || statusCode != 200) {
        // Invalid status, return an empty body
        return {};
    }

    return responseBody;
}

std::vector<char> HTTP::construct_packet(const std::string_view &header, const std::vector<char> &body) const
{
    std::vector<char> packet(header.begin(), header.end());
    packet.insert(packet.end(), body.begin(), body.end());
    return packet;
}
