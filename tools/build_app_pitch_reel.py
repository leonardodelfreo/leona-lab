"""Leona.Lab app pitch Reel — heavy motion, 9:16, black/gold brand."""
from __future__ import annotations

import math
import random
import shutil
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter

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
CARD = (16, 16, 16)
LINE = (42, 42, 42)
GREEN = (34, 212, 107)
RED = (255, 92, 92)
WAIT = (230, 190, 80)

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

RNG = random.Random(42)


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


def logo_rgba(size=96, opacity=255):
    logo = Image.open(LOGO).convert("RGBA").resize((size, size), Image.Resampling.LANCZOS)
    if opacity < 255:
        a = logo.split()[3].point(lambda p: int(p * opacity / 255))
        logo.putalpha(a)
    return logo


def paste_logo(canvas, y=72, size=96, opacity=255):
    logo = logo_rgba(size, opacity)
    canvas.paste(logo, ((W - size) // 2, y), logo)


def footer(draw, y=H - 64):
    f = font(22, True)
    txt = "Leona.Lab  ·  leona-lab.com"
    draw.text(((W - tw(draw, txt, f)) // 2, y), txt, font=f, fill=GOLD)


def gold_line(draw, y, width=420, alpha=1.0):
    w = int(width)
    col = tuple(int(c * alpha) for c in GOLD)
    draw.rectangle(((W - w) // 2, y, (W + w) // 2, y + 3), fill=col)


def draw_particles(draw, t, n=28):
    for i in range(n):
        # deterministic pseudo particles
        seed = (i * 97 + 13) % 1000
        x = (seed * 37 + int(t * (20 + i % 7) * 10)) % W
        y = int((H + 200) - ((t * (40 + i % 11) * 30 + seed * 3) % (H + 400)))
        r = 1 + (i % 3)
        a = 0.25 + 0.55 * abs(math.sin(t + i))
        col = tuple(int(c * a) for c in GOLD)
        draw.ellipse((x - r, y - r, x + r, y + r), fill=col)


def fit_dash(path: Path) -> Image.Image:
    src = Image.open(path).convert("RGB")
    canvas = blank()
    scale = W / src.width
    nw, nh = int(src.width * scale), int(src.height * scale)
    if nh > H - 240:
        scale = (H - 240) / src.height
        nw, nh = int(src.width * scale), int(src.height * scale)
    resized = src.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas.paste(resized, ((W - nw) // 2, (H - nh) // 2))
    return canvas


def fit_ig(path: Path) -> Image.Image:
    src = Image.open(path).convert("RGB")
    canvas = blank()
    side = W
    resized = src.resize((side, side), Image.Resampling.LANCZOS)
    canvas.paste(resized, (0, (H - side) // 2))
    return canvas


def frame_overlay_chrome(img: Image.Image, label: str = "") -> Image.Image:
    out = img.copy()
    draw = ImageDraw.Draw(out)
    paste_logo(out, y=28, size=56)
    if label:
        f = font(24, True)
        draw.text(((W - tw(draw, label, f)) // 2, 100), label, font=f, fill=GOLD)
    footer(draw)
    return out


# ---------- scenes ----------

def scene_cold_open(t, dur):
    """Gold particles + logo slam."""
    img = blank()
    draw = ImageDraw.Draw(img)
    draw_particles(draw, t, 36)
    p = ease_out(t / dur)
    size = int(lerp(40, 130, p))
    opacity = int(lerp(0, 255, clamp(p * 1.5)))
    paste_logo(img, y=int(lerp(900, 520, p)), size=size, opacity=opacity)
    # expanding ring
    if p > 0.2:
        rr = int(lerp(20, 220, ease_out((t - 0.2) / (dur - 0.2))))
        a = int(180 * (1 - ease_out((t - 0.2) / (dur - 0.2))))
        # approximate ring with arc-ish ellipses
        for k in range(3):
            col = tuple(max(0, c - 40 * k) for c in GOLD)
            rad = rr + k * 8
            bbox = [W // 2 - rad, 520 + 65 - rad, W // 2 + rad, 520 + 65 + rad]
            draw.ellipse(bbox, outline=col, width=2)
    return img


def scene_brand(t, dur):
    img = blank()
    draw = ImageDraw.Draw(img)
    draw_particles(draw, t + 1.0, 22)
    paste_logo(img, y=240, size=110)
    p = ease_out(clamp(t / 0.7))
    brand = font(72, True)
    txt = "Leona.Lab"
    y = int(lerp(520, 420, p))
    draw.text(((W - tw(draw, txt, brand)) // 2, y), txt, font=brand, fill=GOLD)
    gold_line(draw, y + 96, width=int(lerp(0, 460, ease_out(clamp((t - 0.35) / 0.5)))))
    # typewriter subtitle
    sub = "Il desk multi-asset per trader"
    shown = int(len(sub) * ease_out(clamp((t - 0.6) / 0.9)))
    sf = font(32)
    chunk = sub[:shown]
    draw.text(((W - tw(draw, chunk, sf)) // 2, y + 130), chunk, font=sf, fill=MUTED)
    # blinking caret
    if shown < len(sub) and int(t * 6) % 2 == 0:
        cx = (W - tw(draw, chunk, sf)) // 2 + tw(draw, chunk, sf) + 4
        draw.rectangle((cx, y + 134, cx + 3, y + 134 + 30), fill=GOLD)
    footer(draw)
    return img


def scene_promise(t, dur):
    img = blank()
    draw = ImageDraw.Draw(img)
    paste_logo(img, y=90, size=72)
    draw_particles(draw, t + 2, 16)
    lines = ["Contesto chiaro.", "Poi decidi tu."]
    y = 680
    for i, line in enumerate(lines):
        a = ease_out(clamp((t - i * 0.25) / 0.55))
        if a <= 0:
            continue
        oy = int(lerp(50, 0, a))
        col = tuple(int(c * a) for c in WHITE)
        f = font(70, True)
        draw.text(((W - tw(draw, line, f)) // 2, y + oy), line, font=f, fill=col)
        y += 96
    gold_line(draw, y + 8, width=int(420 * ease_out(clamp((t - 0.7) / 0.4))))
    body = "Un solo flusso: dal dato alla bias."
    bp = ease_out(clamp((t - 1.0) / 0.5))
    if bp > 0:
        bf = font(32)
        draw.text(((W - tw(draw, body, bf)) // 2, y + 50), body, font=bf, fill=tuple(int(c * bp) for c in MUTED))
    footer(draw)
    return img


def scene_orbit_features(t, dur):
    """Central logo with features flying in on orbit cards."""
    img = blank()
    draw = ImageDraw.Draw(img)
    paste_logo(img, y=210, size=100)
    draw.text(((W - tw(draw, "DENTRO IL DESK", font(26, True))) // 2, 340), "DENTRO IL DESK", font=font(26, True), fill=GOLD)

    items = [
        ("COT", "Positioning"),
        ("Stagione", "Timing"),
        ("Valuation", "Stretch"),
        ("News", "Tempo reale"),
        ("Segnali", "Bias"),
    ]
    cx, cy = W // 2, 980
    radius = 340
    for i, (title, sub) in enumerate(items):
        appear = ease_out(clamp((t - i * 0.18) / 0.45))
        if appear <= 0:
            continue
        ang = -math.pi / 2 + i * (2 * math.pi / len(items)) + t * 0.35
        r = radius * (0.7 + 0.3 * appear)
        x = int(cx + math.cos(ang) * r)
        y = int(cy + math.sin(ang) * r * 0.72)
        # card
        cw, ch = 220, 110
        box = [x - cw // 2, y - ch // 2, x + cw // 2, y + ch // 2]
        draw.rounded_rectangle(box, radius=18, fill=CARD, outline=GOLD, width=2)
        draw.text((x - tw(draw, title, font(30, True)) // 2, y - 30), title, font=font(30, True), fill=WHITE)
        draw.text((x - tw(draw, sub, font(22)) // 2, y + 12), sub, font=font(22), fill=MUTED)
        # spoke
        draw.line((cx, cy - 40, x, y), fill=tuple(int(c * 0.35 * appear) for c in GOLD), width=2)

    # center pulse
    pulse = 0.5 + 0.5 * math.sin(t * 5)
    pr = int(36 + 10 * pulse)
    draw.ellipse((cx - pr, cy - pr - 40, cx + pr, cy + pr - 40), outline=GOLD, width=3)
    draw.text((cx - tw(draw, "LL", font(28, True)) // 2, cy - 52), "LL", font=font(28, True), fill=GOLD)
    footer(draw)
    return img


def scene_bias_rain(t, dur):
    img = blank()
    draw = ImageDraw.Draw(img)
    paste_logo(img, y=80, size=70)
    draw.text(((W - tw(draw, "SIGNAL CENTER", font(26, True))) // 2, 190), "SIGNAL CENTER", font=font(26, True), fill=GOLD)
    title = "Tre uscite. Una decisione."
    draw.text(((W - tw(draw, title, font(48, True))) // 2, 250), title, font=font(48, True), fill=WHITE)
    gold_line(draw, 330, 400)

    pills = [("LONG", GREEN), ("SHORT", RED), ("WAIT", WAIT)]
    # falling / stacking pills
    for i, (lab, col) in enumerate(pills):
        a = ease_out(clamp((t - 0.2 - i * 0.28) / 0.5))
        if a <= 0:
            continue
        y = int(lerp(200, 480 + i * 190, a))
        x = 120
        draw.rounded_rectangle((x, y, W - x, y + 150), radius=24, fill=CARD, outline=col, width=3)
        # shimmer bar
        shimmer = int((t * 180 + i * 40) % (W - 2 * x - 40))
        draw.rectangle((x + 10 + shimmer, y + 4, x + 50 + shimmer, y + 8), fill=tuple(int(c * 0.5) for c in col))
        draw.text((x + 40, y + 40), lab, font=font(52, True), fill=col)
        sub = {"LONG": "Contesto a favore", "SHORT": "Contesto contrario", "WAIT": "Meglio restare fuori"}[lab]
        draw.text((x + 40, y + 100), sub, font=font(28), fill=MUTED)
    footer(draw)
    return img


def scene_product_hold(base: Image.Image, t, dur, label: str):
    # ken burns + animated gold frame
    p = t / max(dur, 0.001)
    scale = 1.0 + 0.05 * ease_out(p)
    nw, nh = int(W * scale), int(H * scale)
    zoomed = base.resize((nw, nh), Image.Resampling.LANCZOS)
    x = (nw - W) // 2
    y = (nh - H) // 2 + int(lerp(0, -20, p))
    frame = zoomed.crop((x, y, x + W, y + H))
    frame = frame_overlay_chrome(frame, label)
    draw = ImageDraw.Draw(frame)
    # animated corner brackets
    m = int(lerp(80, 40, ease_out(clamp(t / 0.5))))
    L = 48
    for bx, by in [(m, 160), (W - m, 160), (m, H - 120), (W - m, H - 120)]:
        s = 1 if bx < W // 2 else -1
        sy = 1 if by < H // 2 else -1
        draw.line([(bx, by), (bx + s * L, by)], fill=GOLD, width=3)
        draw.line([(bx, by), (bx, by + sy * L)], fill=GOLD, width=3)
    return frame


def scene_exclusive(t, dur):
    img = blank()
    draw = ImageDraw.Draw(img)
    draw_particles(draw, t + 4, 18)
    paste_logo(img, y=100, size=72)
    badge = "SOLO SU LEONA.LAB"
    bp = ease_out(clamp(t / 0.4))
    bf = font(24, True)
    bw = tw(draw, badge, bf) + 40
    bx = (W - bw) // 2
    by = 220
    draw.rounded_rectangle((bx, by, bx + bw, by + 48), radius=24, outline=GOLD, width=2)
    draw.text((bx + 20, by + 10), badge, font=bf, fill=tuple(int(c * bp) for c in GOLD))

    p = ease_out(clamp((t - 0.2) / 0.6))
    y = int(lerp(780, 640, p))
    for line in wrap(draw, "Il giorno del mese che conta davvero", font(56, True), 860):
        draw.text(((W - tw(draw, line, font(56, True))) // 2, y), line, font=font(56, True), fill=WHITE)
        y += 74
    gold_line(draw, y + 6, int(380 * ease_out(clamp((t - 0.7) / 0.4))))
    y += 40
    ap = ease_out(clamp((t - 1.0) / 0.5))
    if ap:
        for line in wrap(draw, "Bias del mese + giorno long + giorno short. Dati reali.", font(30), 800):
            draw.text(((W - tw(draw, line, font(30))) // 2, y), line, font=font(30), fill=tuple(int(c * ap) for c in MUTED))
            y += 44
    footer(draw)
    return img


def scene_news_pulse(t, dur):
    img = blank()
    draw = ImageDraw.Draw(img)
    paste_logo(img, y=90, size=72)
    # LIVE badge pulse
    pulse = 0.5 + 0.5 * math.sin(t * 6)
    draw.ellipse((W // 2 - 14, 208, W // 2 + 14, 236), fill=(255, 70, 70))
    ring = int(14 + 12 * pulse)
    draw.ellipse((W // 2 - ring, 208 - int(12 * pulse), W // 2 + ring, 236 + int(12 * pulse)), outline=(255, 70, 70), width=2)
    draw.text(((W - tw(draw, "LIVE", font(28, True))) // 2, 250), "LIVE", font=font(28, True), fill=(255, 90, 90))
    draw.text(((W - tw(draw, "BREAKING NEWS", font(26, True))) // 2, 310), "BREAKING NEWS", font=font(26, True), fill=GOLD)
    title = "Il mondo, sul desk"
    draw.text(((W - tw(draw, title, font(58, True))) // 2, 370), title, font=font(58, True), fill=WHITE)
    gold_line(draw, 460, 360)

    sources = ["BBC World", "Google News", "Al Jazeera"]
    y = 540
    for i, src in enumerate(sources):
        a = ease_out(clamp((t - 0.3 - i * 0.2) / 0.4))
        if a <= 0:
            continue
        oy = int(lerp(40, 0, a))
        draw.rounded_rectangle((100, y + oy, W - 100, y + oy + 120), radius=20, fill=CARD, outline=LINE, width=3)
        draw.ellipse((130, y + oy + 44, 162, y + oy + 76), fill=GOLD)
        draw.text((190, y + oy + 38), src, font=font(34, True), fill=WHITE)
        y += 150
    footer(draw)
    return img


def scene_cta(t, dur):
    img = blank()
    draw = ImageDraw.Draw(img)
    draw_particles(draw, t + 6, 30)
    paste_logo(img, y=180, size=110)
    p = ease_out(clamp(t / 0.55))
    y = int(lerp(860, 720, p))
    for line in wrap(draw, "Apri il desk. Prova il flusso.", font(56, True), 860):
        draw.text(((W - tw(draw, line, font(56, True))) // 2, y), line, font=font(56, True), fill=WHITE)
        y += 74
    gold_line(draw, y + 8, 400)
    y += 50
    for line in wrap(draw, "COT · stagione · valuation · news · segnali", font(28), 820):
        draw.text(((W - tw(draw, line, font(28))) // 2, y), line, font=font(28), fill=MUTED)
        y += 42

    pulse = 0.5 + 0.5 * math.sin(t * 5)
    pad = int(6 * pulse)
    by = y + 70
    # glow
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.rounded_rectangle((150 - pad - 8, by - pad - 8, W - 150 + pad + 8, by + 130 + pad + 8), radius=28, fill=(212, 175, 55, 40))
    img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle((150 - pad, by - pad, W - 150 + pad, by + 130 + pad), radius=26, fill=GOLD)
    cta = "leona-lab.com"
    cf = font(44, True)
    draw.text(((W - tw(draw, cta, cf)) // 2, by + 40), cta, font=cf, fill=BG)
    footer(draw, y=H - 80)
    return img


# ---------- transitions ----------

def wipe_flip(a: Image.Image, b: Image.Image, p: float) -> Image.Image:
    p = ease_in_out(p)
    out = b.convert("RGBA")
    remain = int(W * (1 - p))
    if remain > 2:
        left = a.crop((0, 0, remain, H)).convert("RGBA")
        out.paste(left, (0, 0))
        curl_w = max(12, min(120, int(70 + 60 * math.sin(p * math.pi))))
        curl_w = min(curl_w, remain)
        strip = a.crop((remain - curl_w, 0, remain, H))
        strip = ImageEnhance.Brightness(strip).enhance(0.5)
        sw = max(8, int(curl_w * (0.3 + 0.5 * (1 - p))))
        strip = strip.resize((sw, H), Image.Resampling.BILINEAR).convert("RGBA")
        out.paste(strip, (remain - sw, 0))
        # shadow
        sw2 = min(60, W - remain)
        if sw2 > 0:
            ov = Image.new("RGBA", (sw2, H), (0, 0, 0, 0))
            od = ImageDraw.Draw(ov)
            for i in range(sw2):
                od.line([(i, 0), (i, H)], fill=(0, 0, 0, int(120 * (1 - i / sw2))))
            out.paste(ov, (remain, 0), ov)
        d = ImageDraw.Draw(out)
        d.line([(remain, 0), (remain, H)], fill=GOLD, width=4)
    return out.convert("RGB")


def zoom_cross(a: Image.Image, b: Image.Image, p: float) -> Image.Image:
    p = ease_in_out(p)
    # a zooms out & fades, b zooms in
    as_ = 1.0 + 0.12 * p
    bs = 1.08 - 0.08 * p
    def z(im, s):
        nw, nh = int(W * s), int(H * s)
        zim = im.resize((nw, nh), Image.Resampling.LANCZOS)
        x, y = (nw - W) // 2, (nh - H) // 2
        return zim.crop((x, y, x + W, y + H))
    A = z(a, as_).convert("RGBA")
    B = z(b, bs).convert("RGBA")
    A.putalpha(int(255 * (1 - p)))
    B.putalpha(int(255 * p))
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 255))
    canvas = Image.alpha_composite(canvas, B)
    canvas = Image.alpha_composite(canvas, A)
    return canvas.convert("RGB")


def render_frames(name: str, frames: list[Image.Image]) -> Path:
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


def seq(render_fn, dur: float):
    n = int(dur * FPS)
    return [render_fn(i / FPS, dur) for i in range(n)]


def trans(a_img, b_img, dur, kind="flip"):
    n = max(10, int(dur * FPS))
    fn = wipe_flip if kind == "flip" else zoom_cross
    return [fn(a_img, b_img, i / (n - 1)) for i in range(n)]


def concat(clips: list[Path], dest: Path):
    lst = OUT / "_concat.txt"
    lst.write_text("".join(f"file '{c.resolve()}'\n" for c in clips), encoding="utf8")
    subprocess.check_call(
        ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(lst),
         "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "19",
         "-movflags", "+faststart", "-an", str(dest)],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    ARTIFACT.mkdir(parents=True, exist_ok=True)
    print("Building animated pitch reel...")

    cot = frame_overlay_chrome(fit_dash(ASSETS / "dash-cot.png"), "COT INTELLIGENCE")
    sea = frame_overlay_chrome(fit_dash(ASSETS / "dash-seasonality.png"), "STAGIONALITÀ")
    timing = frame_overlay_chrome(fit_dash(ASSETS / "dash-timing.png"), "TIMING GIORNI")
    news = frame_overlay_chrome(fit_dash(ASSETS / "dash-news.png"), "BREAKING NEWS")

    # end-state stills for transitions
    s_brand = scene_brand(2.4, 2.5)
    s_promise = scene_promise(2.4, 2.5)
    s_orbit = scene_orbit_features(3.5, 3.6)
    s_bias = scene_bias_rain(3.2, 3.3)
    s_excl = scene_exclusive(3.0, 3.1)
    s_newsp = scene_news_pulse(2.8, 2.9)
    s_cta = scene_cta(3.2, 3.3)

    clips = []
    clips.append(render_frames("01_cold", seq(scene_cold_open, 2.0)))
    clips.append(render_frames("01x", trans(scene_cold_open(1.9, 2.0), s_brand, 0.45, "zoom")))
    clips.append(render_frames("02_brand", seq(scene_brand, 2.5)))
    clips.append(render_frames("02x", trans(s_brand, s_promise, 0.5, "flip")))
    clips.append(render_frames("03_promise", seq(scene_promise, 2.5)))
    clips.append(render_frames("03x", trans(s_promise, cot, 0.55, "flip")))
    clips.append(render_frames("04_cot", seq(lambda t, d: scene_product_hold(cot, t, d, "COT INTELLIGENCE"), 2.8)))
    clips.append(render_frames("04x", trans(cot, s_orbit, 0.5, "zoom")))
    clips.append(render_frames("05_orbit", seq(scene_orbit_features, 3.6)))
    clips.append(render_frames("05x", trans(s_orbit, sea, 0.5, "flip")))
    clips.append(render_frames("06_sea", seq(lambda t, d: scene_product_hold(sea, t, d, "STAGIONALITÀ"), 2.5)))
    clips.append(render_frames("06x", trans(sea, timing, 0.5, "flip")))
    clips.append(render_frames("07_timing", seq(lambda t, d: scene_product_hold(timing, t, d, "TIMING GIORNI"), 2.8)))
    clips.append(render_frames("07x", trans(timing, s_excl, 0.5, "zoom")))
    clips.append(render_frames("08_excl", seq(scene_exclusive, 3.0)))
    clips.append(render_frames("08x", trans(s_excl, s_bias, 0.5, "flip")))
    clips.append(render_frames("09_bias", seq(scene_bias_rain, 3.2)))
    clips.append(render_frames("09x", trans(s_bias, news, 0.5, "flip")))
    clips.append(render_frames("10_news", seq(lambda t, d: scene_product_hold(news, t, d, "BREAKING NEWS"), 2.8)))
    clips.append(render_frames("10x", trans(news, s_newsp, 0.45, "zoom")))
    clips.append(render_frames("11_newsp", seq(scene_news_pulse, 2.6)))
    clips.append(render_frames("11x", trans(s_newsp, s_cta, 0.55, "flip")))
    clips.append(render_frames("12_cta", seq(scene_cta, 3.3)))

    reel = OUT / "leona-lab-app-pitch-reel.mp4"
    concat(clips, reel)

    # mobile-friendly
    mobile = OUT / "app-pitch-reel-SAVE.mp4"
    subprocess.check_call(
        ["ffmpeg", "-y", "-i", str(reel), "-vf", "scale=720:1280",
         "-c:v", "libx264", "-pix_fmt", "yuv420p", "-profile:v", "baseline",
         "-crf", "26", "-movflags", "+faststart", "-an", str(mobile)],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )

    for f in (reel, mobile):
        shutil.copy2(f, ARTIFACT / f.name)

    subprocess.check_call(
        ["ffmpeg", "-y", "-ss", "3", "-i", str(reel), "-update", "1", "-frames:v", "1",
         str(ARTIFACT / "app-pitch-reel-poster.png")],
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
