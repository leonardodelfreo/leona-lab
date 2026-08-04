"""Fetch real CFTC Gold COT and render a Supreme COT-style weekly net chart."""
from __future__ import annotations

import json
import urllib.parse
import urllib.request
from pathlib import Path

import matplotlib.dates as mdates
import matplotlib.pyplot as plt
from datetime import datetime

OUT = Path(__file__).resolve().parent / "supreme-cot-gold-weekly.png"
DATA = Path(__file__).resolve().parent / "cot-gold-weekly.json"

MARKET = "GOLD - COMMODITY EXCHANGE INC."
SELECT = ",".join(
    [
        "report_date_as_yyyy_mm_dd",
        "comm_positions_long_all",
        "comm_positions_short_all",
        "noncomm_positions_long_all",
        "noncomm_positions_short_all",
        "nonrept_positions_long_all",
        "nonrept_positions_short_all",
    ]
)


def fetch_rows(limit: int = 120) -> list[dict]:
    where = f"market_and_exchange_names='{MARKET}'"
    qs = urllib.parse.urlencode(
        {
            "$select": SELECT,
            "$where": where,
            "$order": "report_date_as_yyyy_mm_dd DESC",
            "$limit": str(limit),
        }
    )
    url = f"https://publicreporting.cftc.gov/resource/6dca-aqww.json?{qs}"
    req = urllib.request.Request(url, headers={"Accept": "application/json", "User-Agent": "leona-lab-cot-plot/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        payload = json.loads(resp.read().decode("utf-8"))
    if not isinstance(payload, list) or not payload:
        raise RuntimeError("empty CFTC payload")
    rows = []
    for r in reversed(payload):
        date = datetime.strptime(str(r["report_date_as_yyyy_mm_dd"])[:10], "%Y-%m-%d")
        c_long = float(r["comm_positions_long_all"])
        c_short = float(r["comm_positions_short_all"])
        nc_long = float(r["noncomm_positions_long_all"])
        nc_short = float(r["noncomm_positions_short_all"])
        rt_long = float(r["nonrept_positions_long_all"])
        rt_short = float(r["nonrept_positions_short_all"])
        rows.append(
            {
                "date": date,
                "commercialNet": c_long - c_short,
                "nonCommercialNet": nc_long - nc_short,
                "retailNet": rt_long - rt_short,
            }
        )
    return rows


def main() -> None:
    rows = fetch_rows(120)
    DATA.write_text(
        json.dumps(
            [
                {
                    "date": r["date"].strftime("%Y-%m-%d"),
                    "commercialNet": r["commercialNet"],
                    "nonCommercialNet": r["nonCommercialNet"],
                    "retailNet": r["retailNet"],
                }
                for r in rows
            ],
            indent=2,
        ),
        encoding="utf-8",
    )

    dates = [r["date"] for r in rows]
    commercials = [r["commercialNet"] for r in rows]
    non_commercials = [r["nonCommercialNet"] for r in rows]
    retail = [r["retailNet"] for r in rows]

    plt.style.use("dark_background")
    fig, ax = plt.subplots(figsize=(14.5, 7.2), dpi=160)
    fig.patch.set_facecolor("#0e1116")
    ax.set_facecolor("#0e1116")

    ax.axhline(0, color="#8b949e", linestyle=":", linewidth=1.1, zorder=1)
    ax.plot(dates, commercials, color="#2962ff", linewidth=2.0, label="Commercials", solid_capstyle="round")
    ax.plot(dates, non_commercials, color="#f23645", linewidth=2.0, label="Non-Commercials", solid_capstyle="round")
    ax.plot(dates, retail, color="#089981", linewidth=2.0, label="Retail Traders", solid_capstyle="round")

    # End labels like the Pine script
    last_x = dates[-1]
    for y, text, color in [
        (commercials[-1], "Commercials", "#2962ff"),
        (non_commercials[-1], "Non-Commercials", "#f23645"),
        (retail[-1], "Retail Traders", "#089981"),
    ]:
        ax.annotate(
            text,
            xy=(last_x, y),
            xytext=(12, 0),
            textcoords="offset points",
            color=color,
            fontsize=10,
            fontweight="bold",
            va="center",
            ha="left",
            bbox=dict(boxstyle="round,pad=0.25", fc="#131722", ec=color, alpha=0.92),
        )

    ax.set_title(
        "Supreme COT Report — GOLD (COMEX) · Weekly Legacy COT nets",
        color="#d1d4dc",
        fontsize=14,
        pad=12,
        loc="left",
    )
    ax.set_ylabel("Net positions (contracts)", color="#9aa4b2")
    ax.tick_params(colors="#9aa4b2")
    ax.grid(True, color="#1f2a37", linewidth=0.8)
    for spine in ax.spines.values():
        spine.set_color("#2a3544")

    ax.xaxis.set_major_locator(mdates.MonthLocator(interval=2))
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%b %Y"))
    fig.autofmt_xdate()

    # Leave room for right labels
    ax.margins(x=0.02)
    fig.subplots_adjust(left=0.08, right=0.86, top=0.90, bottom=0.14)

    latest = rows[-1]["date"].strftime("%Y-%m-%d")
    ax.text(
        0.01,
        -0.16,
        f"Source: CFTC Socrata 6dca-aqww · {MARKET} · latest report {latest} · weekly points",
        transform=ax.transAxes,
        color="#6b7280",
        fontsize=8,
        ha="left",
    )

    fig.savefig(OUT, facecolor=fig.get_facecolor(), bbox_inches="tight")
    print(f"wrote {OUT}")
    print(
        f"latest nets commercial={commercials[-1]:.0f} nonComm={non_commercials[-1]:.0f} retail={retail[-1]:.0f}"
    )


if __name__ == "__main__":
    main()
