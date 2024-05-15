#include "Text.hpp"

#include "../../../generated/Font.hpp"

Text::Text()
{
}

Text::~Text()
{
}

std::string_view Text::get_text() const
{
    return text;
}

void Text::set_text(const std::string_view text)
{
    this->text = text;
}

Dimension Text::measure(Dimension limits)
{
    return {text.size() * 11, 20};
}

void Text::draw(ICanvas &canvas) const
{
    for (size_t i = 0; i < text.size(); i++)
    {
        char c = text[i];
        if (c <= 32 || c >= 128)
        {
            continue;
        }
        const Glyph<11, 20> &glyph = FONT[c - 33];
        glyph.draw(canvas, i * 11, 0);
    }
}