"""Dense IG carousel — seasonality + day-of-month timing, real LL logo."""
from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "instagram-carousels"
LOGO = ROOT / "assets" / "logo-ll.png"
W = H = 1080
BG, GOLD, WHITE, MUTED = (0, 0, 0), (212, 175, 55), (255, 255, 255), (168, 168, 168)
LINE = (48, 48, 48)
CARD = (14, 14, 14)
GREEN, RED = (34, 212, 107), (255, 92, 92)
FOOTER = "Leona.Lab  ·  leona-lab.com"
MAX_SCALE = 1.65


def font(size: int, bold: bool = False):
    for name in (
        ("segoeuib.ttf", "seguisb.ttf") if bold else ("segoeui.ttf", "arial.ttf")
    ):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def text_w(draw, text, fnt):
    return draw.textbbox((0, 0), text, font=fnt)[2]


def wrap(draw, text, fnt, max_w):
    words = text.split()
    lines, cur = [], ""
    for word in words:
        test = f"{cur} {word}".strip()
        if text_w(draw, test, fnt) <= max_w:
            cur = test
        else:
            if cur:
                lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def content_bbox(img: Image.Image):
    px = img.load()
    xs, ys = [], []
    for y in range(img.height):
        for x in range(img.width):
            if px[x, y][:3] != BG:
                xs.append(x)
                ys.append(y)
    if not xs:
        return 0, 0, img.width, img.height
    return min(xs), min(ys), max(xs) + 1, max(ys) + 1


def finalize(content: Image.Image, path: Path, mark: str):
    usable_top, usable_bot = 118, 56
    usable_h = H - usable_top - usable_bot
    usable_w = W - 56
    x0, y0, x1, y1 = content_bbox(content)
    cw, ch = max(1, x1 - x0), max(1, y1 - y0)
    scale = min(usable_w / cw, usable_h / ch, MAX_SCALE)
    if scale < 1.0:
        scale = 1.0
    nw, nh = max(1, int(cw * scale)), max(1, int(ch * scale))
    cropped = content.crop((x0, y0, x1, y1)).resize((nw, nh), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (W, H), BG)
    canvas.paste(cropped, ((W - nw) // 2, usable_top + (usable_h - nh) // 2))
    draw = ImageDraw.Draw(canvas)
    logo = Image.open(LOGO).convert("RGBA").resize((78, 78), Image.Resampling.LANCZOS)
    canvas.paste(logo, ((W - 78) // 2, 18), logo)
    ff = font(20, True)
    draw.text(((W - text_w(draw, FOOTER, ff)) // 2, H - 42), FOOTER, font=ff, fill=GOLD)
    if mark:
        mf = font(18, True)
        draw.text((W - 48 - text_w(draw, mark, mf), H - 42), mark, font=mf, fill=(90, 90, 90))
    canvas.save(path, "PNG")
    print(f"saved {path.name} scale={scale:.2f} fill_h={nh/H:.2f}")


def title_block(draw, y, kicker, title, wrap_w=820):
    kf, tf = font(26, True), font(64, True)
    draw.text(((W - text_w(draw, kicker, kf)) // 2, y), kicker, font=kf, fill=GOLD)
    y += 48
    for line in wrap(draw, title, tf, wrap_w):
        draw.text(((W - text_w(draw, line, tf)) // 2, y), line, font=tf, fill=WHITE)
        y += 74
    return y + 18


def body_lines(draw, y, lines, size=36, fill=MUTED, gap=52, wrap_w=820, bold=False):
    fnt = font(size, bold)
    for raw in lines:
        for line in wrap(draw, raw, fnt, wrap_w):
            draw.text(((W - text_w(draw, line, fnt)) // 2, y), line, font=fnt, fill=fill)
            y += gap
        y += 10
    return y


def card(draw, x, y, w, h, title, body, accent, title_size=36, body_size=28):
    draw.rounded_rectangle((x, y, x + w, y + h), radius=22, fill=CARD, outline=LINE, width=3)
    draw.rectangle((x, y, x + 10, y + h), fill=accent)
    tf, bf = font(title_size, True), font(body_size)
    draw.text((x + 28, y + 28), title, font=tf, fill=accent)
    ty = y + 78
    for line in wrap(draw, body, bf, w - 56):
        draw.text((x + 28, ty), line, font=bf, fill=WHITE)
        ty += 40


def rule(draw, y):
    draw.rectangle((120, y, W - 120, y + 3), fill=GOLD)
    return y + 36


def slide_01():
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    y = 40
    d.text(
        ((W - text_w(d, "STAGIONALITA", font(28, True))) // 2, y),
        "STAGIONALITA",
        font=font(28, True),
        fill=GOLD,
    )
    y += 70
    for line in wrap(d, "Perché serve la stagionalità?", font(70, True), 860):
        d.text(((W - text_w(d, line, font(70, True))) // 2, y), line, font=font(70, True), fill=WHITE)
        y += 84
    y = rule(d, y + 10)
    y = body_lines(
        d,
        y,
        [
            "Il prezzo ti dice cosa sta succedendo ora.",
            "La stagione ti dice quando il mercato",
            "ha storicamente più forza o più debolezza.",
            "Mesi e giorni del mese: il timing del calendario.",
        ],
        size=36,
        fill=MUTED,
        gap=50,
    )
    y += 24
    d.rounded_rectangle((90, y, W - 90, y + 150), radius=22, fill=CARD, outline=LINE, width=3)
    bf = font(34, True)
    for i, line in enumerate(["Non è un segnale automatico.", "È un vantaggio di contesto."]):
        d.text(((W - text_w(d, line, bf)) // 2, y + 28 + i * 52), line, font=bf, fill=GOLD)
    finalize(img, OUT / "ig-sea-01-cover.png", "1 / 7")


def slide_02():
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    y = title_block(d, 20, "01  ·  COSA È", "Il ritmo nascosto del prezzo")
    y = rule(d, y)
    y = body_lines(
        d,
        y,
        [
            "Ogni asset ha mesi più forti e mesi più deboli.",
            "Non è magia: è media storica su anni reali.",
            "Ti mostra dove il flusso tende a ripetersi.",
        ],
        size=36,
        gap=50,
    )
    y += 16
    items = [
        ("Mesi forti", "Dove il rendimento medio spinge di più"),
        ("Mesi deboli", "Dove storicamente c’è più pressione"),
        ("Curva cumulata", "Supreme Seasonality: forza nel tempo"),
    ]
    for title, sub in items:
        d.rounded_rectangle((90, y, W - 90, y + 110), radius=20, fill=CARD, outline=LINE, width=3)
        d.ellipse((118, y + 38, 150, y + 70), fill=GOLD)
        d.text((178, y + 22), title, font=font(36, True), fill=WHITE)
        d.text((178, y + 66), sub, font=font(26), fill=MUTED)
        y += 128
    finalize(img, OUT / "ig-sea-02-cosa-e.png", "2 / 7")


def slide_03():
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    y = title_block(d, 20, "02  ·  IL PROBLEMA", "Senza stagione navighi a vista")
    y = rule(d, y)
    y = body_lines(
        d,
        y,
        [
            "Due setup identici non valgono lo stesso",
            "se uno cade in un mese storicamente forte",
            "e l’altro in un mese storicamente debole.",
        ],
        size=36,
        gap=52,
    )
    y += 20
    d.rounded_rectangle((90, y, W - 90, y + 320), radius=22, fill=CARD, outline=LINE, width=3)
    d.text((120, y + 36), "Cosa rischi senza calendario", font=font(34, True), fill=GOLD)
    for i, line in enumerate(
        [
            "• entrare contro il vento stagionale",
            "• forzare trade in mesi mediocri",
            "• ignorare quando il flusso aiuta",
            "• confondere rumore con edge",
        ]
    ):
        d.text((120, y + 100 + i * 48), line, font=font(32), fill=WHITE)
    finalize(img, OUT / "ig-sea-03-perche.png", "3 / 7")


def slide_04():
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    y = title_block(d, 10, "03  ·  I MESI", "Prima il mese, poi il trade", wrap_w=860)
    y = rule(d, y)
    card(
        d,
        70,
        y,
        940,
        230,
        "Mese con bias long",
        "Se la media storica è positiva, il vento ti aiuta. Cerca long con più pazienza, short con più filtro.",
        GREEN,
        38,
        30,
    )
    y += 258
    card(
        d,
        70,
        y,
        940,
        230,
        "Mese con bias short",
        "Se la media storica è negativa, il mercato tende a pesare. Non è un ordine: è un avviso di contesto.",
        RED,
        38,
        30,
    )
    y += 258
    body_lines(
        d,
        y,
        ["Regola: allinea direzione e stagione."],
        size=32,
        fill=GOLD,
        gap=44,
        bold=True,
    )
    finalize(img, OUT / "ig-sea-04-mesi.png", "4 / 7")


def slide_05():
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    y = title_block(d, 10, "04  ·  GIORNI DEL MESE", "Il timing dentro il mese")
    y = rule(d, y)
    y = body_lines(
        d,
        y,
        [
            "Non basta sapere che agosto è forte.",
            "Serve sapere quale giorno del mese",
            "è storicamente più favorevole.",
        ],
        size=36,
        gap=50,
    )
    y += 12
    d.rounded_rectangle((90, y, W - 90, y + 340), radius=22, fill=CARD, outline=LINE, width=3)
    d.text((120, y + 30), "Su Leona.Lab, per ogni mese", font=font(34, True), fill=GOLD)
    for i, line in enumerate(
        [
            "• giorno long più probabile",
            "• giorno short più probabile",
            "• media e hit-rate su dati reali",
            "• niente numeri inventati",
            "• * = campione debole, da filtrare",
        ]
    ):
        d.text((120, y + 95 + i * 44), line, font=font(30), fill=WHITE)
    finalize(img, OUT / "ig-sea-05-giorni.png", "5 / 7")


def slide_06():
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    y = title_block(d, 10, "05  ·  COME USARLA", "Stagione = quando, non quanto")
    y = rule(d, y)
    steps = [
        ("1", "Leggi il mese", "Bias stagionale long o short"),
        ("2", "Apri i giorni", "Timing long / short del mese"),
        ("3", "Incrocia COT e bias", "Solo dopo costruisci il trade"),
    ]
    for num, title, sub in steps:
        d.rounded_rectangle((90, y, W - 90, y + 150), radius=20, fill=CARD, outline=LINE, width=3)
        d.ellipse((118, y + 40, 178, y + 100), outline=GOLD, width=3)
        d.text(
            (118 + (60 - text_w(d, num, font(32, True))) // 2, y + 52),
            num,
            font=font(32, True),
            fill=GOLD,
        )
        d.text((210, y + 36), title, font=font(36, True), fill=WHITE)
        d.text((210, y + 86), sub, font=font(28), fill=MUTED)
        y += 168
    finalize(img, OUT / "ig-sea-06-come-usarla.png", "6 / 7")


def slide_07():
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    y = 30
    d.text(
        ((W - text_w(d, "LEONA.LAB", font(28, True))) // 2, y),
        "LEONA.LAB",
        font=font(28, True),
        fill=GOLD,
    )
    y += 70
    for line in wrap(d, "Vuoi il calendario sul desk?", font(64, True), 860):
        d.text(((W - text_w(d, line, font(64, True))) // 2, y), line, font=font(64, True), fill=WHITE)
        y += 78
    y = rule(d, y + 8)
    y = body_lines(
        d,
        y,
        [
            "Su Leona.Lab: mesi, curva Supreme,",
            "timing giorni del mese e bias operativo.",
            "Il quando, senza rumore.",
        ],
        size=36,
        gap=52,
    )
    y += 24
    d.rounded_rectangle((140, y, W - 140, y + 120), radius=22, fill=GOLD)
    cta = "Apri leona-lab.com"
    cf = font(40, True)
    d.text(((W - text_w(d, cta, cf)) // 2, y + 36), cta, font=cf, fill=BG)
    y += 160
    body_lines(d, y, ["Stagionalità · giorni del mese · contesto"], size=28, fill=MUTED, gap=44)
    finalize(img, OUT / "ig-sea-07-cta.png", "7 / 7")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    slide_01()
    slide_02()
    slide_03()
    slide_04()
    slide_05()
    slide_06()
    slide_07()
    print("DONE", OUT)


if __name__ == "__main__":
    main()
