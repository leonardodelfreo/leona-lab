"""Leona.Lab presentation Reel — brand motion + real dashboard cuts (9:16)."""
from __future__ import annotations

import math
import shutil
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "instagram" / "reels"
ARTIFACT = Path("/opt/cursor/artifacts/reels")
LOGO = ROOT / "assets" / "logo-ll.png"
DASH = Path("/tmp/dashboard-landscape.mp4")
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


def scene_intro(t: float, dur: float) -> Image.Image:
    img = blank()
    draw = ImageDraw.Draw(img)
    p = ease_out(t / dur)
    # logo rises + fades
    logo_y = int(lerp(160, 220, p))
    paste_logo(img, y=logo_y, size=110, opacity=int(lerp(0, 255, min(1, p * 1.4))))
    brand = font(64, True)
    brand_txt = "Leona.Lab"
    alpha = int(lerp(0, 255, ease_out(max(0, (t - 0.4) / (dur - 0.4)))))
    # simulate fade by blending toward black via color approx
    col = tuple(int(c * alpha / 255) for c in GOLD)
    by = 360
    draw.text(((W - text_w(draw, brand_txt, brand)) // 2, by), brand_txt, font=brand, fill=col)
    # underline grows
    uw = int(lerp(0, 420, ease_out(max(0, (t - 0.7) / 0.8))))
    if uw > 0:
        draw.rectangle(((W - uw) // 2, by + 86, (W + uw) // 2, by + 89), fill=GOLD)
    kicker = font(28, True)
    kt = "DESK MULTI-ASSET"
    ka = int(lerp(0, 255, ease_out(max(0, (t - 1.1) / 0.7))))
    kc = tuple(int(c * ka / 255) for c in MUTED)
    draw.text(((W - text_w(draw, kt, kicker)) // 2, by + 120), kt, font=kicker, fill=kc)
    footer(draw)
    return img


def scene_tagline(t: float, dur: float) -> Image.Image:
    img = blank()
    draw = ImageDraw.Draw(img)
    paste_logo(img, y=90, size=78)
    p = ease_out(t / min(0.8, dur))
    y0 = int(lerp(820, 700, p))
    title = font(68, True)
    lines = ["Contesto chiaro.", "Poi decidi tu."]
    y = y0
    for line in lines:
        draw.text(((W - text_w(draw, line, title)) // 2, y), line, font=title, fill=WHITE)
        y += 90
    draw.rectangle((220, y + 10, W - 220, y + 13), fill=GOLD)
    body = font(32)
    sub = "COT, stagionalità, valuation e segnali — in un solo flusso."
    y2 = y + 50
    for line in wrap(draw, sub, body, 820):
        draw.text(((W - text_w(draw, line, body)) // 2, y2), line, font=body, fill=MUTED)
        y2 += 48
    footer(draw)
    return img


def scene_features(t: float, dur: float) -> Image.Image:
    img = blank()
    draw = ImageDraw.Draw(img)
    paste_logo(img, y=80, size=72)
    kf = font(26, True)
    tf = font(56, True)
    draw.text(((W - text_w(draw, "UN SOLO DESK", kf)) // 2, 200), "UN SOLO DESK", font=kf, fill=GOLD)
    draw.text(((W - text_w(draw, "Cinque pezzi. Un workflow.", tf)) // 2, 250), "Cinque pezzi. Un workflow.", font=tf, fill=WHITE)
    draw.rectangle((180, 330, W - 180, 333), fill=GOLD)

    items = [
        ("COT", "Chi spinge il mercato"),
        ("Stagionalità", "Quando il flusso aiuta"),
        ("Valuation", "Quanto sei stirato"),
        ("Macro + News", "Cosa muove il mondo"),
        ("Segnali", "LONG · SHORT · WAIT"),
    ]
    y = 390
    for i, (title, sub) in enumerate(items):
        appear = ease_out(max(0, (t - i * 0.22) / 0.45))
        if appear <= 0:
            continue
        oy = int(lerp(30, 0, appear))
        box_y = y + oy
        # fade via border/text intensity
        a = appear
        fill_card = tuple(int(c * (0.4 + 0.6 * a)) for c in CARD)
        draw.rounded_rectangle((90, box_y, W - 90, box_y + 118), radius=20, fill=fill_card, outline=LINE, width=3)
        draw.ellipse((118, box_y + 42, 150, box_y + 74), fill=GOLD)
        draw.text((178, box_y + 24), title, font=font(34, True), fill=WHITE)
        draw.text((178, box_y + 68), sub, font=font(26), fill=MUTED)
        y += 132
    footer(draw)
    return img


def scene_bias(t: float, dur: float) -> Image.Image:
    img = blank()
    draw = ImageDraw.Draw(img)
    paste_logo(img, y=80, size=72)
    draw.text(((W - text_w(draw, "SIGNAL CENTER", font(26, True))) // 2, 200), "SIGNAL CENTER", font=font(26, True), fill=GOLD)
    title = "Bias operativo, non rumore"
    draw.text(((W - text_w(draw, title, font(52, True))) // 2, 250), title, font=font(52, True), fill=WHITE)
    draw.rectangle((200, 330, W - 200, 333), fill=GOLD)

    cards = [
        ("LONG", GREEN, "Quando il contesto spinge"),
        ("SHORT", RED, "Quando il contesto pesa"),
        ("WAIT", WAIT, "Quando è meglio stare fuori"),
    ]
    y = 420
    for i, (lab, col, sub) in enumerate(cards):
        a = ease_out(max(0, (t - i * 0.25) / 0.4))
        if a <= 0:
            continue
        oy = int(lerp(40, 0, a))
        by = y + oy
        draw.rounded_rectangle((110, by, W - 110, by + 160), radius=22, fill=CARD, outline=LINE, width=3)
        draw.rectangle((110, by, 122, by + 160), fill=col)
        draw.text((150, by + 36), lab, font=font(48, True), fill=col)
        draw.text((150, by + 100), sub, font=font(28), fill=MUTED)
        y += 190
    footer(draw)
    return img


def scene_exclusive(t: float, dur: float) -> Image.Image:
    img = blank()
    draw = ImageDraw.Draw(img)
    paste_logo(img, y=80, size=72)
    draw.text(((W - text_w(draw, "SOLO SU LEONA.LAB", font(26, True))) // 2, 210), "SOLO SU LEONA.LAB", font=font(26, True), fill=GOLD)
    p = ease_out(min(1, t / 0.7))
    y = int(lerp(760, 640, p))
    for line in wrap(draw, "Il giorno del mese che conta davvero", font(58, True), 860):
        draw.text(((W - text_w(draw, line, font(58, True))) // 2, y), line, font=font(58, True), fill=WHITE)
        y += 78
    draw.rectangle((200, y + 8, W - 200, y + 11), fill=GOLD)
    y += 50
    body = font(32)
    for line in wrap(draw, "Bias del mese + giorno long + giorno short. Dati reali, nessun numero inventato.", body, 820):
        draw.text(((W - text_w(draw, line, body)) // 2, y), line, font=body, fill=MUTED)
        y += 48

    # highlight box
    a = ease_out(max(0, (t - 0.8) / 0.5))
    if a > 0:
        by = y + 40
        draw.rounded_rectangle((100, by, W - 100, by + 150), radius=22, fill=CARD, outline=LINE, width=3)
        bf = font(32, True)
        for i, line in enumerate(["Non è un segnale automatico.", "È un vantaggio di calendario."]):
            draw.text(((W - text_w(draw, line, bf)) // 2, by + 30 + i * 50), line, font=bf, fill=GOLD)
    footer(draw)
    return img


def scene_cta(t: float, dur: float) -> Image.Image:
    img = blank()
    draw = ImageDraw.Draw(img)
    paste_logo(img, y=160, size=100)
    draw.text(((W - text_w(draw, "LEONA.LAB", font(28, True))) // 2, 300), "LEONA.LAB", font=font(28, True), fill=GOLD)
    p = ease_out(min(1, t / 0.6))
    y = int(lerp(820, 700, p))
    for line in wrap(draw, "Il desk è pronto. Tocca a te.", font(58, True), 860):
        draw.text(((W - text_w(draw, line, font(58, True))) // 2, y), line, font=font(58, True), fill=WHITE)
        y += 76
    draw.rectangle((220, y + 8, W - 220, y + 11), fill=GOLD)
    y += 50
    for line in wrap(draw, "Meno tab. Più contesto. Una sola decisione.", font(32), 800):
        draw.text(((W - text_w(draw, line, font(32))) // 2, y), line, font=font(32), fill=MUTED)
        y += 48

    # pulsing CTA
    pulse = 0.5 + 0.5 * math.sin(t * 4)
    pad = int(4 * pulse)
    by = y + 70
    draw.rounded_rectangle((160 - pad, by - pad, W - 160 + pad, by + 120 + pad), radius=24, fill=GOLD)
    cta = "Apri leona-lab.com"
    cf = font(40, True)
    draw.text(((W - text_w(draw, cta, cf)) // 2, by + 36), cta, font=cf, fill=BG)
    footer(draw, y=H - 90)
    return img


def write_scene_video(name: str, render_fn, duration: float) -> Path:
    frames_dir = OUT / "_frames" / name
    if frames_dir.exists():
        shutil.rmtree(frames_dir)
    frames_dir.mkdir(parents=True, exist_ok=True)
    n = int(duration * FPS)
    for i in range(n):
        t = i / FPS
        frame = render_fn(t, duration)
        frame.save(frames_dir / f"f{i:05d}.png")
    out = OUT / f"_clip_{name}.mp4"
    subprocess.check_call(
        [
            "ffmpeg",
            "-y",
            "-framerate",
            str(FPS),
            "-i",
            str(frames_dir / "f%05d.png"),
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-crf",
            "18",
            "-an",
            str(out),
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    print(f"clip {name} {duration:.1f}s -> {out.name}")
    return out


def extract_dash_clip(name: str, start: float, dur: float) -> Path:
    """Fit full landscape dashboard centered in 9:16 (letterbox, no crop)."""
    out = OUT / f"_clip_{name}.mp4"
    # Scale to fit inside 1080x1920 keeping full UI visible, center with black bars
    vf = (
        "scale=1080:1920:force_original_aspect_ratio=decrease,"
        "pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black,"
        "drawtext=fontfile=/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf:"
        "text='Leona.Lab':fontcolor=0xD4AF37:fontsize=34:x=(w-text_w)/2:y=48,"
        "drawtext=fontfile=/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf:"
        "text='leona-lab.com':fontcolor=0xD4AF37:fontsize=22:x=(w-text_w)/2:y=h-64"
    )
    subprocess.check_call(
        [
            "ffmpeg",
            "-y",
            "-ss",
            str(start),
            "-t",
            str(dur),
            "-i",
            str(DASH),
            "-vf",
            vf,
            "-r",
            str(FPS),
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-crf",
            "18",
            "-an",
            str(out),
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    print(f"dash {name} {dur:.1f}s from {start:.1f}s (full screen centered)")
    return out


def concat(clips: list[Path], dest: Path):
    lst = OUT / "_concat.txt"
    lst.write_text("".join(f"file '{c.resolve()}'\n" for c in clips), encoding="utf8")
    subprocess.check_call(
        [
            "ffmpeg",
            "-y",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(lst),
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-crf",
            "18",
            "-movflags",
            "+faststart",
            "-an",
            str(dest),
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    ARTIFACT.mkdir(parents=True, exist_ok=True)

    clips = [
        write_scene_video("intro", scene_intro, 2.6),
        write_scene_video("tagline", scene_tagline, 3.0),
        extract_dash_clip("cot", 1.0, 4.0),
        write_scene_video("features", scene_features, 4.2),
        extract_dash_clip("seasonality", 14.0, 4.2),
        write_scene_video("bias", scene_bias, 3.6),
        write_scene_video("exclusive", scene_exclusive, 3.4),
        write_scene_video("cta", scene_cta, 3.4),
    ]

    reel = OUT / "leona-lab-presentation-reel.mp4"
    concat(clips, reel)
    shutil.copy2(reel, ARTIFACT / reel.name)

    poster = ARTIFACT / "leona-lab-presentation-reel-poster.png"
    subprocess.check_call(
        ["ffmpeg", "-y", "-ss", "1.2", "-i", str(reel), "-update", "1", "-frames:v", "1", str(poster)],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    # cleanup heavy frame dirs
    frames_root = OUT / "_frames"
    if frames_root.exists():
        shutil.rmtree(frames_root)
    for p in OUT.glob("_clip_*.mp4"):
        p.unlink(missing_ok=True)
    (OUT / "_concat.txt").unlink(missing_ok=True)

    probe = subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", str(reel)],
        text=True,
    ).strip()
    print("DONE", reel, f"{reel.stat().st_size/1024/1024:.1f}MB", f"{probe}s")


if __name__ == "__main__":
    main()
