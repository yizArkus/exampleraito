"""
Procesa ic_thumb_arrow: elimina negro/blanco de fondo, exporta PNG 32-bit (RGBA)
y densidades tipo mipmap para web (`public/icons/thumb-arrow/`).

Ejecutar desde la raíz del proyecto:
    pip install -r tools/requirements.txt
    python tools/process_thumb_arrow_icon.py

Coloca el PNG original en:
    tools/source/ic_thumb_arrow_source.png
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "tools/source/ic_thumb_arrow_source.png"
OUT_DIR = ROOT / "public/icons/thumb-arrow"

DENSITIES: dict[str, int] = {
    "mdpi": 48,
    "hdpi": 72,
    "xhdpi": 96,
    "xxhdpi": 144,
    "xxxhdpi": 192,
}

TARGET_GREEN = (50, 205, 50)

try:
    _LANCZOS = Image.Resampling.LANCZOS
except AttributeError:
    _LANCZOS = Image.LANCZOS  # type: ignore[attr-defined]


def is_background(r: int, g: int, b: int) -> bool:
    mx, mn = max(r, g, b), min(r, g, b)
    if mn > 238:
        return True
    if mx < 42:
        return True
    return False


def is_foreground_green(r: int, g: int, b: int) -> bool:
    return g >= 52 and g > r + 6 and g > b + 5


def process_rgba(im: Image.Image) -> Image.Image:
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    out = Image.new("RGBA", (w, h))
    op = out.load()

    for y in range(h):
        for x in range(w):
            r, g, b, a_in = px[x, y]
            if a_in < 250:
                pass

            if is_background(r, g, b):
                op[x, y] = (0, 0, 0, 0)
                continue

            if is_foreground_green(r, g, b):
                fr = min(255, int((r + TARGET_GREEN[0]) / 2))
                fg = min(255, int((g + TARGET_GREEN[1]) / 2))
                fb = min(255, int((b + TARGET_GREEN[2]) / 2))
                op[x, y] = (fr, fg, fb, 255)
                continue

            mx = max(r, g, b)
            if mx < 55:
                alpha = max(0, min(255, int(255 * (mx - 18) / 42)))
                if alpha == 0:
                    op[x, y] = (0, 0, 0, 0)
                else:
                    op[x, y] = (r, g, b, alpha)
            elif g > r and g > b:
                op[x, y] = (r, g, b, 255)
            else:
                op[x, y] = (0, 0, 0, 0)

    return out


def trim_and_square(im: Image.Image) -> Image.Image:
    bbox = im.getbbox()
    if not bbox:
        return im
    cropped = im.crop(bbox)
    w, h = cropped.size
    side = max(w, h)
    square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    square.paste(cropped, ((side - w) // 2, (side - h) // 2))
    return square


def export_densities(im_square: Image.Image) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for name, size in DENSITIES.items():
        resized = im_square.resize((size, size), _LANCZOS)
        out_path = OUT_DIR / f"ic_thumb_arrow_{name}.png"
        resized.save(out_path, format="PNG", compress_level=9)
        print(f"OK {out_path} ({size}x{size})")


def main() -> None:
    if not SRC.exists():
        raise SystemExit(
            f"No se encuentra la fuente: {SRC}\n"
            "Copia el PNG original a tools/source/ic_thumb_arrow_source.png"
        )

    im = Image.open(SRC)
    processed = process_rgba(im)
    squared = trim_and_square(processed)

    master = OUT_DIR / "ic_thumb_arrow_master.png"
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    squared.save(master, format="PNG", compress_level=9)
    print(f"Master guardado: {master} ({squared.size[0]}x{squared.size[1]})")

    export_densities(squared)
    print("Listo.")


if __name__ == "__main__":
    main()
