"""Leona.Lab presentation Reel — page-flip transitions + Timing + Breaking News."""
from __future__ import annotations

import math
import shutil
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageEnhance

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "instagram" / "reels"
ARTIFACT = Path("/opt/cursor/artifacts/reels")
ASSETS = Path("/tmp/reel-assets")
LOGO = ROOT / "assets" / "logo-ll.png"
DASH_VID = Path("/tmp/dashboard-landscape.mp4")

W, H = 1080, 1920
FPS = 30
BG = (0, 0, 0)
GOLD = (212, 175, 55)
WHITE = (255, 255, 255)
MUTED = (168, 168, 168)
CARD = (14, 14, 14)
LINE = (48, 48, 48)
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


def font(size: int, bold: bool = False):
    for p in _FONT_BOLD if bold else _FONT_REG:
        try:
            return ImageFont.truetype(p, size)
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


def ease_in_out(t: float) -> float:
    t = max(0.0, min(1.0, t))
    return 0.5 - 0.5 * math.cos(math.pi * t)


def ease_out(t: float) -> float:
    t = max(0.0, min(1.0, t))
    return 1 - (1 - t) ** 3


def lerp(a, b, t):
    return a + (b - a) * t


def blank():
    return Image.new("RGB", (W, H), BG)


def paste_logo(canvas: Image.Image, y=72, size=96, opacity=255):
    logo = Image.open(LOGO).convert("RGBA").resize((size, size), Image.Resampling.LANCZOS)
    if opacity < 255:
        alpha = logo.split()[3].point(lambda p: int(p * opacity / 255))
        logo.putalpha(alpha)
    canvas.paste(logo, ((W - size) // 2, y), logo)


def footer(draw, y=H - 70):
    fnt = font(22, True)
    txt = "Leona.Lab  ·  leona-lab.com"
    draw.text(((W - text_w(draw, txt, fnt)) // 2, y), txt, font=fnt, fill=GOLD)


def fit_full_screen(src: Image.Image) -> Image.Image:
    """Place full landscape UI centered in 9:16 (letterbox, no crop)."""
    canvas = blank()
    img = src.convert("RGB")
    scale = min(W / img.width, H / img.height)
    # Prefer filling width for desk screenshots
    scale = W / img.width
    nw, nh = int(img.width * scale), int(img.height * scale)
    if nh > H - 220:
        scale = (H - 220) / img.height
        nw, nh = int(img.width * scale), int(img.height * scale)
    resized = img.resize((nw, nh), Image.Resampling.LANCZOS)
    x = (W - nw) // 2
    y = (H - nh) // 2
    canvas.paste(resized, (x, y))
    draw = ImageDraw.Draw(canvas)
    paste_logo(canvas, y=36, size=64)
    draw.text(((W - text_w(draw, "Leona.Lab", font(28, True))) // 2, 108), "Leona.Lab", font=font(28, True), fill=GOLD)
    footer(draw)
    return canvas


def load_dash(name: str) -> Image.Image:
    return fit_full_screen(Image.open(ASSETS / name))


def load_ig(name: str) -> Image.Image:
    """IG carousel slides are already square — center on black 9:16."""
    src = Image.open(ASSETS / name).convert("RGB")
    canvas = blank()
    # Fill width, keep square aspect
    side = W
    resized = src.resize((side, side), Image.Resampling.LANCZOS)
    canvas.paste(resized, (0, (H - side) // 2))
    return canvas


# ---------- brand scenes ----------

def scene_intro(t: float, dur: float) -> Image.Image:
    img = blank()
    draw = ImageDraw.Draw(img)
    p = ease_out(t / dur)
    paste_logo(img, y=int(lerp(160, 220, p)), size=110, opacity=int(lerp(0, 255, min(1, p * 1.4))))
    alpha = ease_out(max(0, (t - 0.35) / (dur - 0.35)))
    col = tuple(int(c * alpha) for c in GOLD)
    brand = font(64, True)
    draw.text(((W - text_w(draw, "Leona.Lab", brand)) // 2, 360), "Leona.Lab", font=brand, fill=col)
    uw = int(lerp(0, 420, ease_out(max(0, (t - 0.7) / 0.8))))
    if uw:
        draw.rectangle(((W - uw) // 2, 446, (W + uw) // 2, 449), fill=GOLD)
    ka = ease_out(max(0, (t - 1.1) / 0.6))
    kc = tuple(int(c * ka) for c in MUTED)
    draw.text(((W - text_w(draw, "DESK MULTI-ASSET", font(28, True))) // 2, 480), "DESK MULTI-ASSET", font=font(28, True), fill=kc)
    footer(draw)
    return img


def scene_tagline(t: float, dur: float) -> Image.Image:
    img = blank()
    draw = ImageDraw.Draw(img)
    paste_logo(img, y=90, size=78)
    p = ease_out(min(1, t / 0.7))
    y = int(lerp(820, 700, p))
    title = font(68, True)
    for line in ["Contesto chiaro.", "Poi decidi tu."]:
        draw.text(((W - text_w(draw, line, title)) // 2, y), line, font=title, fill=WHITE)
        y += 90
    draw.rectangle((220, y + 10, W - 220, y + 13), fill=GOLD)
    y += 50
    body = font(32)
    for line in wrap(draw, "COT, stagionalità, valuation, news e segnali — in un solo flusso.", body, 820):
        draw.text(((W - text_w(draw, line, body)) // 2, y), line, font=body, fill=MUTED)
        y += 48
    footer(draw)
    return img


def scene_features(t: float, dur: float) -> Image.Image:
    img = blank()
    draw = ImageDraw.Draw(img)
    paste_logo(img, y=80, size=72)
    draw.text(((W - text_w(draw, "UN SOLO DESK", font(26, True))) // 2, 190), "UN SOLO DESK", font=font(26, True), fill=GOLD)
    draw.text(((W - text_w(draw, "Cinque pezzi. Un workflow.", font(52, True))) // 2, 240), "Cinque pezzi. Un workflow.", font=font(52, True), fill=WHITE)
    draw.rectangle((180, 320, W - 180, 323), fill=GOLD)
    items = [
        ("COT", "Chi spinge il mercato"),
        ("Stagionalità", "Quando il flusso aiuta"),
        ("Valuation", "Quanto sei stirato"),
        ("Macro + News", "Cosa muove il mondo"),
        ("Segnali", "LONG · SHORT · WAIT"),
    ]
    y = 370
    for i, (title, sub) in enumerate(items):
        a = ease_out(max(0, (t - i * 0.18) / 0.4))
        if a <= 0:
            continue
        by = y + int(lerp(28, 0, a))
        draw.rounded_rectangle((90, by, W - 90, by + 112), radius=20, fill=CARD, outline=LINE, width=3)
        draw.ellipse((118, by + 40, 148, by + 70), fill=GOLD)
        draw.text((178, by + 22), title, font=font(34, True), fill=WHITE)
        draw.text((178, by + 64), sub, font=font(26), fill=MUTED)
        y += 124
    footer(draw)
    return img


def scene_bias(t: float, dur: float) -> Image.Image:
    img = blank()
    draw = ImageDraw.Draw(img)
    paste_logo(img, y=80, size=72)
    draw.text(((W - text_w(draw, "SIGNAL CENTER", font(26, True))) // 2, 200), "SIGNAL CENTER", font=font(26, True), fill=GOLD)
    draw.text(((W - text_w(draw, "Bias operativo, non rumore", font(50, True))) // 2, 250), "Bias operativo, non rumore", font=font(50, True), fill=WHITE)
    draw.rectangle((200, 330, W - 200, 333), fill=GOLD)
    cards = [("LONG", GREEN, "Quando il contesto spinge"), ("SHORT", RED, "Quando il contesto pesa"), ("WAIT", WAIT, "Quando è meglio stare fuori")]
    y = 420
    for i, (lab, col, sub) in enumerate(cards):
        a = ease_out(max(0, (t - i * 0.22) / 0.35))
        if a <= 0:
            continue
        by = y + int(lerp(36, 0, a))
        draw.rounded_rectangle((110, by, W - 110, by + 150), radius=22, fill=CARD, outline=LINE, width=3)
        draw.rectangle((110, by, 122, by + 150), fill=col)
        draw.text((150, by + 32), lab, font=font(46, True), fill=col)
        draw.text((150, by + 94), sub, font=font(28), fill=MUTED)
        y += 178
    footer(draw)
    return img


def scene_cta(t: float, dur: float) -> Image.Image:
    img = blank()
    draw = ImageDraw.Draw(img)
    paste_logo(img, y=160, size=100)
    draw.text(((W - text_w(draw, "LEONA.LAB", font(28, True))) // 2, 300), "LEONA.LAB", font=font(28, True), fill=GOLD)
    p = ease_out(min(1, t / 0.55))
    y = int(lerp(820, 700, p))
    for line in wrap(draw, "Il desk è pronto. Tocca a te.", font(58, True), 860):
        draw.text(((W - text_w(draw, line, font(58, True))) // 2, y), line, font=font(58, True), fill=WHITE)
        y += 76
    draw.rectangle((220, y + 8, W - 220, y + 11), fill=GOLD)
    y += 50
    for line in wrap(draw, "Meno tab. Più contesto. Una sola decisione.", font(32), 800):
        draw.text(((W - text_w(draw, line, font(32))) // 2, y), line, font=font(32), fill=MUTED)
        y += 48
    pulse = 0.5 + 0.5 * math.sin(t * 4)
    pad = int(4 * pulse)
    by = y + 70
    draw.rounded_rectangle((160 - pad, by - pad, W - 160 + pad, by + 120 + pad), radius=24, fill=GOLD)
    cta = "Apri leona-lab.com"
    cf = font(40, True)
    draw.text(((W - text_w(draw, cta, cf)) // 2, by + 36), cta, font=cf, fill=BG)
    footer(draw, y=H - 90)
    return img


def hold_image(base: Image.Image, t: float, dur: float) -> Image.Image:
    """Slight Ken Burns on a still (zoom in gently)."""
    p = t / max(dur, 0.001)
    scale = 1.0 + 0.04 * p
    nw, nh = int(W * scale), int(H * scale)
    zoomed = base.resize((nw, nh), Image.Resampling.LANCZOS)
    x = (nw - W) // 2
    y = (nh - H) // 2
    return zoomed.crop((x, y, x + W, y + H))


# ---------- page flip (sfogliamento) ----------

def page_flip_frame(outgoing: Image.Image, incoming: Image.Image, progress: float) -> Image.Image:
    """
    Magazine-style page turn from right → left.
    Incoming is fully underneath; outgoing peels away revealing the next page.
    """
    p = ease_in_out(progress)
    base = incoming.convert("RGBA")
    remain = int(W * (1.0 - p))
    if remain <= 2:
        return incoming.copy()

    # Visible left part of outgoing page
    left = outgoing.crop((0, 0, remain, H)).convert("RGBA")
    base.paste(left, (0, 0))

    # Turning curl strip — darkened + squashed (fake perspective)
    curl_w = max(18, min(140, int(90 + 80 * math.sin(p * math.pi))))
    curl_w = min(curl_w, remain)
    src_x0 = max(0, remain - curl_w)
    strip = outgoing.crop((src_x0, 0, remain, H))
    strip = ImageEnhance.Brightness(strip).enhance(0.55 - 0.15 * p)
    squashed_w = max(8, int(curl_w * (0.35 + 0.45 * (1 - p))))
    strip = strip.resize((squashed_w, H), Image.Resampling.BILINEAR).convert("RGBA")
    base.paste(strip, (remain - squashed_w, 0))

    # Soft shadow on the revealed incoming page
    shadow_w = min(70, W - remain)
    if shadow_w > 0 and remain < W:
        overlay = Image.new("RGBA", (shadow_w, H), (0, 0, 0, 0))
        od = ImageDraw.Draw(overlay)
        for i in range(shadow_w):
            a = int(110 * (1 - i / shadow_w))
            od.line([(i, 0), (i, H)], fill=(0, 0, 0, a))
        base.paste(overlay, (remain, 0), overlay)

    out = base.convert("RGB")
    draw = ImageDraw.Draw(out)
    draw.line([(remain, 0), (remain, H)], fill=GOLD, width=4)
    if remain > 6:
        draw.line([(remain - 3, 0), (remain - 3, H)], fill=(255, 230, 160), width=1)
    return out


def render_clip(name: str, frames: list[Image.Image]) -> Path:
    frames_dir = OUT / "_frames" / name
    if frames_dir.exists():
        shutil.rmtree(frames_dir)
    frames_dir.mkdir(parents=True, exist_ok=True)
    for i, fr in enumerate(frames):
        fr.save(frames_dir / f"f{i:05d}.png")
    out = OUT / f"_clip_{name}.mp4"
    subprocess.check_call(
        [
            "ffmpeg", "-y", "-framerate", str(FPS),
            "-i", str(frames_dir / "f%05d.png"),
            "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-an", str(out),
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    shutil.rmtree(frames_dir)
    print(f"clip {name}: {len(frames)/FPS:.2f}s ({len(frames)} frames)")
    return out


def make_scene_frames(render_fn, duration: float) -> list[Image.Image]:
    n = int(duration * FPS)
    return [render_fn(i / FPS, duration) for i in range(n)]


def make_hold_frames(base: Image.Image, duration: float) -> list[Image.Image]:
    n = int(duration * FPS)
    return [hold_image(base, i / FPS, duration) for i in range(n)]


def make_flip_frames(outgoing: Image.Image, incoming: Image.Image, duration: float = 0.55) -> list[Image.Image]:
    n = max(8, int(duration * FPS))
    return [page_flip_frame(outgoing, incoming, i / (n - 1)) for i in range(n)]


def extract_dash_clip(name: str, start: float, dur: float) -> Path:
    out = OUT / f"_clip_{name}.mp4"
    vf = (
        "scale=1080:1920:force_original_aspect_ratio=decrease,"
        "pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black,"
        "drawtext=fontfile=/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf:"
        "text='Leona.Lab':fontcolor=0xD4AF37:fontsize=28:x=(w-text_w)/2:y=48,"
        "drawtext=fontfile=/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf:"
        "text='leona-lab.com':fontcolor=0xD4AF37:fontsize=22:x=(w-text_w)/2:y=h-64"
    )
    subprocess.check_call(
        [
            "ffmpeg", "-y", "-ss", str(start), "-t", str(dur), "-i", str(DASH_VID),
            "-vf", vf, "-r", str(FPS), "-c:v", "libx264", "-pix_fmt", "yuv420p",
            "-crf", "18", "-an", str(out),
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    print(f"dash video {name}")
    return out


def last_frame_of_clip(clip: Path) -> Image.Image:
    tmp = OUT / f"_last_{clip.stem}.png"
    subprocess.check_call(
        ["ffmpeg", "-y", "-sseof", "-0.1", "-i", str(clip), "-update", "1", "-frames:v", "1", str(tmp)],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    img = Image.open(tmp).convert("RGB")
    if img.size != (W, H):
        # should already be 9:16 from extract
        canvas = blank()
        img = img.resize((W, int(img.height * W / img.width)), Image.Resampling.LANCZOS)
        canvas.paste(img, (0, (H - img.height) // 2))
        img = canvas
    tmp.unlink(missing_ok=True)
    return img


def concat(clips: list[Path], dest: Path):
    lst = OUT / "_concat.txt"
    lst.write_text("".join(f"file '{c.resolve()}'\n" for c in clips), encoding="utf8")
    subprocess.check_call(
        [
            "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(lst),
            "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18",
            "-movflags", "+faststart", "-an", str(dest),
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    ARTIFACT.mkdir(parents=True, exist_ok=True)

    # Pre-render key stills
    intro_last = scene_intro(2.5, 2.6)
    tagline = scene_tagline(2.5, 3.0)
    cot = load_dash("dash-cot.png")
    features = scene_features(4.0, 4.2)
    seasonality = load_dash("dash-seasonality.png")
    timing = load_dash("dash-timing.png")
    timing_card = load_ig("ig-giorni-04-lettura.png")
    bias = scene_bias(3.4, 3.6)
    news = load_dash("dash-news.png")
    news_card = load_ig("ig-news-02-cosa-e.png")
    cta = scene_cta(3.2, 3.4)

    clips: list[Path] = []

    # 1 Intro
    clips.append(render_clip("01_intro", make_scene_frames(scene_intro, 2.5)))
    clips.append(render_clip("01f", make_flip_frames(intro_last, tagline, 0.55)))

    # 2 Tagline
    clips.append(render_clip("02_tagline", make_scene_frames(scene_tagline, 2.6)))
    clips.append(render_clip("02f", make_flip_frames(tagline, cot, 0.6)))

    # 3 COT full screen
    clips.append(render_clip("03_cot", make_hold_frames(cot, 3.2)))
    clips.append(render_clip("03f", make_flip_frames(cot, features, 0.55)))

    # 4 Features
    clips.append(render_clip("04_features", make_scene_frames(scene_features, 3.8)))
    clips.append(render_clip("04f", make_flip_frames(features, seasonality, 0.55)))

    # 5 Seasonality desk
    clips.append(render_clip("05_sea", make_hold_frames(seasonality, 2.8)))
    clips.append(render_clip("05f", make_flip_frames(seasonality, timing, 0.55)))

    # 6 Timing giorni (dashboard)
    clips.append(render_clip("06_timing", make_hold_frames(timing, 3.2)))
    clips.append(render_clip("06f", make_flip_frames(timing, timing_card, 0.55)))

    # 7 Timing explain card
    clips.append(render_clip("07_timing_card", make_hold_frames(timing_card, 2.6)))
    clips.append(render_clip("07f", make_flip_frames(timing_card, bias, 0.55)))

    # 8 Bias
    clips.append(render_clip("08_bias", make_scene_frames(scene_bias, 3.2)))
    clips.append(render_clip("08f", make_flip_frames(bias, news, 0.55)))

    # 9 Breaking News desk
    clips.append(render_clip("09_news", make_hold_frames(news, 3.2)))
    clips.append(render_clip("09f", make_flip_frames(news, news_card, 0.55)))

    # 10 News card
    clips.append(render_clip("10_news_card", make_hold_frames(news_card, 2.5)))
    clips.append(render_clip("10f", make_flip_frames(news_card, cta, 0.6)))

    # 11 CTA
    clips.append(render_clip("11_cta", make_scene_frames(scene_cta, 3.2)))

    reel = OUT / "leona-lab-presentation-reel.mp4"
    concat(clips, reel)
    shutil.copy2(reel, ARTIFACT / reel.name)

    for ss, name in [(1.2, "poster"), (12.0, "timing"), (20.0, "news")]:
        subprocess.check_call(
            [
                "ffmpeg", "-y", "-ss", str(ss), "-i", str(reel),
                "-update", "1", "-frames:v", "1",
                str(ARTIFACT / f"leona-lab-presentation-reel-{name}.png"),
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )

    # cleanup
    for p in OUT.glob("_clip_*.mp4"):
        p.unlink(missing_ok=True)
    (OUT / "_concat.txt").unlink(missing_ok=True)
    frames_root = OUT / "_frames"
    if frames_root.exists():
        shutil.rmtree(frames_root)

    dur = subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", str(reel)],
        text=True,
    ).strip()
    print("DONE", reel, f"{reel.stat().st_size/1024/1024:.1f}MB", f"{dur}s")


if __name__ == "__main__":
    main()
