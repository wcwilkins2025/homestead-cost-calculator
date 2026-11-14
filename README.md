# Brotherhood Homestead Cost Calculator

What it costs to leave town and set up a self-sustaining place in the country, and what it costs to keep it running each year. One page, no login, no tracking, every default traced to a public source.

Live page: https://wcwilkins2025.github.io/homestead-cost-calculator/

Companion to the [Brotherhood Land Finder](https://wcwilkins2025.github.io/brotherhood-land-finder/), which ranks every US county for a self-sustaining life. Pick a county there, then come here to see what it costs.

## What it does

You set up the place on paper. The page adds it up three ways: low, typical, high.

- **One-time setup**: land, closing, survey, house, well, septic, power, fence, barn, equipment, animals, garden, orchard, and a cushion for surprises.
- **Each year**: property tax, insurance, keeping the animals, fence and equipment upkeep, well and septic, power, garden, health insurance, household spending.
- **What the place brings in**: calves, goat kids, eggs and garden food you no longer buy.
- **Walking away from town**: cash to have in hand (setup plus months of runway), and how many years until the move pays for itself against what you spend now.
- **Ways to bring it down**: tips figured from your own inputs (buy fenced land, high-tensile fence, house near the road, used mobile home first, ag valuation, half the cows and keep heifers, rent grass, hire out tractor work, put off the barn, fix health insurance), each with what it changes on your numbers. The top three go into the summary text.

Every line shows its range and where the figure came from. A line marked **estimate** has no published source behind it, and the basis is explained. The **Copy summary** button gives plain text to paste into a post.

## Inputs

| Group | Inputs | Default comes from |
|---|---|---|
| The land | state, county, acres, price per acre, property tax rate, ag valuation | USDA county land value (2022 Census of Agriculture) or USDA state farm real estate value (2025); Census county tax rate or Tax Foundation state rate |
| The house | used mobile, new manufactured, barndominium, build, or house already there; square feet | Census Manufactured Housing Survey; builder and extension cost per square foot (see sources.md) |
| Water, sewer, power | well or not, depth; conventional, aerobic or no septic; grid power with distance from the road, solar, or already there | extension and state well cost guides; EPA and state septic ranges; rural electric co-op line extension rates; solar cost benchmarks |
| Fence and barn | fence type, shape of the place, number of pastures, fence already standing, barn square feet | extension fence budgets; pole barn published prices |
| Equipment | used tractor, stock trailer, used truck, side-by-side | published used equipment and vehicle price reports |
| Animals | cows, bull, horses, goats, hens | USDA market reports and extension enterprise budgets |
| Garden and orchard | big garden yes/no, fruit tree count | extension garden and orchard budgets |
| Walking away | what you spend now, what you will spend out there, health insurance per month, months of runway | BLS Consumer Expenditure Survey; KFF marketplace premiums |

Fence length is computed from acres: perimeter = shape factor x 4 x square root of the area (1.0 square, 1.06 for twice as long as wide, 1.25 for a long strip), plus (pastures - 1) x square root of the area for cross fence.

## Deep link

Any input can be set from the URL, so another page can send a man straight to his county with the numbers filled in:

```
https://wcwilkins2025.github.io/homestead-cost-calculator/?state=TX&county=Fannin&acres=40&price=5200
```

| Parameter | Meaning |
|---|---|
| `state` | two-letter code |
| `county` | county name, with or without "County" |
| `acres` | acres |
| `price` | price per acre in dollars (otherwise the USDA default for the county or state) |
| `depth` | well depth in feet |
| any other input id | `house`, `house_sqft`, `well`, `septic`, `power`, `power_distance`, `fence_type`, `fence_shape`, `pastures`, `fence_existing_pct`, `barn_sqft`, `tractor`, `trailer`, `truck`, `utv`, `cows`, `bull`, `horses`, `goats`, `hens`, `garden`, `trees`, `tax_rate`, `ag_exempt`, `town_monthly`, `household_monthly`, `health_monthly`, `runway_months` (checkboxes take 1 or 0) |

The **Copy link** button on the page produces this URL for the current inputs. Only `state` and `county` are required for a prefilled page; everything else falls back to the defaults.

## Files

```
index.html          the page (layout, inputs, chart, summary)
calc.js             the arithmetic and the cost-cutting tips, no page code, shared with the tests
data/costs.json     every cost item with low / typical / high and a source id
data/land_values.json   USDA state land values and pasture rents
data/property_tax.json  Tax Foundation effective rates by state
data/counties.json  all 3,144 counties: USDA land value, USGS well depth, Census tax rate
data/bundle.js      the four JSON files joined into one script so the page works from a plain file open
sources.md          every source, with date, link and what was taken from it
scripts/            build_counties.py and bundle_data.py (Python, standard library only)
tests/run_tests.js  checks the arithmetic on a worked example (Node)
```

After editing any JSON file, run:

```
python scripts/bundle_data.py
node tests/run_tests.js
```

## Running it

Open `index.html` in a browser, or serve the folder with any static server:

```
python -m http.server 8788
```

No build step, no backend, no dependencies beyond two Google Fonts.

## Honest limits

These are planning figures. Prices change by county, by year and by who you know. The USDA land values are survey averages of whole farms; small tracts list higher. Extension budgets are for a region and a year. Get three bids on anything over a few thousand dollars, and check with the county before you buy.
