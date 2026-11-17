"""Build data/counties.json for the calculator from the Land Finder's public county table.

Keeps only the fields the calculator needs: FIPS, name, state, USDA 2022 farm land value per acre,
USGS median well depth, and the Census effective property tax rate.
Source file: the Land Finder's data/counties.json (last built 2026-11-13).
Usage: python scripts/build_counties.py <path to the Land Finder's data/counties.json>
"""
import json, sys
if len(sys.argv) < 2:
    sys.exit("Usage: python scripts/build_counties.py <path to the Land Finder's data/counties.json>")
src = sys.argv[1]
d = json.load(open(src, encoding="utf-8"))
f = {k: i for i, k in enumerate(d["fields"])}
out = {}
for r in d["rows"]:
    st = r[f["st"]]
    name = r[f["name"]]
    out.setdefault(st, []).append([
        r[f["fips"]], name, r[f["farm_value_acre"]], r[f["well_depth_med_ft"]], r[f["tax_rate_pct"]]
    ])
for st in out:
    out[st].sort(key=lambda x: x[1])
res = {
    "built": d["built"],
    "fields": ["fips", "name", "farm_value_acre", "well_depth_med_ft", "tax_rate_pct"],
    "sources": {
        "farm_value_acre": {"name": "USDA NASS, 2022 Census of Agriculture: ag land including buildings, asset value, $ per acre (county)",
            "url": "https://www.nass.usda.gov/sites/default/files/datasets/qs.census2022.txt.gz", "year": 2022,
            "note": "Value of farm land and buildings as reported by operators, not a listing price. Withheld counties are null."},
        "well_depth_med_ft": {"name": "USGS National Water Information System, groundwater site inventory, median well depth in county",
            "url": "https://waterservices.usgs.gov/nwis/site/?format=rdb&stateCd=XX&siteType=GW&siteOutput=expanded", "year": 2026,
            "note": "Only where 5 or more wells have a depth. USGS wells skew toward monitoring and irrigation wells, so this can run deeper than a house well."},
        "tax_rate_pct": {"name": "Census Bureau, ACS 2019-2023 5-year, B25077 and B25103: median taxes paid / median home value",
            "url": "https://data.census.gov/", "year": 2023,
            "note": "Effective rate on owner-occupied homes. Ag land is usually taxed lower."}
    },
    "source_list": [
        {"id": "usda_census_2022_county", "name": "USDA NASS, 2022 Census of Agriculture: value of ag land and buildings per acre, by county", "date": "2022, file dated February 14, 2024", "url": "https://www.nass.usda.gov/sites/default/files/datasets/qs.census2022.txt.gz"},
        {"id": "usgs_nwis_wells", "name": "USGS National Water Information System, groundwater site inventory: median recorded well depth by county", "date": "inventory as of November 13, 2026", "url": "https://waterservices.usgs.gov/nwis/site/"},
        {"id": "census_acs_tax", "name": "Census Bureau, ACS 2019-2023 5-year, tables B25077 and B25103: median property tax paid as a share of median home value, by county", "date": "2019-2023", "url": "https://data.census.gov/"}
    ],
    "states": out
}
json.dump(res, open("data/counties.json", "w", encoding="utf-8"), separators=(",", ":"))
n = sum(len(v) for v in out.values())
print("counties:", n, "states:", len(out), "bytes:", len(json.dumps(res, separators=(",", ":"))))
