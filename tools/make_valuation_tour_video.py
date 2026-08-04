from pathlib import Path
import imageio.v2 as imageio
from PIL import Image, ImageDraw, ImageFont
import numpy as np

out = Path.home() / "Desktop" / "LeonaLab-Valuation-Tour"
out.mkdir(parents=True, exist_ok=True)
src_dir = Path(r"C:\Users\leona\AppData\Local\Temp\cursor\screenshots")

frames_src = [
    ("final-01-controlli-kpi.png", "1) Tab Valuation + controlli Period/Rescale + Symbol 1/2/3"),
    ("final-03-overview-3y.png", "2) KPI vs DXY / Gold / Bonds + Lettura Neutral"),
    ("final-02-grafico.png", "3) Grafico Supreme Valuation (-100..+100) TF 3Y"),
    ("v03-grafico-supreme.png", "4) Linee vs DXY (blu), Gold (oro), Bonds (viola)"),
]

W, H = 1280, 720
labeled = []
for name, caption in frames_src:
    p = out / name
    if not p.exists():
        p = src_dir / name
    if not p.exists():
        raise SystemExit(f"missing frame: {name}")
    # keep a copy on Desktop
    dest = out / name
    if p.resolve() != dest.resolve():
        dest.write_bytes(p.read_bytes())
    im = Image.open(dest).convert("RGB")
    scale = max(W / im.width, H / im.height)
    nw, nh = int(im.width * scale), int(im.height * scale)
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    left = (nw - W) // 2
    top = (nh - H) // 2
    im = im.crop((left, top, left + W, top + H))
    draw = ImageDraw.Draw(im)
    draw.rectangle([0, H - 54, W, H], fill=(8, 8, 8))
    try:
        font = ImageFont.truetype("arial.ttf", 22)
    except Exception:
        font = ImageFont.load_default()
    draw.text((18, H - 40), caption, fill=(212, 175, 55), font=font)
    labeled.append(im)

fps = 12
hold = int(2.4 * fps)
mp4 = out / "LeonaLab-Valuation-Tour.mp4"
writer = imageio.get_writer(str(mp4), fps=fps, codec="libx264", quality=8, ffmpeg_log_level="error")
for im in labeled:
    arr = np.asarray(im)
    for _ in range(hold):
        writer.append_data(arr)
writer.close()
print("wrote", mp4, "MB", round(mp4.stat().st_size / 1024 / 1024, 2))

gif = out / "LeonaLab-Valuation-Tour.gif"
labeled[0].save(gif, save_all=True, append_images=labeled[1:], duration=2400, loop=0, optimize=True)
print("wrote", gif, "MB", round(gif.stat().st_size / 1024 / 1024, 2))
