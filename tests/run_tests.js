/* Checks the arithmetic on one worked example and the shape of the data files.
   Run: node tests/run_tests.js
   Worked example: 40 acres in Fannin County, TX, used mobile home, 300 ft well, 10 cows. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

/* Load bundle.js and calc.js the way the browser does. */
const sandbox = { window: {} };
sandbox.window.window = sandbox.window;
vm.createContext(sandbox);
vm.runInContext(read('data/bundle.js') + '\n' + read('calc.js'), sandbox);
const D = sandbox.window.HC;
const calc = sandbox.window.HCcalc;

let failures = 0;
function check(name, ok, detail) {
  if (ok) { console.log('  ok   ' + name); }
  else { failures++; console.log('  FAIL ' + name + (detail ? ': ' + detail : '')); }
}
function near(a, b, tol) { return Math.abs(a - b) <= (tol || 0.5); }
const money = (n) => '$' + Math.round(n).toLocaleString('en-US');

console.log('1. Bundle matches the JSON files');
for (const [key, fn] of [['costs', 'costs.json'], ['land', 'land_values.json'], ['tax', 'property_tax.json'], ['counties', 'counties.json']]) {
  const j = JSON.parse(read('data/' + fn));
  check(fn + ' is in bundle.js unchanged', JSON.stringify(j) === JSON.stringify(D[key]), 'run python scripts/bundle_data.py');
}

console.log('2. Every cost item is well formed');
const items = D.costs.items, sources = D.costs.sources;
let bad = [];
for (const k of Object.keys(items)) {
  const it = items[k];
  if (!(typeof it.low === 'number' && typeof it.typ === 'number' && typeof it.high === 'number')) bad.push(k + ' missing low/typ/high');
  else if (!(it.low <= it.typ && it.typ <= it.high)) bad.push(k + ' not low <= typ <= high');
  if (!sources[it.source]) bad.push(k + ' source "' + it.source + '" not in sources');
}
check('all ' + Object.keys(items).length + ' items have low <= typ <= high and a known source', bad.length === 0, bad.join('; '));
bad = [];
for (const k of Object.keys(sources)) {
  const s = sources[k];
  if (!s.name || !s.url) bad.push(k + ' missing name or url');
  if (s.estimate && !s.basis) bad.push(k + ' is an estimate with no basis');
}
check('all ' + Object.keys(sources).length + ' sources have a name and url, estimates have a basis', bad.length === 0, bad.join('; '));

console.log('3. County and state lookups');
const tx = D.counties.states.TX;
const fannin = tx.find((r) => r[1] === 'Fannin County');
check('Fannin County, TX is in counties.json', !!fannin);
check('Fannin USDA land value present', fannin && typeof fannin[2] === 'number' && fannin[2] > 0, fannin && fannin[2]);
check('Texas state land value present', D.land.states.TX.farm_real_estate > 0);
check('Texas property tax rate present', D.tax.states.TX > 0);
check('51 states and DC in land_values.state_names', Object.keys(D.land.state_names).length === 51);
check('3,144 counties', Object.values(D.counties.states).reduce((n, a) => n + a.length, 0) === 3144);

console.log('4. Fence geometry');
const f = calc.fenceFeet(40, 1, 2);
check('40 acres square: 1,320 ft a side, 5,280 ft perimeter', f.perimeter === 5280, f.perimeter);
check('2 pastures add 1,320 ft of cross fence', f.cross === 1320, f.cross);
check('total 6,600 ft', f.total === 6600, f.total);
check('10 acres, long strip, 1 pasture: perimeter 1.25 x 4 x 660 = 3,300 ft', calc.fenceFeet(10, 1.25, 1).perimeter === 3300);

console.log('5. Worked example: 40 acres, Fannin County TX, used mobile home, 300 ft well, 10 cows');
const price = Math.round(fannin[2] / 50) * 50;
const inp = {
  state: 'TX', county: 'Fannin County', acres: 40, price_per_acre: price, tax_rate: fannin[4], ag_exempt: true,
  house: 'mobile_used', house_sqft: 1400, existing_house_price: 0,
  well: 'well', well_depth: 300, septic: 'conventional', power: 'grid', power_distance: 300,
  fence_type: 'barbed', fence_shape: '1', pastures: 2, fence_existing_pct: 0, barn_sqft: 1200,
  tractor: true, trailer: true, truck: true, utv: false,
  cows: 10, bull: true, horses: 0, goats: 0, hens: 12, garden: true, trees: 10,
  town_monthly: Math.round(items.household_spending.typ / 12 / 10) * 10,
  household_monthly: Math.round(items.household_spending_rural.typ / 12 / 10) * 10,
  health_monthly: Math.round(items.health_family_monthly.typ / 10) * 10,
  runway_months: 12
};
const r = calc.compute(inp, D);
const line = (list, key) => list.find((l) => l.key === key);

check('land = 40 x ' + money(price) + ' = ' + money(40 * price), near(line(r.setup, 'land').typ, 40 * price));
check('closing = land x ' + items.closing_pct.typ, near(line(r.setup, 'closing').typ, 40 * price * items.closing_pct.typ, 1));
check('well drilling = 300 ft x ' + money(items.well_per_ft.typ) + '/ft', near(line(r.setup, 'well_drill').typ, 300 * items.well_per_ft.typ, 1));
check('well pump package added', !!line(r.setup, 'well_pump'));
check('septic conventional line present', !!line(r.setup, 'septic'));
check('power line = 300 ft x per-foot rate', near(line(r.setup, 'power_line').typ, 300 * items.electric_line_per_ft.typ, 1));
check('fence = 6,600 ft x barbed per-foot rate', near(line(r.setup, 'fence').typ, 6600 * items.fence_barbed_per_ft.typ, 1));
check('barn = 1,200 sq ft x per-sq-ft rate', near(line(r.setup, 'barn').typ, 1200 * items.barn_sqft.typ, 1));
check('10 bred cows = 10 x ' + money(items.cow_bred.typ), near(line(r.setup, 'cows').typ, 10 * items.cow_bred.typ, 1));
check('one bull', near(line(r.setup, 'bull').typ, items.bull.typ, 1));
check('12 pullets', near(line(r.setup, 'hens').typ, 12 * items.pullet.typ, 1));
check('10 fruit trees', near(line(r.setup, 'orchard').typ, 10 * items.fruit_tree.typ, 1));
check('used mobile home line, no sq ft line', !!line(r.setup, 'house') && line(r.setup, 'house').typ === items.house_mobile_used.typ);
check('no horse or goat lines', !line(r.setup, 'horses') && !line(r.setup, 'goats'));

const sumTyp = (list) => list.reduce((n, l) => n + l.typ, 0);
const sumLow = (list) => list.reduce((n, l) => n + l.low, 0);
const sumHigh = (list) => list.reduce((n, l) => n + l.high, 0);
check('setup total = sum of setup lines', near(r.setupTotal.typ, sumTyp(r.setup), 2) && near(r.setupTotal.low, sumLow(r.setup), 2) && near(r.setupTotal.high, sumHigh(r.setup), 2));
const beforeCushion = sumTyp(r.setup) - line(r.setup, 'surprises').typ;
check('surprises = ' + (items.surprises_pct.typ * 100) + '% of everything above it', near(line(r.setup, 'surprises').typ, beforeCushion * items.surprises_pct.typ, 2));
check('low <= typical <= high on setup total', r.setupTotal.low <= r.setupTotal.typ && r.setupTotal.typ <= r.setupTotal.high);
check('group totals add up to setup total', near(calc.groupSetup(r.setup).reduce((n, g) => n + g.typ, 0), r.setupTotal.typ, 2));

check('cows kept = 10 x yearly cost per cow', near(line(r.annual, 'cows_keep').typ, 10 * items.cow_annual.typ, 1));
check('property tax = rate x (land at ag share + structures)', near(line(r.annual, 'tax').typ, (40 * price * items.ag_valuation_share.typ + r.structures.typ) * fannin[4] / 100, 2));
check('health insurance = monthly x 12', near(line(r.annual, 'health').typ, inp.health_monthly * 12, 1));
check('annual total = sum of annual lines', near(r.annualTotal.typ, sumTyp(r.annual), 2));
check('calves and culls = 10 cows x yearly value per cow', near(line(r.income, 'calves').typ, 10 * items.calf_sale.typ, 1));
check('net annual = annual - income', near(r.netAnnual.typ, r.annualTotal.typ - r.incomeTotal.typ, 2));
check('cash needed = setup + 12 months of net annual', near(r.walk.cashNeeded.typ, r.setupTotal.typ + r.netAnnual.typ, 2));
const saving = inp.town_monthly * 12 - r.netAnnual.typ;
check('payback years = setup / yearly saving (or null if no saving)', saving > 0 ? near(r.walk.paybackYears, r.setupTotal.typ / saving, 0.01) : r.walk.paybackYears === null);

check('every line cites a source that exists', r.setup.concat(r.annual, r.income).every((l) => l.source === 'you' || l.source === 'tax' || !!sources[l.source]));

/* Deep-link style override: price=5200 */
const r2 = calc.compute(Object.assign({}, inp, { price_per_acre: 5200 }), D);
check('price=5200 override: land = ' + money(40 * 5200), near(line(r2.setup, 'land').typ, 208000));

/* Ways to bring it down */
const tips = calc.tips(inp, D, r);
const tipOf = (k) => tips.find((t) => t.key === k);
check('tips: every tip has a positive amount, a title and text', tips.length > 0 && tips.every((t) => t.amount > 0 && t.title && t.text));
check('tips: fenced land saves the whole fence line', tipOf('fence_standing') && near(tipOf('fence_standing').amount, line(r.setup, 'fence').typ, 1));
check('tips: high-tensile saves 6,600 ft x (barbed - high-tensile)', tipOf('hightensile') && near(tipOf('hightensile').amount, 6600 * (items.fence_barbed_per_ft.typ - items.fence_hightensile_per_ft.typ), 2));
check('tips: house near the road saves (300 - 100) ft of line', tipOf('power_close') && near(tipOf('power_close').amount, 200 * items.electric_line_per_ft.typ, 1));
check('tips: putting off the barn saves the barn line', tipOf('skip_barn') && near(tipOf('skip_barn').amount, line(r.setup, 'barn').typ, 1));
check('tips: half the cows saves 5 x bred cow price', tipOf('fewer_cows') && near(tipOf('fewer_cows').amount, 5 * items.cow_bred.typ, 1));
check('tips: health insurance saving = (family - single) x 12, per year', tipOf('health') && tipOf('health').perYear && near(tipOf('health').amount, (inp.health_monthly - items.health_family_monthly.low) * 12, 1));
check('tips: no ag tip when the ag box is checked, no used-mobile tip when already a used mobile', !tipOf('ag_valuation') && !tipOf('used_mobile'));
const rank = (t) => (t.perYear ? t.amount * 5 : t.amount);
check('tips: ranked biggest first (yearly counted as five years)', tips.every((t, i) => i === 0 || rank(tips[i - 1]) >= rank(t)));
const r3in = Object.assign({}, inp, { ag_exempt: false, house: 'mobile_new' });
const r3 = calc.compute(r3in, D);
const t3 = calc.tips(r3in, D, r3);
const ag = t3.find((t) => t.key === 'ag_valuation');
check('tips: ag valuation saves rate x land x (1 - ag share) per year when the box is off', ag && ag.perYear && near(ag.amount, 40 * price * (1 - items.ag_valuation_share.typ) * fannin[4] / 100, 2));
const um = t3.find((t) => t.key === 'used_mobile');
check('tips: used mobile instead of new saves the price difference', um && near(um.amount, (items.house_mobile_new.typ + items.mobile_setup.typ) - (items.house_mobile_used.typ + items.mobile_setup.typ), 2));

console.log('\nWorked example, typical figures:');
console.log('  Setup total      ' + money(r.setupTotal.typ) + '  (' + money(r.setupTotal.low) + ' to ' + money(r.setupTotal.high) + ')');
for (const g of calc.groupSetup(r.setup)) console.log('    ' + g.label.padEnd(22) + money(g.typ).padStart(10));
console.log('  Yearly total     ' + money(r.annualTotal.typ));
for (const l of r.annual) console.log('    ' + l.label.padEnd(22) + money(l.typ).padStart(10));
console.log('  Brings in        ' + money(r.incomeTotal.typ));
console.log('  Yearly, net      ' + money(r.netAnnual.typ) + '  (' + money(r.netAnnual.low) + ' to ' + money(r.netAnnual.high) + ')');
console.log('  Cash in hand     ' + money(r.walk.cashNeeded.typ));
console.log('  Payback          ' + (r.walk.paybackYears == null ? 'never on these numbers' : r.walk.paybackYears.toFixed(1) + ' years'));

console.log(failures ? '\n' + failures + ' check(s) FAILED' : '\nAll checks passed');
process.exit(failures ? 1 : 0);
