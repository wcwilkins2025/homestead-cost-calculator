# Sources

Every default on the page comes from one of the tables below. `data/costs.json` holds each cost item with low, typical and high and a `source` id; this file is generated from it by `scripts/make_sources.py`. Dollar figures are as published and are not adjusted for inflation unless the note says so.

Items marked **estimate** have no published figure behind them. The basis says how the number was reached. If you know a published source for one, open an issue.

## Land, tax and county tables

| Used for | Source | Date | Link |
|---|---|---|---|
| State land values and pasture rent (price per acre default when the county has none) | USDA NASS, Land Values 2025 Summary, farm real estate, cropland and pasture average value per acre by state (tables pp. 8-15) | August 2025 | https://usda.library.cornell.edu/concern/publications/pl8sd6t4z |
| State land values and pasture rent (price per acre default when the county has none) | USDA NASS QuickStats, Cash Rents 2025: pastureland rent, $ per acre, by state | August 29, 2025 | https://quickstats.nass.usda.gov/results/58B27A06-F574-315B-A854-9BF568F17652 |
| State property tax rate default | Tax Foundation, Property Taxes by State and County, 2026, Table 2: property taxes paid as a percentage of owner-occupied housing value, 2024 | March 16, 2026 | https://taxfoundation.org/data/all/state/property-taxes-by-state-county/ |
| County table (land value per acre, median recorded well depth, tax rate) | USDA NASS, 2022 Census of Agriculture: value of ag land and buildings per acre, by county | 2022, file dated February 14, 2024 | https://www.nass.usda.gov/sites/default/files/datasets/qs.census2022.txt.gz |
| County table (land value per acre, median recorded well depth, tax rate) | USGS National Water Information System, groundwater site inventory: median recorded well depth by county | inventory as of November 13, 2026 | https://waterservices.usgs.gov/nwis/site/ |
| County table (land value per acre, median recorded well depth, tax rate) | Census Bureau, ACS 2019-2023 5-year, tables B25077 and B25103: median property tax paid as a share of median home value, by county | 2019-2023 | https://data.census.gov/ |

The county table was built from the Land Finder's public county file (same three sources) by `scripts/build_counties.py`. USGS well depths are medians of wells on record in the county, which skew toward irrigation and test wells; the page shows them as a hint only.

## Cost items

| Item | Low | Typical | High | Unit | Source |
|---|---:|---:|---:|---|---|
| Spread around your land price (`land_spread`) | 0.85 | 1 | 1.2 | x price | est_land_spread **estimate** |
| Closing costs (`closing_pct`) | 0.01 | 0.015 | 0.02 | share of land price | closingcorp_2021 |
| Boundary survey (`survey`) | 2,500 | 3,500 | 6,000 | $ | survey_cost |
| Site-built house (`house_build_sqft`) | 130 | 162 | 195 | $ per sq ft | nahb_2024 |
| Barndominium, finished (`house_barndo_sqft`) | 125 | 150 | 200 | $ per sq ft | fbi_barndo_2024 |
| New manufactured home (`house_mobile_new`) | 85,600 | 127,200 | 157,100 | $ | census_mhs_2025 |
| Used mobile home (`house_mobile_used`) | 20,000 | 40,000 | 70,000 | $ | est_mobile_used **estimate** |
| Delivery, pad, tie-downs, skirting, hookups (`mobile_setup`) | 8,000 | 15,000 | 25,000 | $ | est_mobile_setup **estimate** |
| Well drilling and casing (`well_per_ft`) | 24 | 30 | 45 | $ per ft | ngwa_2021 |
| Pump, pressure tank, wiring, trench (`well_pump_package`) | 3,000 | 4,500 | 7,000 | $ | est_well_pump **estimate** |
| Conventional septic (`septic_conventional`) | 3,000 | 9,000 | 15,000 | $ | epa_septic_2018 |
| Aerobic septic (`septic_aerobic`) | 10,000 | 15,000 | 30,000 | $ | epa_septic_2018 |
| Power line extension (`electric_line_per_ft`) | 5 | 13 | 20 | $ per ft | coop_line_ext |
| Meter pole and hookup (`electric_service`) | 1,500 | 2,500 | 4,000 | $ | est_electric_service **estimate** |
| Off-grid solar with batteries (`solar_offgrid`) | 35,000 | 60,000 | 116,000 | $ | energysage_offgrid_2026 |
| 5-strand barbed wire, built (`fence_barbed_per_ft`) | 1.99 | 2.5 | 3.03 | $ per ft | mu_fence_2026 |
| Woven wire, built (`fence_woven_per_ft`) | 2.34 | 3.15 | 3.94 | $ per ft | mu_fence_2026 |
| High-tensile electric, built (`fence_hightensile_per_ft`) | 1.21 | 1.85 | 2.51 | $ per ft | mu_fence_2026 |
| Pole barn, built (`barn_sqft`) | 25 | 40 | 60 | $ per sq ft | pole_barn_prices |
| Used tractor with loader (`tractor_used`) | 20,000 | 30,000 | 45,000 | $ | est_tractor **estimate** |
| Stock trailer (`trailer_stock`) | 8,000 | 14,000 | 25,000 | $ | est_trailer **estimate** |
| Used 3/4-ton truck (`truck_used`) | 20,000 | 35,000 | 55,000 | $ | est_truck **estimate** |
| Side-by-side (`utv`) | 14,000 | 18,000 | 25,500 | $ | utv_2024 |
| Bred cow (`cow_bred`) | 1,900 | 2,600 | 3,100 | $ per head | ams_cattle_2026 |
| Bull (`bull`) | 5,000 | 7,600 | 14,000 | $ | bull_sales_2025 |
| Using horse (`horse`) | 2,500 | 5,000 | 10,000 | $ per head | est_horse **estimate** |
| Meat goat doe (`goat_doe`) | 210 | 326 | 400 | $ per head | mu_goat_2027 |
| Buck (`goat_buck`) | 270 | 460 | 651 | $ | mu_goat_2027 |
| Started pullet (`pullet`) | 6 | 25 | 40 | $ per bird | est_pullet **estimate** |
| Coop, run, feeder, waterer (`coop`) | 500 | 725 | 1,500 | $ | umd_layers_2026 |
| Garden start-up (`garden_startup`) | 1,000 | 2,500 | 5,000 | $ | ncsu_garden_2017 |
| Fruit tree, planted (`fruit_tree`) | 25 | 47 | 70 | $ per tree | uky_apple_2020 |
| Surprises (`surprises_pct`) | 0.05 | 0.1 | 0.15 | share of setup | est_surprises **estimate** |
| Ag valuation share of market value (`ag_valuation_share`) | 0.1 | 0.15 | 0.25 | share | est_ag_share **estimate** |
| Acres per cow (`acres_per_cow`) | 3 | 4 | 8 | acres | tpwd_stocking |
| Insurance, house, buildings, liability (`insurance_annual`) | 1,731 | 2,500 | 4,000 | $ per year | naic_home_2023 **estimate** |
| Keeping a cow (`cow_annual`) | 330 | 510 | 690 | $ per head per year | tamu_cowcalf_2025 |
| Keeping a horse (`horse_annual`) | 1,800 | 2,430 | 3,600 | $ per head per year | ext_horses |
| Keeping a doe (`goat_annual`) | 220 | 300 | 400 | $ per head per year | mu_goat_2027 |
| Keeping a hen (`hen_annual`) | 30 | 36 | 45 | $ per bird per year | umd_layers_2026 |
| Fence repair (`fence_upkeep_pct`) | 0.01 | 0.02 | 0.04 | share of fence cost per year | est_fence_upkeep **estimate** |
| Equipment fuel and repairs (`equipment_upkeep_pct`) | 0.05 | 0.08 | 0.12 | share of equipment cost per year | est_equip_upkeep **estimate** |
| Septic pumping and upkeep (`septic_annual`) | 25 | 60 | 150 | $ per year | mu_septic_2017 |
| Well upkeep (`well_annual`) | 200 | 400 | 700 | $ per year | est_well_annual **estimate** |
| Solar upkeep (`solar_annual`) | 1,000 | 2,500 | 4,000 | $ per year | est_solar_annual **estimate** |
| Electric bill (`electric_bill_annual`) | 1,550 | 1,707 | 2,100 | $ per year | eia_bill_2024 |
| Garden seed and supplies (`garden_annual`) | 238 | 350 | 600 | $ per year | joe_garden_2014 |
| Household spending, US average (`household_spending`) | 78,535 | 81,905 | 81,905 | $ per year | bls_ces_2025 |
| Household spending less housing and healthcare (`household_spending_rural`) | 47,645 | 47,645 | 47,645 | $ per year | bls_ces_2025 |
| Health insurance, family, full price (`health_family_monthly`) | 625 | 2,249 | 2,249 | $ per month | kff_premiums_2025 |
| Calves and culls sold (`calf_sale`) | 925 | 1,120 | 1,417 | $ per cow per year | ers_cowcalf_2025 |
| Kids and culls sold (`kid_sale`) | 305 | 381 | 460 | $ per doe per year | mu_goat_2027 |
| Eggs laid (`eggs_dozen_per_hen`) | 15 | 17.4 | 20 | dozen per hen per year | umd_layers_2026 |
| Store value of a dozen eggs (`egg_dozen_value`) | 3.37 | 4 | 6 | $ per dozen | est_egg_value **estimate** |
| Food from a big garden (`garden_food_value`) | 677 | 915 | 1,200 | $ per year | joe_garden_2014 |
| Pasture cash rent (`lease_rate_us`) | 7.7 | 15.5 | 38.5 | $ per acre per year | nass_rent_2025 |
| Grazing season (`lease_months`) | 5 | 9 | 12 | months | osu_cr216_2021 |
| Acres per cow on leased grass (`lease_apc`) | 3 | 4 | 9.4 | acres | osu_cr216_2021 |
| Labor per cow (`labor_hours_cow`) | 3.72 | 5.65 | 12 | hours per year | est_labor_small **estimate** |
| Calves weaned per cow (`calf_crop`) | 0.8 | 0.85 | 0.9 | share | est_calf_crop **estimate** |
| Cows culled each year (`cull_rate`) | 0.1 | 0.12 | 0.15 | share | tamu_cowcalf_2025 |
| Share of a cow's yearly income that is calves, not culls (`calf_income_share`) | 0.8 | 0.87 | 0.9 | share | est_calf_crop **estimate** |
| Operator share of calf money on leased cows (`cow_share_operator`) | 0.6 | 0.66 | 0.7 | share | est_share_high **estimate** |
| Care for other men's pairs (`custom_care_day`) | 0.43 | 1 | 1.56 | $ per head per day | unl_custom_2025 |
| Pasture rent per pair per month (`pair_rent_month`) | 56.45 | 67 | 82.1 | $ per pair per month | unl_realestate_2026 |
| Stocker calf bought (`stocker_in`) | 1,440 | 1,500 | 1,550 | $ per head | tamu_stocker_2025 |
| Stocker returns to management (`stocker_net`) | 11 | 60 | 108 | $ per head per season | tamu_stocker_2025 |
| Grazing cost built into the stocker budget (`stocker_grazing_budget`) | 50 | 70 | 70 | $ per head per season | tamu_stocker_2025 |
| Acres per stocker for the season (`stocker_acres`) | 4 | 5 | 6 | acres | tamu_stocker_2025 |
| Labor per stocker (`stocker_hours`) | 0.5 | 1 | 2 | hours per season | tamu_stocker_2025 |
| Panels, chute, tank, mineral feeders (`handling_setup`) | 3,000 | 6,000 | 10,000 | $ | est_handling **estimate** |
| Beef sold by the half or quarter (`beef_hanging_price`) | 4.25 | 5.9 | 6.95 | $ per lb hanging weight | ams_grassfed_2026 |
| Grass-finished carcass (`beef_hanging_wt`) | 500 | 560 | 650 | lb hanging | uaex_fsa3143_2021 |
| Weaned steer calf at the sale barn (`calf_weaned_value`) | 1,549 | 2,706 | 2,900 | $ per head | est_calf_value_high **estimate** |
| Carrying a calf a year to finish, not counting grass (`finish_carry`) | 200 | 255 | 345 | $ per head | est_finish_carry **estimate** |
| Processing paid by the customer (`processing_hanging`) | 0.57 | 0.94 | 1.25 | $ per lb hanging | ams_grassfed_2026 |
| FSA operating microloan limit (`fsa_microloan_max`) | 50,000 | 50,000 | 50,000 | $ | fsa_chart_2025 |
| FSA direct operating loan limit (`fsa_operating_max`) | 400,000 | 400,000 | 400,000 | $ | fsa_chart_2025 |
| FSA operating loan rate (`fsa_operating_rate`) | 5 | 5.62 | 5.62 | % per year | fsa_rates_2026 |
| FSA operating loan term (`fsa_operating_years`) | 1 | 7 | 7 | years | fsa_chart_2025 |
| Rent for a house in the country (`rent_monthly`) | 985 | 1,370 | 1,652 | $ per month | hud_fmr_2026 |
| Grass hay (`hay_ton`) | 125 | 138 | 161 | $ per ton | nass_cropvalues_2026 |
| Custom round baling (`custom_bale`) | 13.15 | 15.75 | 17.88 | $ per bale | isu_custom_2026 |
| Custom pasture mowing or shredding (`custom_mow_acre`) | 4.6 | 27.05 | 105.55 | $ per acre | isu_custom_2026 |

## Source list

### Published

- **ngwa_2021**: National Ground Water Association, Well Owners Guide, 2021. https://wellowner.org/wp-content/uploads/2021/04/2021-WellOwners-Guide.pdf Drilling ran about $24 a foot for a 4-inch well and $30 for a 6-inch well, casing extra. A household submersible pump ran $3,000 to $3,200. The high figure here adds casing and five years of price rises.
- **umn_well_2022**: University of Minnesota Extension, Digging or expanding a well, reviewed 2022. https://extension.umn.edu/vegetable-growing-guides-farmers/digging-or-expanding-well A new well for a 5 to 20 acre farm: $5,000 to $30,000.
- **usgs_well_depth_2021**: USGS Scientific Investigations Report 2021-5069, depth of groundwater used for drinking water, 2021. https://www.usgs.gov/publications/depth-groundwater-used-drinking-water-supplies-united-states Median depth of US domestic wells is 142 ft; public supply wells 202 ft.
- **epa_septic_2018**: US EPA Water Finance Clearinghouse, Financing Septic Systems, September 2018. https://clearinghouse.epa.gov/ords/wfc/r/wfc/files/static/v744/Financing_Septic_Systems_508.pdf Conventional system installed, with permits: $3,000 to $15,000. Alternative and advanced systems: $10,000 to $30,000. State examples ran $4,000 to $18,000.
- **mu_septic_2017**: University of Missouri Extension EQM104F, Household Wastewater, September 2017. https://extension.missouri.edu/publications/eqm104f Pumping a tank: $100 to $250, every 3 to 5 years. High figure allows for an aerobic service contract.
- **coop_line_ext**: Rural electric co-op line extension policies: Webster Electric (MO) 2025, Upper Cumberland EMC (TN) 2025, Cullman Electric (AL) 2023, Missouri PSC comparison 2015, 2015-2025. https://www.websterec.com/webster-electric-cooperative-line-extension-policy/ Webster: first 200 ft free, then $5 a foot overhead. Cullman: first 400 ft free, then $13 overhead, $20 underground. UCEMC: $17 a foot overhead. Missouri PSC survey: $15 overhead, $23 underground. Texas and Oklahoma co-ops publish a free allowance ($1,950 to $7,500) and charge the rest at cost.
- **eia_bill_2024**: US EIA, Table 5.A, 2024 average monthly residential electric bill by state, October 2025. https://www.eia.gov/electricity/sales_revenue_price/ US $142 a month. Missouri $129, Arkansas $129, Oklahoma $132, Kentucky $134, Tennessee $143, Texas $164, Alabama $174.
- **nrel_solar_2025**: US DOE SETO and NREL, Solar Photovoltaic System Cost Benchmarks, Q1 2025, 2025. https://www.energy.gov/eere/solar/solar-photovoltaic-system-cost-benchmarks An 8 kW home system with a 13.5 kWh battery: $4.33 to $4.59 a watt installed, about $35,000 to $37,000. Off-grid needs more battery.
- **energysage_offgrid_2026**: EnergySage, Off-Grid Solar: Costs, Process, and Best Products, and Solar Battery Cost, June and July 2026. https://www.energysage.com/solar/what-does-it-mean-to-go-off-the-grid/ A full off-grid system for an average house often runs $115,000 or more. A 13.5 kWh battery runs about $15,600 installed. Low here is the NREL 8 kW system with one battery ($35,000); typical adds two more batteries, sized for a modest house that uses less than average.
- **isu_fence_2024**: Iowa State University Extension, Ag Decision Maker B1-75, Estimated Costs for Livestock Fencing, December 2024. https://www.extension.iastate.edu/agdm/livestock/pdf/b1-75.pdf Per foot built, labor at $20 an hour, no gates: woven wire $2.34, 5-strand barbed $1.99, high-tensile electric $1.21.
- **mu_fence_2026**: University of Missouri Extension G1193, Pasture Fence Construction Budget, April 2026. https://extension.missouri.edu/publications/g1193 Per foot built, with a gate: woven wire $3.94, 5-strand barbed $3.03, electric high-tensile $2.51. Low here is the Iowa State 2024 figure for the same fence; typical is the middle of the two.
- **pole_barn_prices**: Morton Buildings (2022) and FBi Buildings (2021) published shell pricing; Hansen Pole Buildings kit prices (2026), 2021-2026. https://mortonbuildings.com/blog/what-does-a-morton-garage-hobby-building-or-workshop-cost Erected shell $25 to $55 a square foot depending on size; kit materials only $9 to $13; concrete and finish add $50 or more. Typical here is a 30 x 40 erected shell with a slab.
- **nahb_2024**: NAHB, Cost of Constructing a Home 2024, January 2025. https://nahb.org/-/media/AB4EFC742624475A97A0A62189986FF8.ashx Average construction cost $428,215 for 2,647 sq ft, about $162 a square foot, not counting the lot. Low and high here spread 20% either side.
- **fbi_barndo_2024**: FBi Buildings, How Much Does a 1,500 Square Foot Barndominium Cost, June 2024. https://info.fbibuildings.com/blog/1500-barndominium-cost Shell $45 to $75 a square foot; finished $125 basic, $150 to $400 with upgrades.
- **census_mhs_2025**: US Census Bureau, Manufactured Housing Survey, average sales price of new manufactured homes, 2025, June 2026. https://www.census.gov/programs-surveys/mhs/data/annual-data.html Single-section $85,600, double-section $157,100, all homes $127,200. Factory price, before delivery and setup.
- **closingcorp_2021**: CoreLogic ClosingCorp, Purchase Mortgage Closing Cost Report 2021, April 2022. https://newslink.mba.org/?p=164773 Closing costs averaged 1.01% of price without transfer taxes and 1.81% with. Cash land deals skip lender fees; land loans add origination.
- **survey_cost**: University of Missouri Extension G5055 (2017, reviewed 2026) and LandThink, Tips on Rural Land Surveys (2019), 2017-2026. https://extension.missouri.edu/publications/g5055 $2,500 for a boundary survey on a 100-acre example; $3,000 to $6,000 for an 80-acre tract.
- **tamu_cowcalf_2025**: Texas A&M AgriLife Extension, 2025 cow-calf budgets, North Texas District 4, improved and native pasture, March 2025. https://agecoext.tamu.edu/wp-content/uploads/2025/03/2025D4CowCalfImprove.pdf Cash costs per cow with your own labor taken out: about $330 on improved pasture, $510 on native pasture (hay $159 to $318, marketing $40, mineral $19, vet $25, supplement, fuel, repairs, interest). High is the USDA ERS 2024 US operating cost of $690.
- **ers_cowcalf_2025**: USDA ERS, Commodity Costs and Returns, cow-calf, US total, dollars per cow, October 2026. https://www.ers.usda.gov/data-products/commodity-costs-and-returns/ Operating costs per cow: $716 (2023), $690 (2024), $676 (2025). Gross value of production per cow, calves and culls: $925 (2023), $1,120 (2024), $1,417 (2025).
- **isu_livestock_2026**: Iowa State University Extension, Ag Decision Maker B1-21, Livestock Enterprise Budgets for Iowa 2026, 2026. https://www.extension.iastate.edu/agdm/livestock/pdf/b1-21.pdf Figures a beef cow at $2,300, a bull at $5,000 over 25 cows, a utility tractor at $30,000, 2.1 tons of hay per cow per year, 0.9 calf weaned per cow.
- **tpwd_stocking**: Texas Parks and Wildlife, Post Oak Savannah and Blackland Prairie habitat management, livestock, current. https://tpwd.texas.gov/landwater/land/habitats/post_oak/habitat_management/cow One cow with calf per 3 to 6 acres on bermuda or bahia pasture, 8 to 15 acres on native grass. Texas A&M budgets figure 2.1 to 3.1 acres on North Texas improved and native pasture.
- **ams_cattle_2026**: USDA AMS, Texas Weekly Cattle Auction Summary, week of November 8 to 14, 2026, and Oklahoma National Stockyards, November 10, 2026, November 2026. https://www.ams.usda.gov/mnreports/ams_1955.pdf Bred cows, medium and large frame, 5 to 8 years old: $1,882 to $2,570 average in Texas, $3,058 in Oklahoma City. Younger bred cows $2,809. Pairs $3,250. One week of sales, not a yearly average.
- **bull_sales_2025**: UGA Calhoun Bull Evaluation Sale summary (December 2025) and Iowa State 2026 budget assumption, 2025-2026. https://beef.caes.uga.edu/files/2025/12/2025-Calhoun-Bull-Sale-Summary.pdf 71 tested bulls averaged $7,634, high $14,000. Iowa State budgets figure a bull at $5,000.
- **mu_goat_2027**: University of Missouri Extension G691 and G690, Meat Goat Planning Budgets, 2027 and 2024, October 2026. https://extension.missouri.edu/media/wysiwyg/Extensiondata/Pub/pdf/agguides/agecon/g00691.pdf Replacement doe $326 (2027 budget) and $210 (2024 budget); buck $651 and $270. Operating cost per doe $222 (2024) to $398 (2027, with $106 of labor). Income per doe $381 (2027). About one doe per acre.
- **ext_horses**: Extension Horses (horses.extension.org), Cost of Horse Ownership and The Real Cost of Owning a Horse, 2019-2020. https://horses.extension.org/cost-of-horse-ownership/ Feed and operating about $2,427 a year per horse; feeding $100 to $250 a month, farrier $25 to $50 every 6 to 8 weeks, vaccines $75 to $125 twice a year, dewormer $50. Older prices; the high here allows for that.
- **umd_layers_2026**: University of Maryland and University of Delaware Extension, FS-2025-0783, Backyard Layer Flock Economics, August 2026. https://www.udel.edu/content/dam/udelImages/canr/pdfs/extension/factsheets/Backyard-Layer-Flock-Economics-a.pdf 10 birds over 3 years: $1,759 all in, 522 dozen eggs, $3.37 a dozen. Simple coop and run $500; feeder, waterer, storage and heater $225. Chicks $6. Running cost works out to about $36 a bird a year and 17 dozen eggs a bird.
- **ncsu_garden_2017**: NC State Extension AG-806, Community Food Gardening Handbook, funding section, August 2017. https://content.ces.ncsu.edu/funding-and-resources Start-up for a basic quarter-acre garden: roughly $1,000 to $5,000, fence and water the biggest costs.
- **joe_garden_2014**: Journal of Extension 52(2), Langellotto, Economic Costs and Benefits of Home Vegetable Gardens, 2014. https://commons.joe.org/joe/vol52/iss2/14 Home gardens produced about $677 of food beyond $238 of supplies, so about $915 of food a year at 2014 prices. The typical and high here allow for price rises since.
- **uky_apple_2020**: University of Kentucky Center for Crop Diversification, Apple Economics, March 2020. https://ccd.uky.edu/resources/budgets/apple-economics Establishing an orchard: $7,225 an acre for 155 semi-dwarf trees, about $47 a tree with prep and irrigation; $23 a tree at 340 trees an acre. A few trees bought retail cost more each.
- **utv_2024**: DTN Progressive Farmer, Polaris 2025 Ranger line pricing, April 2024. https://www.dtnpf.com/agriculture/web/ag/equipment/article/2024/04/10/polaris-introduces-full-line-2025 Ranger 1000 from $13,999; Crew XP 1000 from $25,499.
- **bls_ces_2025**: BLS, Consumer Expenditures 2025, October 29, 2026. https://www.bls.gov/news.release/cesan.nr0.htm Average household spent $81,905 in 2025: housing $27,790, transportation $13,492, food $10,633, healthcare $6,470. Spending out there is figured as the total less housing and healthcare, which the calculator counts on their own lines.
- **kff_premiums_2025**: KFF, 2025 Employer Health Benefits Survey, and Marketplace Average Benchmark Premiums, October 2025. https://www.kff.org/health-costs/press-release/2025-employer-health-benefits-survey/ Employer family coverage averaged $26,993 a year, about $2,250 a month, which is roughly what COBRA costs when you leave. Marketplace benchmark plan for one 40-year-old: $625 a month in 2026, before any subsidy.
- **nass_rent_2025**: USDA NASS Quick Stats, cash rent for pastureland by state, 2025, August 2025. https://quickstats.nass.usda.gov/ Pasture cash rent per acre, 2025: US $15.50, Texas $7.70, Oklahoma $18, Arkansas $22, Tennessee $26, Kentucky $35, Missouri $38.50. State averages lean on big native-range leases; improved pasture near town rents higher.
- **isu_rent_2026**: Iowa State University Extension, Ag Decision Maker C2-10, Cash Rental Rates for Iowa 2026 Survey, May 2026. https://www.extension.iastate.edu/agdm/wholefarm/pdf/c2-10.pdf Pasture $27 per animal unit month. Improved pasture $102 an acre, poor pasture $63 an acre, statewide, 1,450 responses.
- **unl_realestate_2026**: University of Nebraska, Nebraska Farm Real Estate Market Highlights 2025-2026, Table 11, June 2026. https://cap.unl.edu/realestate/ Pasture rent per cow-calf pair per month, 2026, by district: $56.45 to $82.10. Stocker calf $32 to $51 a month. The monthly rate is traditionally multiplied by a five-month season.
- **osu_cr216_2021**: Oklahoma State University Extension CR-216, Oklahoma Pasture Rental Rates 2020-21, March 2021. https://extension.okstate.edu/fact-sheets/oklahoma-pasture-rental-rates-2020-21.html Native pasture $15.42 an acre, bermudagrass $20.22. Grazing season 9.1 months. 9.4 acres per cow on native range. Of 623 leases, the livestock owner paid for mineral in 98%, fence labor in 85%, fence materials in 73%, water in 75%.
- **ncfmec03_2011**: North Central Farm Management Extension Committee, NCFMEC-03, Pasture Rental Arrangements for Your Farm, December 2011. https://www.agmanager.info/sites/default/files/NCFMEC-03.pdf Sample lease assigns fence repair, water, mineral, checking cattle, vet calls and fly control to landlord or tenant by checkbox. Yearling example $25 a month for a four-month season.
- **ncfmec06_2013**: North Central Farm Management Extension Committee, NCFMEC-06, Beef Cow Rental Arrangements for Your Farm, February 2013. https://ag.purdue.edu/commercialag/home/wp-content/uploads/2013/02/201302_NCFMEC_BeefCowRentalalArrangementsForYourFarm.pdf Worked example: the operator who supplies grass, hay, labor and management contributes 65.9% of the cost and takes 65.9% of the calf money; the cow owner 34.1%. The owner keeps all cull cow sales. Labor 5.65 hours per cow per year. Leased bulls run $700 or more a season.
- **isu_c2_33_2011**: Iowa State University Extension, Ag Decision Maker C2-33, Beef Cow Joint Agreements, September 2011. https://www.extension.iastate.edu/agdm/wholefarm/html/c2-36.html When the owner supplies the cows and the pasture, calf income splits 40% owner, 60% operator. A labor-only party earns 20% to 25% of the calf crop.
- **unl_custom_2025**: University of Nebraska, Custom Service Rates Related to Livestock Production in Nebraska 2025, June 2025. https://cap.unl.edu/sites/unl.edu.ianr.agecon.center-for-ag-profitability/files/media/file/nebraska-custom-rates-livestock-2025_ada.pdf Care for cow-calf pairs on summer pasture, not counting pasture rent or feed: $1.00 per head per day. Wintering cows $1.56 a day, range $0.83 to $2.40.
- **ksu_bluestem_2025**: Kansas State University and Kansas Department of Agriculture, Bluestem Pasture Release 2025, May 2025. https://www.agmanager.info/sites/default/files/pdf/BluestemReport_2025.pdf A 1,250 lb cow-calf pair for the full summer: $276.25 with care, $210.84 without, so care is worth about $65 a pair a season. 600 lb stocker $133.75 with care. 8.1 acres per pair.
- **tamu_stocker_2025**: Texas A&M AgriLife Extension, 2025 stocker budgets, District 8 native pasture and District 11 Coastal Bend, March and April 2025. https://agecoext.tamu.edu/wp-content/uploads/2025/03/2025D8StockersNative.pdf District 8: buy a 400 lb calf at $360 a cwt ($1,440), sell at 750 lb and $255, grazing 5 acres at $14, labor $15.83, returns to management $107.63 a head. District 11: buy 500 lb at $310 ($1,550), 160 days grazing, returns $10.99 a head.
- **ams_grassfed_2026**: USDA AMS, National Grass Fed Beef Report, 2026 Quarter 3, September 2026. https://www.ams.usda.gov/mnreports/lsmngfbeef.pdf Direct sales by hanging weight, processing not included: whole $4.00 to $7.90 (average $5.90), half average $5.76, quarter $6.23. Processing paid by the customer: $0.94 a pound hanging plus a $125 slaughter fee. 84 producers.
- **msu_freezer_2026**: Michigan State University Extension, How to price freezer beef, April 2026. https://www.canr.msu.edu/news/how-to-price-freezer-beef Dressing percentage: beef-type cattle 62% to 64%, grass-fed steers 50% to 60%. Example 1,400 lb steer, 882 lb carcass, $3.80 a pound hanging, breakeven $3.73.
- **uaex_fsa3143_2021**: University of Arkansas Extension FSA3143, Raising Calves for Slaughter, 2021. https://www.uaex.uada.edu/publications/pdf/FSA-3143.pdf Forage-finished calves are often slaughtered near 1,000 lb live. Growing a 500 lb calf to 1,000 lb on forage takes about 367 days at 1.5 lb a day. Dressing 58% to 66%.
- **isu_b1_21_2026**: Iowa State University Extension, Ag Decision Maker B1-21, Livestock Enterprise Budgets for Iowa 2026, June 2026. https://www.extension.iastate.edu/agdm/livestock/pdf/b1-21.pdf A 550 lb steer calf valued at $4.92 a pound, $2,706. Finishing it to 1,350 lb takes nine months, 69 bushels of corn, total cost $3,581.
- **sare_grassfed_2026**: SARE, Enterprise Budgets for Diversified Farms, Case Study 3, Bottom Line Profitability for Grassfed Steers, 2026. https://www.sare.org/publications/enterprise-budgets-for-diversified-farms/case-study-3/ Steers finished at about 24 months. Net return selling locker beef by the half: minus $358 a head; selling boxed cuts: plus $154 a head, with a $30,000 cold storage room.
- **mu_g204_2026**: University of Missouri Extension G204, Evaluating Direct-to-Consumer Marketing Opportunities for Local Beef, January 2026. https://www.extension.missouri.edu/publications/g204 Processing into retail cuts $847 an animal. Half beef priced at $2.78 a pound live, quarter $2.93, live sale $2.38.
- **nebguide_g2364_2024**: University of Nebraska NebGuide G2364, Development of a Direct Marketing Beef Program: Custom vs. Inspected, July 2024. https://extensionpubs.unl.edu/publication/g2364/2024/pdf/view/g2364-2024.pdf Custom-exempt beef must be sold as a live animal before slaughter and is marked not for sale; retail cuts need a USDA-inspected plant and freezers. Small processors book 6 to 24 months out.
- **fsa_rates_2026**: USDA Farm Service Agency, Current FSA Loan Interest Rates, November 1, 2026. https://www.fsa.usda.gov/tools/informational/rates/current-fsa-loan-interest-rates Farm operating, direct and microloan: 5.625%. Farm ownership direct: 6.25%. Down payment loan: 2.25%.
- **fsa_chart_2025**: USDA Farm Service Agency, Farm Loan Information Chart, October 2025. https://www.fsa.usda.gov/sites/default/files/2025-11/FSA_farm_loan_info_chart%20%282%29.pdf Direct operating loan up to $400,000, 1 to 7 years, for livestock and equipment. Operating microloan up to $50,000, rate capped at 5% for beginning and veteran farmers. Farm ownership up to $600,000 over 40 years. A beginning farmer is anyone under ten years in.
- **isu_custom_2026**: Iowa State University Extension, Ag Decision Maker A3-10, 2026 Iowa Farm Custom Rate Survey, March 2026. https://www.extension.iastate.edu/agdm/crops/pdf/a3-10.pdf Large round bales $13.15 each without wrap, $15.75 with. Mowing $15.45 an acre, raking $9.90. Mowing pasture $27.05 an acre, chopping brush $105.55. Hauling cattle by semi $4.70 a loaded mile. Fence building labor $42.70 an hour.
- **unl_custom_2026**: University of Nebraska, 2026 Nebraska Agricultural Custom Rates Report, June 2026. https://cap.unl.edu/sites/unl.edu.ianr.agecon.center-for-ag-profitability/files/media/file/2026-nebraska-custom-rates-report_ada.pdf Baling large round bales with net wrap $17.88 a bale. Building four-strand barbed wire fence, labor only, $1.60 a foot. Mowing pasture $4.60 an acre.
- **nass_cropvalues_2026**: USDA NASS, Crop Values 2025 Summary, February 2026. https://esmis.nal.usda.gov/sites/default/release-files/795791/cpvl0226.pdf All other hay, 2025 marketing year, dollars a ton: US $138, Texas $136, Oklahoma $161, Missouri $125.
- **hud_fmr_2026**: HUD, FY 2026 Fair Market Rents, Texas nonmetropolitan counties, October 2025. https://www.huduser.gov/portal/datasets/fmr.html Fannin County, TX: 2 bedroom $985, 3 bedroom $1,370, 4 bedroom $1,652 a month. Look up any county at huduser.gov.

### Estimates

- **naic_home_2023**: NAIC, Homeowners Insurance Report, data for 2023, Table 4. Average owner-occupied home premium: US $1,731, Texas $2,762, Oklahoma $2,398, Arkansas $1,868, Missouri $1,675, Tennessee $1,644, Kentucky $1,484. A farm or ranch policy adds barns, fence, equipment and liability; no published average for that, so the typical and high here are an estimate above the home figure. Published figure referenced: https://content.naic.org/sites/default/files/publication-hmr-zu-homeowners-report.pdf
- **est_land_spread**: Estimate: price spread. Low is 15% under your price, high 20% over. Land is what the seller takes.
- **est_mobile_used**: Estimate: used mobile home price. No published average for used manufactured homes exists (Census tracks new homes only; new single-section averaged $85,600 in 2025). Clean used single-wides commonly change hands for a quarter to half of that; double-wides more.
- **est_mobile_setup**: Estimate: delivery and setup of a manufactured home. Transport, pad or piers, tie-downs, skirting, steps, utility hookups. No published average; figures are what movers and installers commonly quote.
- **est_well_pump**: Estimate: pump package. NGWA puts a household submersible pump at $3,000 to $3,200 (2021). Pressure tank, wiring, trench and line to the house are added as an estimate.
- **est_well_annual**: Estimate: well upkeep. Pump power plus a fund to replace a $3,000 pump every 10 to 15 years.
- **est_electric_service**: Estimate: meter pole and hookup. Meter pole, meter loop and a 200-amp panel set by an electrician. Co-ops often cover the transformer within their free allowance.
- **est_solar_annual**: Estimate: solar upkeep. A battery fund (a $15,600 battery lasts 10 to 15 years) plus cleaning and an inverter fund.
- **est_fence_upkeep**: Estimate: fence repair. 1% to 4% of what the fence cost, each year, for staples, posts, wire and a stretcher day.
- **est_equip_upkeep**: Estimate: equipment fuel and repairs. 5% to 12% of what the equipment cost, each year, for fuel, oil, tires, batteries and repairs.
- **est_tractor**: Estimate: used tractor. Iowa State 2026 budgets figure a utility tractor at $30,000. A used 40 to 75 hp tractor with a loader, 10 to 20 years old, runs from about $20,000 to $45,000 at dealers and auctions.
- **est_trailer**: Estimate: stock trailer. No published price report. A used 16 ft bumper-pull runs about $8,000, a new one $12,000 to $16,000, a gooseneck $18,000 to $25,000 at dealers.
- **est_truck**: Estimate: used 3/4-ton truck. Edmunds put the average 3-year-old used vehicle at $30,699 in late 2025. Three-quarter-ton trucks hold value and run higher; an older one with miles runs lower.
- **est_horse**: Estimate: using horse. No published average. Sound, broke using horses commonly sell from $2,500 to $10,000 at ranch horse sales.
- **est_pullet**: Estimate: started pullets. Chicks run $6 (Maryland Extension, 2026). Started pullets near laying age cost more because someone fed them for four months.
- **est_egg_value**: Estimate: store value of a dozen eggs. Maryland Extension figures the cost to raise a dozen at $3.37. Store eggs ran $3 to $6 a dozen in 2025.
- **est_surprises**: Estimate: cushion for surprises. 5% to 15% on top of everything. Rock in the trench, a bad culvert, a second load of gravel.
- **est_ag_share**: Estimate: ag valuation share. Where land qualifies for agricultural use valuation, it is taxed on a fraction of market value, commonly a tenth to a quarter. Varies by state and county; ask the appraisal district.
- **est_labor_small**: Estimate: hours per cow for a small herd. Texas A&M budgets 3.72 hours a cow a year on a 200-cow ranch; the NCFMEC cow-lease worksheet uses 5.65. A man with 20 cows and no help spends more per cow; the high figure allows for that.
- **est_calf_crop**: Estimate: calf crop and share of cow income from calves. The Texas A&M 2025 budget sells 0.655 calves per cow after keeping replacement heifers and culls 12% of cows, which implies about 85 calves weaned per 100 cows. Cull cows are about 13% of a cow's yearly income in that budget.
- **est_finish_carry**: Estimate: carrying a weaned calf a year to grass finish. No published budget for grass-finishing a calf on leased pasture. Half the keep-a-cow line covers hay, mineral and vet; grazing is added at the lease rate for 0.7 of a cow's acres.
- **est_handling**: Estimate: handling setup on leased grass. Twenty 12 ft panels at about $140 each (Priefert economy panel, retail), a used or economy squeeze chute ($3,000 to $5,800 at farm stores), a stock tank and mineral feeders. No manufacturer price list is published.
- **est_calf_value_high**: Estimate: top of the weaned calf range. Low is the Texas A&M January 2025 budget (525 lb steer at $295 a cwt, $1,549). Typical is Iowa State June 2026 (550 lb at $4.92, $2,706). High allows a bit over the 2026 price.
- **est_share_high**: Estimate: top of the operator share. Published splits run 60% (owner also supplies grass) to 65.9% (operator supplies grass). An operator who also supplies the bull and hauls to market can argue for 70%.

## Well depth defaults

USGS: half of US house wells are shallower than 142 ft, public supply wells 202 ft. 200 ft is a planning middle. Where a state has ten or more counties with USGS well records, the page uses the median of those county medians as the default depth instead, and says so in the hint under the field.

## Looked for and not found

- A published average price for used manufactured homes (Census, HUD and MHI publish new-home prices only; FHFA medians include land).
- A farm or ranch insurance premium average (USDA ERS, Triple-I, Farm Bureau and extension do not publish one).
- Published state-level typical house well depths (USGS publishes national medians and aquifer grids).
- A published price for a meter pole, service drop and transformer (co-ops bill at cost or cover it in the allowance).
- Used tractor, stock trailer and used 3/4-ton truck price reports by class (auction summaries publish trends, not averages).
- A using-horse purchase price average, a started-pullet price, and a retail fruit tree price in an extension budget.
- A family-of-four unsubsidized marketplace premium (KFF publishes the 40-year-old benchmark; the employer family premium stands in).
