"""Write data/costs.json: every cost item with low / typ / high and a source.

This is the one place the planning figures live. Each source entry carries the publisher,
date, link and a plain-words basis for how the number was read. Sources flagged
estimate=True had no published figure; basis says how the estimate was reached.
Run: python scripts/make_costs.py  then  python scripts/bundle_data.py
"""
import json, os, statistics

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = {}


def src(id, name, date, url, basis="", estimate=False):
    S[id] = {"name": name, "date": date, "url": url, "basis": basis}
    if estimate:
        S[id]["estimate"] = True


# ---- published sources ----
src("ngwa_2021", "National Ground Water Association, Well Owners Guide", "2021", "https://wellowner.org/wp-content/uploads/2021/04/2021-WellOwners-Guide.pdf",
    "Drilling ran about $24 a foot for a 4-inch well and $30 for a 6-inch well, casing extra. A household submersible pump ran $3,000 to $3,200. The high figure here adds casing and five years of price rises.")
src("umn_well_2022", "University of Minnesota Extension, Digging or expanding a well", "reviewed 2022", "https://extension.umn.edu/vegetable-growing-guides-farmers/digging-or-expanding-well",
    "A new well for a 5 to 20 acre farm: $5,000 to $30,000.")
src("usgs_well_depth_2021", "USGS Scientific Investigations Report 2021-5069, depth of groundwater used for drinking water", "2021", "https://www.usgs.gov/publications/depth-groundwater-used-drinking-water-supplies-united-states",
    "Median depth of US domestic wells is 142 ft; public supply wells 202 ft.")
src("epa_septic_2018", "US EPA Water Finance Clearinghouse, Financing Septic Systems", "September 2018", "https://clearinghouse.epa.gov/ords/wfc/r/wfc/files/static/v744/Financing_Septic_Systems_508.pdf",
    "Conventional system installed, with permits: $3,000 to $15,000. Alternative and advanced systems: $10,000 to $30,000. State examples ran $4,000 to $18,000.")
src("mu_septic_2017", "University of Missouri Extension EQM104F, Household Wastewater", "September 2017", "https://extension.missouri.edu/publications/eqm104f",
    "Pumping a tank: $100 to $250, every 3 to 5 years. High figure allows for an aerobic service contract.")
src("coop_line_ext", "Rural electric co-op line extension policies: Webster Electric (MO) 2025, Upper Cumberland EMC (TN) 2025, Cullman Electric (AL) 2023, Missouri PSC comparison 2015", "2015-2025",
    "https://www.websterec.com/webster-electric-cooperative-line-extension-policy/",
    "Webster: first 200 ft free, then $5 a foot overhead. Cullman: first 400 ft free, then $13 overhead, $20 underground. UCEMC: $17 a foot overhead. Missouri PSC survey: $15 overhead, $23 underground. Texas and Oklahoma co-ops publish a free allowance ($1,950 to $7,500) and charge the rest at cost.")
src("eia_bill_2024", "US EIA, Table 5.A, 2024 average monthly residential electric bill by state", "October 2025", "https://www.eia.gov/electricity/sales_revenue_price/",
    "US $142 a month. Missouri $129, Arkansas $129, Oklahoma $132, Kentucky $134, Tennessee $143, Texas $164, Alabama $174.")
src("nrel_solar_2025", "US DOE SETO and NREL, Solar Photovoltaic System Cost Benchmarks, Q1 2025", "2025", "https://www.energy.gov/eere/solar/solar-photovoltaic-system-cost-benchmarks",
    "An 8 kW home system with a 13.5 kWh battery: $4.33 to $4.59 a watt installed, about $35,000 to $37,000. Off-grid needs more battery.")
src("energysage_offgrid_2026", "EnergySage, Off-Grid Solar: Costs, Process, and Best Products, and Solar Battery Cost", "June and July 2026", "https://www.energysage.com/solar/what-does-it-mean-to-go-off-the-grid/",
    "A full off-grid system for an average house often runs $115,000 or more. A 13.5 kWh battery runs about $15,600 installed. Low here is the NREL 8 kW system with one battery ($35,000); typical adds two more batteries, sized for a modest house that uses less than average.")
src("isu_fence_2024", "Iowa State University Extension, Ag Decision Maker B1-75, Estimated Costs for Livestock Fencing", "December 2024", "https://www.extension.iastate.edu/agdm/livestock/pdf/b1-75.pdf",
    "Per foot built, labor at $20 an hour, no gates: woven wire $2.34, 5-strand barbed $1.99, high-tensile electric $1.21.")
src("mu_fence_2026", "University of Missouri Extension G1193, Pasture Fence Construction Budget", "April 2026", "https://extension.missouri.edu/publications/g1193",
    "Per foot built, with a gate: woven wire $3.94, 5-strand barbed $3.03, electric high-tensile $2.51. Low here is the Iowa State 2024 figure for the same fence; typical is the middle of the two.")
src("pole_barn_prices", "Morton Buildings (2022) and FBi Buildings (2021) published shell pricing; Hansen Pole Buildings kit prices (2026)", "2021-2026", "https://mortonbuildings.com/blog/what-does-a-morton-garage-hobby-building-or-workshop-cost",
    "Erected shell $25 to $55 a square foot depending on size; kit materials only $9 to $13; concrete and finish add $50 or more. Typical here is a 30 x 40 erected shell with a slab.")
src("nahb_2024", "NAHB, Cost of Constructing a Home 2024", "January 2025", "https://nahb.org/-/media/AB4EFC742624475A97A0A62189986FF8.ashx",
    "Average construction cost $428,215 for 2,647 sq ft, about $162 a square foot, not counting the lot. Low and high here spread 20% either side.")
src("fbi_barndo_2024", "FBi Buildings, How Much Does a 1,500 Square Foot Barndominium Cost", "June 2024", "https://info.fbibuildings.com/blog/1500-barndominium-cost",
    "Shell $45 to $75 a square foot; finished $125 basic, $150 to $400 with upgrades.")
src("census_mhs_2025", "US Census Bureau, Manufactured Housing Survey, average sales price of new manufactured homes, 2025", "June 2026", "https://www.census.gov/programs-surveys/mhs/data/annual-data.html",
    "Single-section $85,600, double-section $157,100, all homes $127,200. Factory price, before delivery and setup.")
src("closingcorp_2021", "CoreLogic ClosingCorp, Purchase Mortgage Closing Cost Report 2021", "April 2022", "https://newslink.mba.org/?p=164773",
    "Closing costs averaged 1.01% of price without transfer taxes and 1.81% with. Cash land deals skip lender fees; land loans add origination.")
src("survey_cost", "University of Missouri Extension G5055 (2017, reviewed 2026) and LandThink, Tips on Rural Land Surveys (2019)", "2017-2026", "https://extension.missouri.edu/publications/g5055",
    "$2,500 for a boundary survey on a 100-acre example; $3,000 to $6,000 for an 80-acre tract.")
src("naic_home_2023", "NAIC, Homeowners Insurance Report, data for 2023, Table 4", "2026", "https://content.naic.org/sites/default/files/publication-hmr-zu-homeowners-report.pdf",
    "Average owner-occupied home premium: US $1,731, Texas $2,762, Oklahoma $2,398, Arkansas $1,868, Missouri $1,675, Tennessee $1,644, Kentucky $1,484. A farm or ranch policy adds barns, fence, equipment and liability; no published average for that, so the typical and high here are an estimate above the home figure.", estimate=True)
src("tamu_cowcalf_2025", "Texas A&M AgriLife Extension, 2025 cow-calf budgets, North Texas District 4, improved and native pasture", "March 2025", "https://agecoext.tamu.edu/wp-content/uploads/2025/03/2025D4CowCalfImprove.pdf",
    "Cash costs per cow with your own labor taken out: about $330 on improved pasture, $510 on native pasture (hay $159 to $318, marketing $40, mineral $19, vet $25, supplement, fuel, repairs, interest). High is the USDA ERS 2024 US operating cost of $690.")
src("ers_cowcalf_2025", "USDA ERS, Commodity Costs and Returns, cow-calf, US total, dollars per cow", "October 2026", "https://www.ers.usda.gov/data-products/commodity-costs-and-returns/",
    "Operating costs per cow: $716 (2023), $690 (2024), $676 (2025). Gross value of production per cow, calves and culls: $925 (2023), $1,120 (2024), $1,417 (2025).")
src("isu_livestock_2026", "Iowa State University Extension, Ag Decision Maker B1-21, Livestock Enterprise Budgets for Iowa 2026", "2026", "https://www.extension.iastate.edu/agdm/livestock/pdf/b1-21.pdf",
    "Figures a beef cow at $2,300, a bull at $5,000 over 25 cows, a utility tractor at $30,000, 2.1 tons of hay per cow per year, 0.9 calf weaned per cow.")
src("tpwd_stocking", "Texas Parks and Wildlife, Post Oak Savannah and Blackland Prairie habitat management, livestock", "current", "https://tpwd.texas.gov/landwater/land/habitats/post_oak/habitat_management/cow",
    "One cow with calf per 3 to 6 acres on bermuda or bahia pasture, 8 to 15 acres on native grass. Texas A&M budgets figure 2.1 to 3.1 acres on North Texas improved and native pasture.")
src("ams_cattle_2026", "USDA AMS, Texas Weekly Cattle Auction Summary, week of November 8 to 14, 2026, and Oklahoma National Stockyards, November 10, 2026", "November 2026", "https://www.ams.usda.gov/mnreports/ams_1955.pdf",
    "Bred cows, medium and large frame, 5 to 8 years old: $1,882 to $2,570 average in Texas, $3,058 in Oklahoma City. Younger bred cows $2,809. Pairs $3,250. One week of sales, not a yearly average.")
src("bull_sales_2025", "UGA Calhoun Bull Evaluation Sale summary (December 2025) and Iowa State 2026 budget assumption", "2025-2026", "https://beef.caes.uga.edu/files/2025/12/2025-Calhoun-Bull-Sale-Summary.pdf",
    "71 tested bulls averaged $7,634, high $14,000. Iowa State budgets figure a bull at $5,000.")
src("mu_goat_2027", "University of Missouri Extension G691 and G690, Meat Goat Planning Budgets, 2027 and 2024", "October 2026", "https://extension.missouri.edu/media/wysiwyg/Extensiondata/Pub/pdf/agguides/agecon/g00691.pdf",
    "Replacement doe $326 (2027 budget) and $210 (2024 budget); buck $651 and $270. Operating cost per doe $222 (2024) to $398 (2027, with $106 of labor). Income per doe $381 (2027). About one doe per acre.")
src("ext_horses", "Extension Horses (horses.extension.org), Cost of Horse Ownership and The Real Cost of Owning a Horse", "2019-2020", "https://horses.extension.org/cost-of-horse-ownership/",
    "Feed and operating about $2,427 a year per horse; feeding $100 to $250 a month, farrier $25 to $50 every 6 to 8 weeks, vaccines $75 to $125 twice a year, dewormer $50. Older prices; the high here allows for that.")
src("umd_layers_2026", "University of Maryland and University of Delaware Extension, FS-2025-0783, Backyard Layer Flock Economics", "August 2026", "https://www.udel.edu/content/dam/udelImages/canr/pdfs/extension/factsheets/Backyard-Layer-Flock-Economics-a.pdf",
    "10 birds over 3 years: $1,759 all in, 522 dozen eggs, $3.37 a dozen. Simple coop and run $500; feeder, waterer, storage and heater $225. Chicks $6. Running cost works out to about $36 a bird a year and 17 dozen eggs a bird.")
src("ncsu_garden_2017", "NC State Extension AG-806, Community Food Gardening Handbook, funding section", "August 2017", "https://content.ces.ncsu.edu/funding-and-resources",
    "Start-up for a basic quarter-acre garden: roughly $1,000 to $5,000, fence and water the biggest costs.")
src("joe_garden_2014", "Journal of Extension 52(2), Langellotto, Economic Costs and Benefits of Home Vegetable Gardens", "2014", "https://commons.joe.org/joe/vol52/iss2/14",
    "Home gardens produced about $677 of food beyond $238 of supplies, so about $915 of food a year at 2014 prices. The typical and high here allow for price rises since.")
src("uky_apple_2020", "University of Kentucky Center for Crop Diversification, Apple Economics", "March 2020", "https://ccd.uky.edu/resources/budgets/apple-economics",
    "Establishing an orchard: $7,225 an acre for 155 semi-dwarf trees, about $47 a tree with prep and irrigation; $23 a tree at 340 trees an acre. A few trees bought retail cost more each.")
src("utv_2024", "DTN Progressive Farmer, Polaris 2025 Ranger line pricing", "April 2024", "https://www.dtnpf.com/agriculture/web/ag/equipment/article/2024/04/10/polaris-introduces-full-line-2025",
    "Ranger 1000 from $13,999; Crew XP 1000 from $25,499.")
src("bls_ces_2025", "BLS, Consumer Expenditures 2025", "October 29, 2026", "https://www.bls.gov/news.release/cesan.nr0.htm",
    "Average household spent $81,905 in 2025: housing $27,790, transportation $13,492, food $10,633, healthcare $6,470. Spending out there is figured as the total less housing and healthcare, which the calculator counts on their own lines.")
src("kff_premiums_2025", "KFF, 2025 Employer Health Benefits Survey, and Marketplace Average Benchmark Premiums", "October 2025", "https://www.kff.org/health-costs/press-release/2025-employer-health-benefits-survey/",
    "Employer family coverage averaged $26,993 a year, about $2,250 a month, which is roughly what COBRA costs when you leave. Marketplace benchmark plan for one 40-year-old: $625 a month in 2026, before any subsidy.")

# ---- estimates (no published source found) ----
src("est_land_spread", "Estimate: price spread", "", "sources.md", "Low is 15% under your price, high 20% over. Land is what the seller takes.", estimate=True)
src("est_mobile_used", "Estimate: used mobile home price", "", "sources.md", "No published average for used manufactured homes exists (Census tracks new homes only; new single-section averaged $85,600 in 2025). Clean used single-wides commonly change hands for a quarter to half of that; double-wides more.", estimate=True)
src("est_mobile_setup", "Estimate: delivery and setup of a manufactured home", "", "sources.md", "Transport, pad or piers, tie-downs, skirting, steps, utility hookups. No published average; figures are what movers and installers commonly quote.", estimate=True)
src("est_well_pump", "Estimate: pump package", "", "sources.md", "NGWA puts a household submersible pump at $3,000 to $3,200 (2021). Pressure tank, wiring, trench and line to the house are added as an estimate.", estimate=True)
src("est_well_annual", "Estimate: well upkeep", "", "sources.md", "Pump power plus a fund to replace a $3,000 pump every 10 to 15 years.", estimate=True)
src("est_electric_service", "Estimate: meter pole and hookup", "", "sources.md", "Meter pole, meter loop and a 200-amp panel set by an electrician. Co-ops often cover the transformer within their free allowance.", estimate=True)
src("est_solar_annual", "Estimate: solar upkeep", "", "sources.md", "A battery fund (a $15,600 battery lasts 10 to 15 years) plus cleaning and an inverter fund.", estimate=True)
src("est_fence_upkeep", "Estimate: fence repair", "", "sources.md", "1% to 4% of what the fence cost, each year, for staples, posts, wire and a stretcher day.", estimate=True)
src("est_equip_upkeep", "Estimate: equipment fuel and repairs", "", "sources.md", "5% to 12% of what the equipment cost, each year, for fuel, oil, tires, batteries and repairs.", estimate=True)
src("est_tractor", "Estimate: used tractor", "", "sources.md", "Iowa State 2026 budgets figure a utility tractor at $30,000. A used 40 to 75 hp tractor with a loader, 10 to 20 years old, runs from about $20,000 to $45,000 at dealers and auctions.", estimate=True)
src("est_trailer", "Estimate: stock trailer", "", "sources.md", "No published price report. A used 16 ft bumper-pull runs about $8,000, a new one $12,000 to $16,000, a gooseneck $18,000 to $25,000 at dealers.", estimate=True)
src("est_truck", "Estimate: used 3/4-ton truck", "", "sources.md", "Edmunds put the average 3-year-old used vehicle at $30,699 in late 2025. Three-quarter-ton trucks hold value and run higher; an older one with miles runs lower.", estimate=True)
src("est_horse", "Estimate: using horse", "", "sources.md", "No published average. Sound, broke using horses commonly sell from $2,500 to $10,000 at ranch horse sales.", estimate=True)
src("est_pullet", "Estimate: started pullets", "", "sources.md", "Chicks run $6 (Maryland Extension, 2026). Started pullets near laying age cost more because someone fed them for four months.", estimate=True)
src("est_egg_value", "Estimate: store value of a dozen eggs", "", "sources.md", "Maryland Extension figures the cost to raise a dozen at $3.37. Store eggs ran $3 to $6 a dozen in 2025.", estimate=True)
src("est_surprises", "Estimate: cushion for surprises", "", "sources.md", "5% to 15% on top of everything. Rock in the trench, a bad culvert, a second load of gravel.", estimate=True)
src("est_ag_share", "Estimate: ag valuation share", "", "sources.md", "Where land qualifies for agricultural use valuation, it is taxed on a fraction of market value, commonly a tenth to a quarter. Varies by state and county; ask the appraisal district.", estimate=True)

I = {}


def item(k, label, unit, low, typ, high, source):
    assert low <= typ <= high, k
    assert source in S, (k, source)
    I[k] = {"label": label, "unit": unit, "low": low, "typ": typ, "high": high, "source": source}


# one time
item("land_spread", "Spread around your land price", "x price", 0.85, 1.0, 1.2, "est_land_spread")
item("closing_pct", "Closing costs", "share of land price", 0.010, 0.015, 0.020, "closingcorp_2021")
item("survey", "Boundary survey", "$", 2500, 3500, 6000, "survey_cost")
item("house_build_sqft", "Site-built house", "$ per sq ft", 130, 162, 195, "nahb_2024")
item("house_barndo_sqft", "Barndominium, finished", "$ per sq ft", 125, 150, 200, "fbi_barndo_2024")
item("house_mobile_new", "New manufactured home", "$", 85600, 127200, 157100, "census_mhs_2025")
item("house_mobile_used", "Used mobile home", "$", 20000, 40000, 70000, "est_mobile_used")
item("mobile_setup", "Delivery, pad, tie-downs, skirting, hookups", "$", 8000, 15000, 25000, "est_mobile_setup")
item("well_per_ft", "Well drilling and casing", "$ per ft", 24, 30, 45, "ngwa_2021")
item("well_pump_package", "Pump, pressure tank, wiring, trench", "$", 3000, 4500, 7000, "est_well_pump")
item("septic_conventional", "Conventional septic", "$", 3000, 9000, 15000, "epa_septic_2018")
item("septic_aerobic", "Aerobic septic", "$", 10000, 15000, 30000, "epa_septic_2018")
item("electric_line_per_ft", "Power line extension", "$ per ft", 5, 13, 20, "coop_line_ext")
item("electric_service", "Meter pole and hookup", "$", 1500, 2500, 4000, "est_electric_service")
item("solar_offgrid", "Off-grid solar with batteries", "$", 35000, 60000, 116000, "energysage_offgrid_2026")
item("fence_barbed_per_ft", "5-strand barbed wire, built", "$ per ft", 1.99, 2.50, 3.03, "mu_fence_2026")
item("fence_woven_per_ft", "Woven wire, built", "$ per ft", 2.34, 3.15, 3.94, "mu_fence_2026")
item("fence_hightensile_per_ft", "High-tensile electric, built", "$ per ft", 1.21, 1.85, 2.51, "mu_fence_2026")
item("barn_sqft", "Pole barn, built", "$ per sq ft", 25, 40, 60, "pole_barn_prices")
item("tractor_used", "Used tractor with loader", "$", 20000, 30000, 45000, "est_tractor")
item("trailer_stock", "Stock trailer", "$", 8000, 14000, 25000, "est_trailer")
item("truck_used", "Used 3/4-ton truck", "$", 20000, 35000, 55000, "est_truck")
item("utv", "Side-by-side", "$", 14000, 18000, 25500, "utv_2024")
item("cow_bred", "Bred cow", "$ per head", 1900, 2600, 3100, "ams_cattle_2026")
item("bull", "Bull", "$", 5000, 7600, 14000, "bull_sales_2025")
item("horse", "Using horse", "$ per head", 2500, 5000, 10000, "est_horse")
item("goat_doe", "Meat goat doe", "$ per head", 210, 326, 400, "mu_goat_2027")
item("goat_buck", "Buck", "$", 270, 460, 651, "mu_goat_2027")
item("pullet", "Started pullet", "$ per bird", 6, 25, 40, "est_pullet")
item("coop", "Coop, run, feeder, waterer", "$", 500, 725, 1500, "umd_layers_2026")
item("garden_startup", "Garden start-up", "$", 1000, 2500, 5000, "ncsu_garden_2017")
item("fruit_tree", "Fruit tree, planted", "$ per tree", 25, 47, 70, "uky_apple_2020")
item("surprises_pct", "Surprises", "share of setup", 0.05, 0.10, 0.15, "est_surprises")
item("ag_valuation_share", "Ag valuation share of market value", "share", 0.10, 0.15, 0.25, "est_ag_share")
item("acres_per_cow", "Acres per cow", "acres", 3, 4, 8, "tpwd_stocking")
# every year
item("insurance_annual", "Insurance, house, buildings, liability", "$ per year", 1731, 2500, 4000, "naic_home_2023")
item("cow_annual", "Keeping a cow", "$ per head per year", 330, 510, 690, "tamu_cowcalf_2025")
item("horse_annual", "Keeping a horse", "$ per head per year", 1800, 2430, 3600, "ext_horses")
item("goat_annual", "Keeping a doe", "$ per head per year", 220, 300, 400, "mu_goat_2027")
item("hen_annual", "Keeping a hen", "$ per bird per year", 30, 36, 45, "umd_layers_2026")
item("fence_upkeep_pct", "Fence repair", "share of fence cost per year", 0.01, 0.02, 0.04, "est_fence_upkeep")
item("equipment_upkeep_pct", "Equipment fuel and repairs", "share of equipment cost per year", 0.05, 0.08, 0.12, "est_equip_upkeep")
item("septic_annual", "Septic pumping and upkeep", "$ per year", 25, 60, 150, "mu_septic_2017")
item("well_annual", "Well upkeep", "$ per year", 200, 400, 700, "est_well_annual")
item("solar_annual", "Solar upkeep", "$ per year", 1000, 2500, 4000, "est_solar_annual")
item("electric_bill_annual", "Electric bill", "$ per year", 1550, 1707, 2100, "eia_bill_2024")
item("garden_annual", "Garden seed and supplies", "$ per year", 238, 350, 600, "joe_garden_2014")
item("household_spending", "Household spending, US average", "$ per year", 78535, 81905, 81905, "bls_ces_2025")
item("household_spending_rural", "Household spending less housing and healthcare", "$ per year", 47645, 47645, 47645, "bls_ces_2025")
item("health_family_monthly", "Health insurance, family, full price", "$ per month", 625, 2249, 2249, "kff_premiums_2025")
# what the place brings in
item("calf_sale", "Calves and culls sold", "$ per cow per year", 925, 1120, 1417, "ers_cowcalf_2025")
item("kid_sale", "Kids and culls sold", "$ per doe per year", 305, 381, 460, "mu_goat_2027")
item("eggs_dozen_per_hen", "Eggs laid", "dozen per hen per year", 15, 17.4, 20, "umd_layers_2026")
item("egg_dozen_value", "Store value of a dozen eggs", "$ per dozen", 3.37, 4.00, 6.00, "est_egg_value")
item("garden_food_value", "Food from a big garden", "$ per year", 677, 915, 1200, "joe_garden_2014")

# Well depth defaults: USGS national medians, and per state the median of the county medians
# from the USGS pull in data/counties.json (only states with 10 or more counties reporting).
with open(os.path.join(ROOT, "data", "counties.json"), encoding="utf-8") as f:
    counties = json.load(f)
by_state = {}
for st, rows in counties["states"].items():
    depths = [r[3] for r in rows if r[3]]
    if len(depths) >= 10:
        m = int(round(statistics.median(depths) / 10) * 10)
        by_state[st] = {"typ": m, "note": "USGS-recorded wells across " + st + " counties run a median of " + format(m, ",") + " ft; those skew toward deep irrigation and test wells, so a house well is often shallower. Ask a local driller."}

out = {
    "built": "2026-11-13",
    "note": "Every item has low / typ / high and a source id. Sources marked estimate have no published figure behind them; basis says how the number was reached. Dollar figures are as published, not adjusted for inflation unless the basis says so.",
    "items": I,
    "sources": S,
    "well_depth_default": {"typ": 200, "note": "USGS: half of US house wells are shallower than 142 ft, public supply wells 202 ft. 200 ft is a planning middle."},
    "well_depth_by_state": by_state,
}
with open(os.path.join(ROOT, "data", "costs.json"), "w", encoding="utf-8") as f:
    json.dump(out, f, indent=1, ensure_ascii=False)
print("items", len(I), "sources", len(S), "estimates", sum(1 for s in S.values() if s.get("estimate")), "well-depth states", len(by_state))
