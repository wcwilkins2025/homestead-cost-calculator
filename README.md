# Homestead Cost Calculator

What it costs to leave town and set up a self-sustaining place in the country, and what it costs to keep it running each year. One page, no tracking, every default traced to a public source. Signing in is optional and only needed to save plans.

Live page: https://homesteadcalculator.org/

Companion to the [Land Finder](https://thelandfinder.org/), which ranks every US county for a self-sustaining life. Pick a county there, then come here to see what it costs.

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

## Making it pay

The place is where you live. The **Make it pay** group is how to earn a living from cattle with as little money as possible. Four ways in, each figured per head on leased grass at your lease rate:

| Way in | What you put in | What you clear | Source |
|---|---|---|---|
| Your own cows | a bred cow and a 25th of a bull | calf and cull value, less keeping the cow and the grass | USDA AMS cow prices, ERS cow-calf returns, Texas A&M budget, USDA NASS pasture rent |
| Cows leased on shares | nothing but panels and a chute | about two thirds of the calf money, less keeping the cow and the grass | NCFMEC-06 and Iowa State cow-lease worksheets |
| Caring for someone else's pairs | nothing but panels and a chute | about $1 a head a day for the season; the owner pays the grass at cost | Nebraska livestock custom rates, Kansas Bluestem pasture report |
| Stockers for a season | a light calf, back in the fall | the Texas A&M stocker budget return, with the budget's grazing swapped for your lease | Texas A&M 2025 stocker budgets |

The page shows what the family needs each year two ways (buy the place above, or rent a house and lease the grass), what the lease you entered clears, and for each way in how many head on how many acres cover the gap, the cash to start (cattle, handling setup, and your months in hand), hours a week, and for owned cows the years to grow from half a herd keeping heifers. Selling finished beef by the half or quarter is figured against what the weaned calf would have brought (USDA AMS grass-fed report, Arkansas and Michigan State extension). FSA beginning-farmer loan limits and rates are shown with the yearly payment on a microloan. Extra inputs: `cow_deal` (own, share, custom, stocker), `lease_acres`, `lease_rate`, `graze_apc`, `sell_how` (barn, direct), `work_income`, `rent_monthly`.

## Saved plans

Anyone can use the page without an account. Signing in lets a person keep several named sets of inputs and open them on any device. It has its own Supabase project, separate from the other Homestead Ready tools. Sign-in is a 6-digit code sent by email from Homestead Cost Calculator <signin@homesteadcalculator.org> through Resend. There is no password and no link to click.

- Table `public.calc_plans` (see `supabase/calc_plans.sql`): name, inputs, dates, one row per saved plan. Row rules let a signed-in person see and change only their own rows, and people who are not signed in get nothing. Up to 50 plans each.
- Only the page's own input ids are saved (`plans.js` cleans them on the way in and out).
- "Close my account" on the page deletes the account and every saved plan (`delete_me()` in the same SQL file).
- `config.js` holds the project address and the publishable key, both made to be public. The secret key is never in this repo.

## Deep link

Any input can be set from the URL, so another page can send someone straight to their county with the numbers filled in:

```
https://homesteadcalculator.org/?state=TX&county=Fannin&acres=40&price=5200
```

| Parameter | Meaning |
|---|---|
| `state` | two-letter code |
| `county` | county name, with or without "County" |
| `acres` | acres |
| `price` | price per acre in dollars (otherwise the USDA default for the county or state) |
| `depth` | well depth in feet |
| `lease_acres`, `lease_rate`, `graze_apc`, `cow_deal`, `sell_how`, `work_income`, `rent_monthly` | the Make it pay inputs (see above) |
| any other input id | `house`, `house_sqft`, `well`, `septic`, `power`, `power_distance`, `fence_type`, `fence_shape`, `pastures`, `fence_existing_pct`, `barn_sqft`, `tractor`, `trailer`, `truck`, `utv`, `cows`, `bull`, `horses`, `goats`, `hens`, `garden`, `trees`, `tax_rate`, `ag_exempt`, `town_monthly`, `household_monthly`, `health_monthly`, `runway_months` (checkboxes take 1 or 0) |

The **Copy link** button on the page produces this URL for the current inputs. Only `state` and `county` are required for a prefilled page; everything else falls back to the defaults.

## Files

```
index.html          the page (layout, inputs, chart, summary)
calc.js             the arithmetic and the cost-cutting tips, no page code, shared with the tests
plans.js            saved plans: sign-in and the calc_plans table, plus the input cleaning the tests check
config.js           Supabase project address and publishable key (public by design)
supabase/calc_plans.sql  the saved-plans table and its row rules (run once in the Supabase SQL editor)
data/costs.json     every cost item with low / typical / high and a source id
data/land_values.json   USDA state land values and pasture rents
data/property_tax.json  Tax Foundation effective rates by state
data/counties.json  all 3,144 counties: USDA land value, USGS well depth, Census tax rate
data/bundle.js      the four JSON files joined into one script so the page works from a plain file open
sources.md          every source, with date, link and what was taken from it
scripts/            build_counties.py and bundle_data.py (Python, standard library only)
tests/run_tests.js  checks the arithmetic on a worked example and the saved-plans input cleaning (Node)
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

No build step and no server of our own. The page loads two Google Fonts and supabase-js (for saved plans only).

## Honest limits

These are planning figures. Prices change by county, by year and by who you know. The USDA land values are survey averages of whole farms; small tracts list higher. Extension budgets are for a region and a year. Get three bids on anything over a few thousand dollars, and check with the county before you buy.
