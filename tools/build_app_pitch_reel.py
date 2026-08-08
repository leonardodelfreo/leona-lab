"""Leona.Lab app pitch Reel v2 — clean fades, readable crops, proper pacing."""
from __future__ import annotations

import math
import shutil
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "instagram" / "reels"
ARTIFACT = Path("/opt/cursor/artifacts/reels")
ASSETS = Path("/tmp/reel-assets")
LOGO = ROOT / "assets" / "logo-ll.png"

W, H = 1080, 1920
FPS = 30
BG = (0, 0, 0)
GOLD = (212, 175, 55)
WHITE = (255, 255, 255)
MUTED = (168, 168, 168)
CARD = (18, 18, 18)
LINE = (48, 48, 48)
GREEN = (34, 212, 107)
RED = (255, 92, 92)
WAIT_C = (230, 190, 80)

_FONT_BOLD = [
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    "/usr/share/fonts/truetype/macos/Inter-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]
_FONT_REG = [
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    "/usr/share/fonts/truetype/macos/Inter-Regular.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
]


def font(size: int, bold: bool = False):
    for p in _FONT_BOLD if bold else _FONT_REG:
        try:
            return ImageFont.truetype(p, size)
        except OSError:
            continue
    return ImageFont.load_default()


def tw(draw, text, fnt):
    return draw.textbbox((0, 0), text, font=fnt)[2]


def wrap(draw, text, fnt, max_w):
    words = text.split()
    lines, cur = [], ""
    for word in words:
        test = f"{cur} {word}".strip()
        if tw(draw, test, fnt) <= max_w:
            cur = test
        else:
            if cur:
                lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def clamp(t, a=0.0, b=1.0):
    return max(a, min(b, t))


def ease_out(t):
    t = clamp(t)
    return 1 - (1 - t) ** 3


def ease_in_out(t):
    t = clamp(t)
    return 0.5 - 0.5 * math.cos(math.pi * t)


def lerp(a, b, t):
    return a + (b - a) * t


def blank():
    return Image.new("RGB", (W, H), BG)


def logo_img(size=96, opacity=255):
    logo = Image.open(LOGO).convert("RGBA").resize((size, size), Image.Resampling.LANCZOS)
    if opacity < 255:
        a = logo.split()[3].point(lambda p: int(p * opacity / 255))
        logo.putalpha(a)
    return logo


def paste_logo(canvas, y=64, size=88, opacity=255):
    logo = logo_img(size, opacity)
    canvas.paste(logo, ((W - size) // 2, y), logo)


def footer(draw):
    f = font(22, True)
    txt = "Leona.Lab  ·  leona-lab.com"
    draw.text(((W - tw(draw, txt, f)) // 2, H - 64), txt, font=f, fill=GOLD)


def gold_rule(draw, y, width=400, alpha=1.0):
    w = max(0, int(width))
    if w < 2:
        return
    col = tuple(int(c * alpha) for c in GOLD)
    draw.rectangle(((W - w) // 2, y, (W + w) // 2, y + 3), fill=col)


def particles(draw, t, n=20):
    for i in range(n):
        seed = (i * 97 + 13) % 1000
        x = (seed * 37 + int(t * (18 + i % 5) * 12)) % W
        y = int((H + 180) - ((t * (35 + i % 9) * 28 + seed * 3) % (H + 360)))
        r = 1 + (i % 2)
        a = 0.2 + 0.45 * abs(math.sin(t * 0.8 + i))
        draw.ellipse((x - r, y - r, x + r, y + r), fill=tuple(int(c * a) for c in GOLD))


def centered_text(draw, text, y, fnt, fill):
    draw.text(((W - tw(draw, text, fnt)) // 2, y), text, font=fnt, fill=fill)


# ---- dashboard crops (readable, fill frame) ----

def crop_dash(path: Path, box_frac) -> Image.Image:
    """Crop a region of desktop screenshot and fit into 9:16 with brand chrome."""
    src = Image.open(path).convert("RGB")
    x0, y0, x1, y1 = box_frac
    left = int(src.width * x0)
    top = int(src.height * y0)
    right = int(src.width * x1)
    bot = int(src.height * y1)
    region = src.crop((left, top, right, bot))

    canvas = blank()
    # Fit to usable area under logo / above footer
    usable_top, usable_bot = 160, 100
    usable_h = H - usable_top - usable_bot
    usable_w = W - 48
    scale = min(usable_w / region.width, usable_h / region.height)
    # Prefer filling width for readability
    scale = max(scale, usable_w / region.width)
    nw, nh = int(region.width * scale), int(region.height * scale)
    if nh > usable_h:
        scale = usable_h / region.height
        nw, nh = int(region.width * scale), int(region.height * scale)
    resized = region.resize((nw, nh), Image.Resampling.LANCZOS)
    # soft shadow card
    card = Image.new("RGB", (nw + 24, nh + 24), (10, 10, 10))
    card.paste(resized, (12, 12))
    cx = (W - card.width) // 2
    cy = usable_top + (usable_h - card.height) // 2
    canvas.paste(card, (cx, cy))
    return canvas


def product_frame(base: Image.Image, label: str, t: float, dur: float) -> Image.Image:
    """Ken Burns on cropped product + label chrome."""
    p = t / max(dur, 0.001)
    scale = 1.0 + 0.05 * ease_out(p)
    nw, nh = int(W * scale), int(H * scale)
    zoomed = base.resize((nw, nh), Image.Resampling.LANCZOS)
    x = (nw - W) // 2
    y = (nh - H) // 2 + int(lerp(6, -10, p))
    frame = zoomed.crop((x, y, x + W, y + H))

    # slight brighten for dark UI shots
    from PIL import ImageEnhance
    frame = ImageEnhance.Brightness(frame).enhance(1.08)
    frame = ImageEnhance.Contrast(frame).enhance(1.06)

    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    for i in range(140):
        a = int(170 * (1 - i / 140))
        od.line([(0, i), (W, i)], fill=(0, 0, 0, a))
    for i in range(110):
        a = int(150 * (1 - i / 110))
        od.line([(0, H - 1 - i), (W, H - 1 - i)], fill=(0, 0, 0, a))
    frame = Image.alpha_composite(frame.convert("RGBA"), overlay).convert("RGB")

    draw = ImageDraw.Draw(frame)
    paste_logo(frame, y=36, size=64)
    la = ease_out(clamp(t / 0.4))
    lf = font(26, True)
    centered_text(draw, label, 118, lf, tuple(int(c * la) for c in GOLD))
    gold_rule(draw, 156, int(280 * la), la)
    footer(draw)
    return frame


# Crops tuned for Leona desk screenshots (sidebar ~left 18%)
CROPS = {
    "cot": (0.18, 0.08, 0.99, 0.72),       # KPI strip + focus chart
    "sea": (0.18, 0.18, 0.99, 0.88),       # supreme seasonality chart
    "timing": (0.42, 0.22, 0.995, 0.95),   # timing table only
    "news": (0.20, 0.16, 0.99, 0.88),      # news list area
}


# ---- brand scenes ----

def scene_intro(t, dur):
    img = blank()
    draw = ImageDraw.Draw(img)
    particles(draw, t, 26)
    p = ease_out(t / dur)
    size = int(lerp(50, 120, p))
    paste_logo(img, y=int(lerp(860, 560, p)), size=size, opacity=int(255 * clamp(p * 1.4)))
    # soft ring
    if p > 0.25:
        rr = int(lerp(30, 160, ease_out((t - 0.25) / (dur - 0.25))))
        fade = 1 - ease_out((t - 0.25) / (dur - 0.25))
        col = tuple(int(c * fade * 0.7) for c in GOLD)
        cx, cy = W // 2, 560 + 60
        draw.ellipse((cx - rr, cy - rr, cx + rr, cy + rr), outline=col, width=2)
    return img


def scene_brand(t, dur):
    img = blank()
    draw = ImageDraw.Draw(img)
    particles(draw, t + 1, 16)
    paste_logo(img, y=280, size=100)
    p = ease_out(clamp(t / 0.55))
    y = int(lerp(500, 430, p))
    centered_text(draw, "Leona.Lab", y, font(68, True), GOLD)
    gold_rule(draw, y + 90, int(lerp(0, 420, ease_out(clamp((t - 0.3) / 0.45)))))
    # subtitle fade (no typewriter scramble risk)
    sp = ease_out(clamp((t - 0.7) / 0.6))
    if sp:
        centered_text(draw, "Desk multi-asset per trader", y + 130, font(30), tuple(int(c * sp) for c in MUTED))
    footer(draw)
    return img


def scene_tagline(t, dur):
    img = blank()
    draw = ImageDraw.Draw(img)
    paste_logo(img, y=100, size=72)
    lines = ["Contesto chiaro.", "Poi decidi tu."]
    y = 720
    for i, line in enumerate(lines):
        a = ease_out(clamp((t - 0.15 - i * 0.22) / 0.5))
        if a <= 0:
            continue
        oy = int(lerp(36, 0, a))
        centered_text(draw, line, y + oy, font(66, True), tuple(int(c * a) for c in WHITE))
        y += 92
    gold_rule(draw, y + 12, int(360 * ease_out(clamp((t - 0.7) / 0.4))))
    bp = ease_out(clamp((t - 1.0) / 0.5))
    if bp:
        for line in wrap(draw, "Dal dato alla bias — in un solo flusso.", font(30), 820):
            centered_text(draw, line, y + 50, font(30), tuple(int(c * bp) for c in MUTED))
            y += 44
    footer(draw)
    return img


def scene_features(t, dur):
    img = blank()
    draw = ImageDraw.Draw(img)
    paste_logo(img, y=80, size=68)
    centered_text(draw, "UN SOLO DESK", 190, font(24, True), GOLD)
    centered_text(draw, "Cinque pezzi. Un workflow.", 240, font(44, True), WHITE)
    gold_rule(draw, 310, 360)

    items = [
        ("COT", "Chi spinge il mercato"),
        ("Stagionalità", "Quando il flusso aiuta"),
        ("Valuation", "Quanto sei stirato"),
        ("Macro + News", "Cosa muove il mondo"),
        ("Segnali", "LONG · SHORT · WAIT"),
    ]
    y = 360
    for i, (title, sub) in enumerate(items):
        a = ease_out(clamp((t - 0.15 - i * 0.16) / 0.4))
        if a <= 0:
            continue
        oy = int(lerp(24, 0, a))
        by = y + oy
        draw.rounded_rectangle((80, by, W - 80, by + 118), radius=18, fill=CARD, outline=LINE, width=2)
        draw.ellipse((108, by + 42, 138, by + 72), fill=GOLD)
        draw.text((158, by + 24), title, font=font(32, True), fill=WHITE)
        draw.text((158, by + 68), sub, font=font(24), fill=MUTED)
        y += 132
    footer(draw)
    return img


def scene_bias(t, dur):
    img = blank()
    draw = ImageDraw.Draw(img)
    paste_logo(img, y=90, size=68)
    centered_text(draw, "SIGNAL CENTER", 200, font(24, True), GOLD)
    centered_text(draw, "Tre uscite. Una decisione.", 250, font(44, True), WHITE)
    gold_rule(draw, 320, 380)

    pills = [
        ("LONG", GREEN, "Quando il contesto spinge"),
        ("SHORT", RED, "Quando il contesto pesa"),
        ("WAIT", WAIT_C, "Quando è meglio stare fuori"),
    ]
    y = 400
    for i, (lab, col, sub) in enumerate(pills):
        a = ease_out(clamp((t - 0.2 - i * 0.25) / 0.45))
        if a <= 0:
            continue
        # scale from 0.92 -> 1.0
        oy = int(lerp(30, 0, a))
        by = y + oy
        draw.rounded_rectangle((110, by, W - 110, by + 150), radius=22, fill=CARD, outline=col, width=3)
        draw.rectangle((110, by, 122, by + 150), fill=col)
        draw.text((150, by + 36), lab, font=font(46, True), fill=col)
        draw.text((150, by + 96), sub, font=font(26), fill=MUTED)
        y += 180
    footer(draw)
    return img


def scene_exclusive(t, dur):
    img = blank()
    draw = ImageDraw.Draw(img)
    particles(draw, t + 3, 14)
    paste_logo(img, y=110, size=72)
    # badge
    badge = "SOLO SU LEONA.LAB"
    bf = font(22, True)
    bw = tw(draw, badge, bf) + 36
    bx = (W - bw) // 2
    bp = ease_out(clamp(t / 0.4))
    draw.rounded_rectangle((bx, 230, bx + bw, 278), radius=22, outline=tuple(int(c * bp) for c in GOLD), width=2)
    centered_text(draw, badge, 240, bf, tuple(int(c * bp) for c in GOLD))

    p = ease_out(clamp((t - 0.25) / 0.55))
    y = int(lerp(760, 640, p))
    for line in wrap(draw, "Il giorno del mese che conta davvero", font(52, True), 860):
        centered_text(draw, line, y, font(52, True), WHITE)
        y += 70
    gold_rule(draw, y + 8, int(340 * ease_out(clamp((t - 0.8) / 0.4))))
    ap = ease_out(clamp((t - 1.1) / 0.5))
    if ap:
        y += 40
        for line in wrap(draw, "Bias del mese + giorno long + giorno short. Dati reali.", font(28), 800):
            centered_text(draw, line, y, font(28), tuple(int(c * ap) for c in MUTED))
            y += 42
    footer(draw)
    return img


def scene_news_card(t, dur):
    img = blank()
    draw = ImageDraw.Draw(img)
    paste_logo(img, y=100, size=72)
    # live pulse
    pulse = 0.5 + 0.5 * math.sin(t * 5)
    draw.ellipse((W // 2 - 12, 220, W // 2 + 12, 244), fill=(255, 70, 70))
    rr = int(18 + 10 * pulse)
    draw.ellipse((W // 2 - rr, 220 - int(8 * pulse), W // 2 + rr, 244 + int(8 * pulse)), outline=(255, 80, 80), width=2)
    centered_text(draw, "LIVE", 260, font(26, True), (255, 100, 100))
    centered_text(draw, "BREAKING NEWS", 320, font(24, True), GOLD)
    centered_text(draw, "Il mondo, sul desk", 380, font(52, True), WHITE)
    gold_rule(draw, 460, 320)

    sources = [
        ("BBC World", "Feed mondiale"),
        ("Google News", "Headline aggregate"),
        ("Al Jazeera", "Contesto geopolitico"),
    ]
    y = 530
    for i, (title, sub) in enumerate(sources):
        a = ease_out(clamp((t - 0.35 - i * 0.2) / 0.4))
        if a <= 0:
            continue
        oy = int(lerp(28, 0, a))
        by = y + oy
        draw.rounded_rectangle((100, by, W - 100, by + 120), radius=18, fill=CARD, outline=LINE, width=2)
        draw.ellipse((128, by + 44, 158, by + 74), fill=GOLD)
        draw.text((184, by + 28), title, font=font(32, True), fill=WHITE)
        draw.text((184, by + 72), sub, font=font(24), fill=MUTED)
        y += 145
    footer(draw)
    return img


def scene_cta(t, dur):
    img = blank()
    draw = ImageDraw.Draw(img)
    particles(draw, t + 5, 22)
    paste_logo(img, y=200, size=100)
    p = ease_out(clamp(t / 0.5))
    y = int(lerp(820, 700, p))
    for line in wrap(draw, "Apri il desk. Prova il flusso.", font(52, True), 860):
        centered_text(draw, line, y, font(52, True), WHITE)
        y += 70
    gold_rule(draw, y + 10, 380)
    y += 50
    for line in wrap(draw, "COT · stagione · valuation · news · segnali", font(26), 820):
        centered_text(draw, line, y, font(26), MUTED)
        y += 40

    pulse = 0.5 + 0.5 * math.sin(t * 4.5)
    pad = int(5 * pulse)
    by = y + 60
    # glow
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(glow).rounded_rectangle(
        (160 - pad - 10, by - pad - 10, W - 160 + pad + 10, by + 120 + pad + 10),
        radius=28, fill=(212, 175, 55, 50),
    )
    img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle((160 - pad, by - pad, W - 160 + pad, by + 120 + pad), radius=24, fill=GOLD)
    cta = "leona-lab.com"
    cf = font(42, True)
    draw.text(((W - tw(draw, cta, cf)) // 2, by + 36), cta, font=cf, fill=BG)
    footer(draw)
    return img


# ---- transitions: soft crossfade only (no scramble) ----

def crossfade(a: Image.Image, b: Image.Image, p: float) -> Image.Image:
    p = ease_in_out(p)
    return Image.blend(a.convert("RGB"), b.convert("RGB"), p)


def dip_black(a: Image.Image, b: Image.Image, p: float) -> Image.Image:
    """Fade out to black then in — avoids UI text ghosting between dense shots."""
    p = ease_in_out(p)
    black = blank()
    if p < 0.5:
        return Image.blend(a.convert("RGB"), black, p * 2)
    return Image.blend(black, b.convert("RGB"), (p - 0.5) * 2)


def fade_frames(a_img, b_img, dur=0.4, mode="cross"):
    n = max(8, int(dur * FPS))
    fn = dip_black if mode == "dip" else crossfade
    return [fn(a_img, b_img, i / (n - 1)) for i in range(n)]


def render_clip(name: str, frames: list[Image.Image]) -> Path:
    d = OUT / "_frames" / name
    if d.exists():
        shutil.rmtree(d)
    d.mkdir(parents=True, exist_ok=True)
    for i, fr in enumerate(frames):
        fr.save(d / f"f{i:05d}.png")
    out = OUT / f"_clip_{name}.mp4"
    subprocess.check_call(
        ["ffmpeg", "-y", "-framerate", str(FPS), "-i", str(d / "f%05d.png"),
         "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-an", str(out)],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    shutil.rmtree(d)
    print(f"  {name}: {len(frames)/FPS:.2f}s")
    return out


def seq(fn, dur):
    n = int(dur * FPS)
    return [fn(i / FPS, dur) for i in range(n)]


def concat(clips, dest):
    lst = OUT / "_concat.txt"
    lst.write_text("".join(f"file '{c.resolve()}'\n" for c in clips), encoding="utf8")
    subprocess.check_call(
        ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(lst),
         "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18",
         "-movflags", "+faststart", "-an", str(dest)],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    ARTIFACT.mkdir(parents=True, exist_ok=True)
    print("Building pitch reel v2 (clean)...")

    # Prebuild product bases
    cot_base = crop_dash(ASSETS / "dash-cot.png", CROPS["cot"])
    sea_base = crop_dash(ASSETS / "dash-seasonality.png", CROPS["sea"])
    timing_base = crop_dash(ASSETS / "dash-timing.png", CROPS["timing"])
    news_base = crop_dash(ASSETS / "dash-news.png", CROPS["news"])

    # End frames for fades
    e_intro = scene_intro(1.7, 1.8)
    e_brand = scene_brand(2.3, 2.4)
    e_tag = scene_tagline(2.5, 2.6)
    e_feat = scene_features(3.6, 3.8)
    e_cot = product_frame(cot_base, "COT INTELLIGENCE", 4.2, 4.3)
    e_sea = product_frame(sea_base, "STAGIONALITÀ", 4.0, 4.1)
    e_timing = product_frame(timing_base, "TIMING GIORNI DEL MESE", 4.4, 4.5)
    e_excl = scene_exclusive(3.0, 3.1)
    e_bias = scene_bias(3.4, 3.5)
    e_news = product_frame(news_base, "BREAKING NEWS", 4.2, 4.3)
    e_newsc = scene_news_card(3.0, 3.1)
    e_cta = scene_cta(3.4, 3.5)

    clips = []
    # Timing designed for ~38-40s IG reel
    clips.append(render_clip("01", seq(scene_intro, 1.8)))
    clips.append(render_clip("01f", fade_frames(e_intro, e_brand, 0.35)))
    clips.append(render_clip("02", seq(scene_brand, 2.4)))
    clips.append(render_clip("02f", fade_frames(e_brand, e_tag, 0.35)))
    clips.append(render_clip("03", seq(scene_tagline, 2.6)))
    clips.append(render_clip("03f", fade_frames(e_tag, e_feat, 0.35)))
    clips.append(render_clip("04", seq(scene_features, 3.8)))
    clips.append(render_clip("04f", fade_frames(e_feat, e_cot, 0.45, "dip")))
    clips.append(render_clip("05", seq(lambda t, d: product_frame(cot_base, "COT INTELLIGENCE", t, d), 4.3)))
    clips.append(render_clip("05f", fade_frames(e_cot, e_sea, 0.5, "dip")))
    clips.append(render_clip("06", seq(lambda t, d: product_frame(sea_base, "STAGIONALITÀ", t, d), 4.1)))
    clips.append(render_clip("06f", fade_frames(e_sea, e_timing, 0.5, "dip")))
    clips.append(render_clip("07", seq(lambda t, d: product_frame(timing_base, "TIMING GIORNI DEL MESE", t, d), 4.5)))
    clips.append(render_clip("07f", fade_frames(e_timing, e_excl, 0.4, "dip")))
    clips.append(render_clip("08", seq(scene_exclusive, 3.1)))
    clips.append(render_clip("08f", fade_frames(e_excl, e_bias, 0.35)))
    clips.append(render_clip("09", seq(scene_bias, 3.5)))
    clips.append(render_clip("09f", fade_frames(e_bias, e_news, 0.5, "dip")))
    clips.append(render_clip("10", seq(lambda t, d: product_frame(news_base, "BREAKING NEWS", t, d), 4.3)))
    clips.append(render_clip("10f", fade_frames(e_news, e_newsc, 0.4, "dip")))
    clips.append(render_clip("11", seq(scene_news_card, 3.1)))
    clips.append(render_clip("11f", fade_frames(e_newsc, e_cta, 0.4)))
    clips.append(render_clip("12", seq(scene_cta, 3.5)))

    reel = OUT / "leona-lab-app-pitch-reel.mp4"
    concat(clips, reel)

    mobile = OUT / "app-pitch-reel-SAVE.mp4"
    subprocess.check_call(
        ["ffmpeg", "-y", "-i", str(reel), "-vf", "scale=720:1280",
         "-c:v", "libx264", "-pix_fmt", "yuv420p", "-profile:v", "baseline",
         "-crf", "25", "-movflags", "+faststart", "-an", str(mobile)],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    for f in (reel, mobile):
        shutil.copy2(f, ARTIFACT / f.name)

    for ss, name in [(2.5, "poster"), (14, "cot"), (24, "timing"), (33, "news")]:
        subprocess.check_call(
            ["ffmpeg", "-y", "-ss", str(ss), "-i", str(reel), "-update", "1", "-frames:v", "1",
             str(ARTIFACT / f"app-pitch-{name}.png")],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )

    for p in OUT.glob("_clip_*.mp4"):
        p.unlink(missing_ok=True)
    (OUT / "_concat.txt").unlink(missing_ok=True)
    if (OUT / "_frames").exists():
        shutil.rmtree(OUT / "_frames")

    dur = subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", str(reel)],
        text=True,
    ).strip()
    print("DONE", reel, f"{reel.stat().st_size/1024/1024:.1f}MB", f"{dur}s")
    print("MOBILE", mobile, f"{mobile.stat().st_size/1024/1024:.1f}MB")


if __name__ == "__main__":
    main()
