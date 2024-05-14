from PIL import Image, ImageDraw, ImageFont
import unicodedata

def render_font_to_byte_arrays(font_path, font_size, pixel_height):
    font = ImageFont.truetype(font_path, font_size)
    char_byte_arrays = []

    names = []

    print("#pragma once\n")
    print("#include <array>\n")
    print("#include \"../modules/ui/canvas/Glyph.hpp\"\n")

    expected_width = -1
    max_height = 0
    for char_code in range(33, 127):
        char = chr(char_code)
        left, top, right, bottom = font.getbbox(char)
        width = right
        if expected_width == -1:
            expected_width = width
        else:
            assert expected_width == width

        height = bottom
        max_height = max(max_height, height)

    # Scale down width/height to pixel size 1:1
    raw_width = expected_width
    raw_height = max_height
    scaled_width = int(pixel_height * raw_width / raw_height)
    scaled_height = pixel_height
    adj = 4
    cropped_height = scaled_height - adj

    final_width = scaled_width
    final_height = cropped_height

    for char_code in range(33, 127):
        char = chr(char_code)
        
        image = Image.new('L', (raw_width, raw_height), 0).convert("RGB")
        draw = ImageDraw.Draw(image)
        draw.text((0, 0), char, font=font, fill=(255, 255, 255))
        image = image.resize((scaled_width, scaled_height))
        image = image.crop((0, adj, scaled_width, scaled_height))

        char_name = unicodedata.name(char).upper().replace(" ", "_").replace("-", "_")

        image.save(f"tests/char_{char_name}.png")
        print(f"const std::array<uint16_t, {final_width * final_height}> {char_name}_DATA = {{")
        for y in range(cropped_height):
            print("    ", end="")
            for x in range(scaled_width):
                r, g, b = image.getpixel((x, y))
                # Convert to 16-bit rgb 565
                pixel = (r >> 3) << 11 | (g >> 2) << 5 | (b >> 3)
                print(f"0x{pixel:04X}, ", end="")
            print("")
        print("};")
        print("")

        print(f"const Glyph<{final_width}, {final_height}> {char_name} {{ {char_name}_DATA }};" )
        print("")

        names.append(char_name)
    
    print (f"const std::array<Glyph<{final_width}, {final_height}>, {len(names)}> FONT = {{")
    for name in names:
        print(f"    {name},")
    print("};")

font_path = "./RobotoMono-Regular.ttf"
font_size = 28
pixel_size = 24

render_font_to_byte_arrays(font_path, font_size, pixel_size)