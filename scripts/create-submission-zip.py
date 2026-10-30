#!/usr/bin/env python3
"""Create airbnb_clone_app.zip for take-home submission (no node_modules / dist / caches)."""

from __future__ import annotations

import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "airbnb_clone_app.zip"

EXCLUDE_DIR_NAMES = frozenset(
    {
        "node_modules",
        "dist",
        ".git",
        ".vite",
        ".vite-temp",
        ".tmp",
    }
)
EXCLUDE_FILE_NAMES = frozenset({"airbnb_clone_app.zip"})


def is_excluded(relative_parts: tuple[str, ...]) -> bool:
    return any(part in EXCLUDE_DIR_NAMES for part in relative_parts)


def main() -> None:
    if OUTPUT.exists():
        OUTPUT.unlink()

    file_count = 0
    with zipfile.ZipFile(OUTPUT, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
        for path in ROOT.rglob("*"):
            if not path.is_file():
                continue
            rel = path.relative_to(ROOT)
            if rel.name in EXCLUDE_FILE_NAMES:
                continue
            if is_excluded(rel.parts):
                continue
            archive.write(path, rel.as_posix())
            file_count += 1

    size_kb = OUTPUT.stat().st_size / 1024
    print(f"Created {OUTPUT.name} — {file_count} files, {size_kb:.1f} KB")


if __name__ == "__main__":
    main()
