"""
Remove a linha "MKT DIGITAL" do logo e coloca a frase nova no lugar,
no mesmo estilo dourado da legenda antiga (ESTRATEGIA * TRAFEGO * CONVERSAO).
Rodar com: python3.13 scripts/edit_logo.py
"""
from PIL import Image, ImageDraw, ImageFont
import os

SRC = "assets/logo/ams-mkt-digital.png"
OUT = "assets/logo/ams-mkt-digital.png"
GOLD_TEXT = (140, 117, 45, 255)  # media da legenda antiga
FONT_BOLD = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"

PHRASE = "ESTRATÉGIA, CONVERSÃO E CRESCIMENTO"
LETTER_SPACING = 2  # px extra entre caracteres


def draw_spaced_text(draw, xy, text, font, fill, spacing):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        w = draw.textlength(ch, font=font)
        x += w + spacing
    return x


def spaced_text_width(draw, text, font, spacing):
    total = 0
    for ch in text:
        total += draw.textlength(ch, font=font) + spacing
    return total - spacing if text else 0


im = Image.open(SRC).convert("RGBA")

# Recorta só o símbolo (remove "MKT DIGITAL", a régua antiga e a legenda antiga)
symbol = im.crop((8, 5, 313, 178))

pad_top = 6
gap_before_rule = 10
rule_h = 2
gap_after_rule = 10
font_size = 15
font = ImageFont.truetype(FONT_BOLD, font_size)

tmp = Image.new("RGBA", (10, 10))
tmp_draw = ImageDraw.Draw(tmp)
text_w = spaced_text_width(tmp_draw, PHRASE, font, LETTER_SPACING)

# Reduz a fonte até a frase caber na largura do símbolo
while text_w > symbol.width - 10 and font_size > 8:
    font_size -= 1
    font = ImageFont.truetype(FONT_BOLD, font_size)
    text_w = spaced_text_width(tmp_draw, PHRASE, font, LETTER_SPACING)

ascent, descent = font.getmetrics()
text_h = ascent + descent

canvas_w = symbol.width
canvas_h = symbol.height + pad_top + gap_before_rule + rule_h + gap_after_rule + text_h + 8

canvas = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
canvas.paste(symbol, (0, pad_top), symbol)

draw = ImageDraw.Draw(canvas)
rule_y = pad_top + symbol.height + gap_before_rule
rule_margin = canvas_w * 0.28
draw.line(
    [(rule_margin, rule_y), (canvas_w - rule_margin, rule_y)],
    fill=GOLD_TEXT,
    width=rule_h,
)

text_y = rule_y + gap_after_rule
text_x = (canvas_w - text_w) / 2
draw_spaced_text(draw, (text_x, text_y), PHRASE, font, GOLD_TEXT, LETTER_SPACING)

canvas.save(OUT, "PNG", optimize=True)
print(f"OK: {OUT} -> {canvas.size}, font_size={font_size}, text_w={text_w:.0f}")
