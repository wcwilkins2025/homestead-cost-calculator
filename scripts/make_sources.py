"""Write sources.md from the data files so the list never drifts from what the page uses.
Run: python scripts/make_sources.py"""
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load(fn):
    with open(os.path.join(ROOT, "data", fn), encoding="utf-8") as f:
        return json.load(f)


costs, land, tax, counties = load("costs.json"), load("land_values.json"), load("property_tax.json"), load("counties.json")
L = []
L.append("# Sources\n")
L.append("Every default on the page comes from one of the tables below. `data/costs.json` holds each cost item with low, typical and high and a `source` id; this file is generated from it by `scripts/make_sources.py`. Dollar figures are as published and are not adjusted for inflation unless the note says so.\n")
L.append("Items marked **estimate** have no published figure behind them. The basis says how the number was reached. If you know a published source for one, open an issue.\n")

L.append("## Land, tax and county tables\n")
L.append("| Used for | Source | Date | Link |\n|---|---|---|---|")
for s in land["source_list"]:
    L.append("| State land values and pasture rent (price per acre default when the county has none) | " + s["name"] + " | " + s["date"] + " | " + s["url"] + " |")
for s in tax["source_list"]:
    L.append("| State property tax rate default | " + s["name"] + " | " + s["date"] + " | " + s["url"] + " |")
for s in counties["source_list"]:
    L.append("| County table (land value per acre, median recorded well depth, tax rate) | " + s["name"] + " | " + s["date"] + " | " + s["url"] + " |")
L.append("")
L.append("The county table was built from the Brotherhood Land Finder's public county file (same three sources) by `scripts/build_counties.py`. USGS well depths are medians of wells on record in the county, which skew toward irrigation and test wells; the page shows them as a hint only.\n")

L.append("## Cost items\n")
L.append("| Item | Low | Typical | High | Unit | Source |\n|---|---:|---:|---:|---|---|")
for k, it in costs["items"].items():
    s = costs["sources"][it["source"]]
    tag = " **estimate**" if s.get("estimate") else ""
    fmt = (lambda v: ("%.3g" % v) if v < 10 else format(v, ",.2f").rstrip("0").rstrip("."))
    L.append("| " + it["label"] + " (`" + k + "`) | " + fmt(it["low"]) + " | " + fmt(it["typ"]) + " | " + fmt(it["high"]) + " | " + it["unit"] + " | " + it["source"] + tag + " |")
L.append("")

L.append("## Source list\n")
pub = [(k, s) for k, s in costs["sources"].items() if not s.get("estimate")]
est = [(k, s) for k, s in costs["sources"].items() if s.get("estimate")]
L.append("### Published\n")
for k, s in pub:
    L.append("- **" + k + "**: " + s["name"] + (", " + s["date"] if s["date"] else "") + ". " + s["url"] + (" " + s["basis"] if s["basis"] else ""))
L.append("")
L.append("### Estimates\n")
for k, s in est:
    L.append("- **" + k + "**: " + s["name"] + ". " + s["basis"] + (" Published figure referenced: " + s["url"] if s["url"] != "sources.md" else ""))
L.append("")

L.append("## Well depth defaults\n")
L.append(costs["well_depth_default"]["note"] + " Where a state has ten or more counties with USGS well records, the page uses the median of those county medians as the default depth instead, and says so in the hint under the field.\n")

L.append("## Looked for and not found\n")
L.append("- A published average price for used manufactured homes (Census, HUD and MHI publish new-home prices only; FHFA medians include land).")
L.append("- A farm or ranch insurance premium average (USDA ERS, Triple-I, Farm Bureau and extension do not publish one).")
L.append("- Published state-level typical house well depths (USGS publishes national medians and aquifer grids).")
L.append("- A published price for a meter pole, service drop and transformer (co-ops bill at cost or cover it in the allowance).")
L.append("- Used tractor, stock trailer and used 3/4-ton truck price reports by class (auction summaries publish trends, not averages).")
L.append("- A using-horse purchase price average, a started-pullet price, and a retail fruit tree price in an extension budget.")
L.append("- A family-of-four unsubsidized marketplace premium (KFF publishes the 40-year-old benchmark; the employer family premium stands in).")
L.append("")

with open(os.path.join(ROOT, "sources.md"), "w", encoding="utf-8") as f:
    f.write("\n".join(L))
print("sources.md", len(L), "lines")
