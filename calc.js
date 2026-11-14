/* Homestead Cost Calculator: the arithmetic.
   Plain functions, no DOM. index.html and tests/run_tests.js both load this file.
   Every cost item comes from data/costs.json (bundled into data/bundle.js) with low / typ / high
   and a source id. Nothing here invents a number; it only multiplies and adds. */
(function (root) {
  'use strict';

  var SQFT_PER_ACRE = 43560;

  function range3(low, typ, high) { return { low: low, typ: typ, high: high }; }
  function scale(item, qty) { return range3(item.low * qty, item.typ * qty, item.high * qty); }
  function addr(a, b) { return range3(a.low + b.low, a.typ + b.typ, a.high + b.high); }
  var ZERO = range3(0, 0, 0);

  /* Fence length from acres. perimeter = shape x 4 x sqrt(area).
     shape 1.0 = square, 1.06 = 2:1 rectangle, 1.25 = 4:1 strip.
     Cross fence: splitting the place into N pastures adds about (N - 1) x sqrt(area) of fence. */
  function fenceFeet(acres, shape, pastures) {
    var side = Math.sqrt(Math.max(acres, 0) * SQFT_PER_ACRE);
    var perimeter = shape * 4 * side;
    var cross = Math.max(0, (pastures || 1) - 1) * side;
    return { perimeter: Math.round(perimeter), cross: Math.round(cross), total: Math.round(perimeter + cross) };
  }

  /* inputs: see DEFAULTS in index.html. data: window.HC (costs, land, tax, counties). */
  function compute(inp, data) {
    var C = data.costs.items;
    var setup = [];
    var annual = [];
    var income = [];

    function line(list, key, label, r, src, note, qtyText) {
      if (!r) return;
      list.push({ key: key, label: label, low: Math.round(r.low), typ: Math.round(r.typ), high: Math.round(r.high),
        source: src, note: note || '', qty: qtyText || '' });
    }
    function item(k) {
      var it = C[k];
      if (!it) throw new Error('missing cost item ' + k);
      return it;
    }
    function src(k) { return item(k).source; }

    var acres = Math.max(0, +inp.acres || 0);
    var price = Math.max(0, +inp.price_per_acre || 0);

    /* ---------- One-time: the land ---------- */
    var landTotal = acres * price;
    var landSpread = item('land_spread');
    line(setup, 'land', 'Land', range3(landTotal * landSpread.low, landTotal, landTotal * landSpread.high),
      src('land_spread'), 'Your price times your acres. Low and high show a spread around it.', acres + ' ac x $' + fmt(price) + '/ac');
    var closing = item('closing_pct');
    line(setup, 'closing', 'Closing costs', range3(landTotal * closing.low, landTotal * closing.typ, landTotal * closing.high), src('closing_pct'),
      'Title, recording, lender fees. A share of the land price.');
    line(setup, 'survey', 'Survey', item('survey'), src('survey'), 'Boundary survey so you know what you are buying.');

    /* ---------- One-time: the house ---------- */
    var house = inp.house || 'mobile_used';
    var sqft = Math.max(0, +inp.house_sqft || 0);
    if (house === 'existing') {
      var hv = Math.max(0, +inp.existing_house_price || 0);
      line(setup, 'house', 'House already on the land', range3(hv, hv, hv), 'you', 'Whatever the house adds to the asking price. Enter it above.');
    } else if (house === 'build') {
      line(setup, 'house', 'Build a house', scale(item('house_build_sqft'), sqft), src('house_build_sqft'), 'Site-built, per square foot, not counting the land.', sqft + ' sq ft');
    } else if (house === 'barndo') {
      line(setup, 'house', 'Barndominium', scale(item('house_barndo_sqft'), sqft), src('house_barndo_sqft'), 'Steel shell finished out as a home, per square foot.', sqft + ' sq ft');
    } else if (house === 'mobile_new') {
      line(setup, 'house', 'New manufactured home', item('house_mobile_new'), src('house_mobile_new'), 'Double-wide, factory price before delivery and setup.');
      line(setup, 'house_setup', 'Delivery, pad, tie-downs, skirting', item('mobile_setup'), src('mobile_setup'));
    } else {
      line(setup, 'house', 'Used mobile home', item('house_mobile_used'), src('house_mobile_used'), 'A clean used single or double-wide, bought and moved.');
      line(setup, 'house_setup', 'Delivery, pad, tie-downs, skirting', item('mobile_setup'), src('mobile_setup'));
    }

    /* ---------- One-time: water, sewer, power ---------- */
    var wellFt = Math.max(0, +inp.well_depth || 0);
    if (inp.well !== 'none' && wellFt > 0) {
      line(setup, 'well_drill', 'Well drilling and casing', scale(item('well_per_ft'), wellFt), src('well_per_ft'), 'Per foot of depth.', wellFt + ' ft');
      line(setup, 'well_pump', 'Pump, pressure tank, wiring, trench', item('well_pump_package'), src('well_pump_package'));
    }
    if (inp.septic === 'aerobic') {
      line(setup, 'septic', 'Septic, aerobic system', item('septic_aerobic'), src('septic_aerobic'), 'Needed where the soil will not take a regular system.');
    } else if (inp.septic !== 'none') {
      line(setup, 'septic', 'Septic, conventional', item('septic_conventional'), src('septic_conventional'), 'Tank and drain field.');
    }
    if (inp.power === 'solar') {
      line(setup, 'power', 'Off-grid solar with batteries', item('solar_offgrid'), src('solar_offgrid'), 'Panels, batteries, inverter, installed. Sized for a modest house.');
    } else if (inp.power !== 'none') {
      var lineFt = Math.max(0, +inp.power_distance || 0);
      line(setup, 'power_line', 'Power line to the house', scale(item('electric_line_per_ft'), lineFt), src('electric_line_per_ft'), 'Per foot from the road to the meter. Co-ops often give the first few hundred feet free.', lineFt + ' ft');
      line(setup, 'power_drop', 'Meter pole and service hookup', item('electric_service'), src('electric_service'));
    }

    /* ---------- One-time: fence and buildings ---------- */
    var f = fenceFeet(acres, +inp.fence_shape || 1, +inp.pastures || 1);
    var fenceKey = inp.fence_type === 'woven' ? 'fence_woven_per_ft' : inp.fence_type === 'hightensile' ? 'fence_hightensile_per_ft' : 'fence_barbed_per_ft';
    var existingPct = Math.min(100, Math.max(0, +inp.fence_existing_pct || 0)) / 100;
    var newFenceFt = Math.round(f.total * (1 - existingPct));
    if (newFenceFt > 0) {
      line(setup, 'fence', 'Fence, built', scale(item(fenceKey), newFenceFt), src(fenceKey),
        'Perimeter ' + fmt(f.perimeter) + ' ft plus ' + fmt(f.cross) + ' ft of cross fence' + (existingPct ? ', less what is already standing' : '') + '.', fmt(newFenceFt) + ' ft');
    }
    var barnSqft = Math.max(0, +inp.barn_sqft || 0);
    if (barnSqft > 0) {
      line(setup, 'barn', 'Barn or shop', scale(item('barn_sqft'), barnSqft), src('barn_sqft'), 'Pole barn, built, with slab, per square foot.', barnSqft + ' sq ft');
    }

    /* ---------- One-time: equipment ---------- */
    if (inp.tractor) line(setup, 'tractor', 'Used tractor with loader', item('tractor_used'), src('tractor_used'), '40 to 75 hp, 10 to 20 years old.');
    if (inp.trailer) line(setup, 'trailer', 'Stock trailer', item('trailer_stock'), src('trailer_stock'), 'Bumper-pull or gooseneck, used to new.');
    if (inp.truck) line(setup, 'truck', 'Used 3/4-ton truck', item('truck_used'), src('truck_used'), 'Something that will pull the trailer.');
    if (inp.utv) line(setup, 'utv', 'Side-by-side', item('utv'), src('utv'));

    /* ---------- One-time: animals ---------- */
    var cows = Math.max(0, +inp.cows || 0), horses = Math.max(0, +inp.horses || 0),
        goats = Math.max(0, +inp.goats || 0), hens = Math.max(0, +inp.hens || 0);
    if (cows > 0) {
      line(setup, 'cows', 'Bred cows', scale(item('cow_bred'), cows), src('cow_bred'), '', cows + ' head');
      if (inp.bull && cows >= 1) line(setup, 'bull', 'Bull', item('bull'), src('bull'), 'One bull covers up to 25 cows.');
    }
    if (horses > 0) line(setup, 'horses', 'Horses', scale(item('horse'), horses), src('horse'), 'Sound, broke using horses.', horses + ' head');
    if (goats > 0) {
      line(setup, 'goats', 'Goat does', scale(item('goat_doe'), goats), src('goat_doe'), '', goats + ' head');
      line(setup, 'goat_buck', 'Buck', item('goat_buck'), src('goat_buck'));
    }
    if (hens > 0) {
      line(setup, 'hens', 'Pullets', scale(item('pullet'), hens), src('pullet'), 'Young hens about to lay.', hens + ' birds');
      line(setup, 'coop', 'Coop and run', item('coop'), src('coop'));
    }

    /* ---------- One-time: garden and orchard ---------- */
    if (inp.garden) line(setup, 'garden', 'Garden, first year', item('garden_startup'), src('garden_startup'), 'Fence, soil, drip line, tools for a big garden.');
    var trees = Math.max(0, +inp.trees || 0);
    if (trees > 0) line(setup, 'orchard', 'Fruit trees, planted', scale(item('fruit_tree'), trees), src('fruit_tree'), 'Trees, stakes, guards. Fruit in 3 to 5 years.', trees + ' trees');

    /* ---------- One-time: cushion ---------- */
    var sub = sum(setup);
    var cushion = item('surprises_pct');
    line(setup, 'surprises', 'Surprises', range3(sub.low * cushion.low, sub.typ * cushion.typ, sub.high * cushion.high), src('surprises_pct'),
      'Rock in the trench, a bad culvert, a second load of gravel. Everybody hits some.');

    /* ---------- Every year ---------- */
    var taxRate = (+inp.tax_rate || 0) / 100;
    var structures = valueOfStructures(setup);
    var landAssessed = landTotal * (inp.ag_exempt ? item('ag_valuation_share').typ : 1);
    var taxBase = landAssessed + structures.typ;
    line(annual, 'tax', 'Property tax', range3(taxBase * taxRate * 0.8, taxBase * taxRate, taxBase * taxRate * 1.2), 'tax',
      inp.ag_exempt ? 'Land at ag valuation plus the house and buildings at full value.' : 'Land and buildings at full value. Ask about an ag exemption.',
      (taxRate * 100).toFixed(2) + '% on $' + fmt(Math.round(taxBase)));
    line(annual, 'insurance', 'Insurance', item('insurance_annual'), src('insurance_annual'), 'House, buildings, liability.');
    if (cows > 0) line(annual, 'cows_keep', 'Keeping cows', scale(item('cow_annual'), cows), src('cow_annual'), 'Hay, mineral, vet, fly control, hauling, per cow per year.', cows + ' head');
    if (horses > 0) line(annual, 'horses_keep', 'Keeping horses', scale(item('horse_annual'), horses), src('horse_annual'), 'Hay, feed, farrier, vet, per horse per year.', horses + ' head');
    if (goats > 0) line(annual, 'goats_keep', 'Keeping goats', scale(item('goat_annual'), goats), src('goat_annual'), 'Feed, hay, wormer, fence repair, per doe per year.', goats + ' head');
    if (hens > 0) line(annual, 'hens_keep', 'Keeping hens', scale(item('hen_annual'), hens), src('hen_annual'), 'Feed and bedding per bird per year.', hens + ' birds');
    var fenceVal = pick(setup, 'fence');
    if (fenceVal) line(annual, 'fence_upkeep', 'Fence repair', range3(fenceVal.low * item('fence_upkeep_pct').low, fenceVal.typ * item('fence_upkeep_pct').typ, fenceVal.high * item('fence_upkeep_pct').high), src('fence_upkeep_pct'), 'A share of what the fence cost, every year.');
    var equipVal = addAll(setup, ['tractor', 'trailer', 'truck', 'utv']);
    if (equipVal.typ > 0) line(annual, 'equip_upkeep', 'Equipment repairs and fuel', range3(equipVal.low * item('equipment_upkeep_pct').low, equipVal.typ * item('equipment_upkeep_pct').typ, equipVal.high * item('equipment_upkeep_pct').high), src('equipment_upkeep_pct'), 'A share of what the equipment cost, every year.');
    if (inp.septic !== 'none') line(annual, 'septic_pump', 'Septic pumping and upkeep', item('septic_annual'), src('septic_annual'), 'Pumped every 3 to 5 years, spread per year. Aerobic systems also need a service contract.');
    if (inp.well !== 'none' && wellFt > 0) line(annual, 'well_upkeep', 'Well upkeep', item('well_annual'), src('well_annual'), 'Pump power and a repair fund.');
    if (inp.power === 'solar') line(annual, 'solar_upkeep', 'Solar upkeep', item('solar_annual'), src('solar_annual'), 'Battery fund and cleaning.');
    else if (inp.power !== 'none') line(annual, 'electric_bill', 'Electric bill', item('electric_bill_annual'), src('electric_bill_annual'), 'Average rural home.');
    if (inp.garden) line(annual, 'garden_keep', 'Garden seed and supplies', item('garden_annual'), src('garden_annual'));
    var hi = Math.max(0, +inp.health_monthly || 0);
    if (hi > 0) line(annual, 'health', 'Health insurance', range3(hi * 12, hi * 12, hi * 12), 'you', 'Your monthly figure times 12.', '$' + fmt(hi) + '/mo');
    var hh = Math.max(0, +inp.household_monthly || 0);
    if (hh > 0) line(annual, 'household', 'Household spending', range3(hh * 12 * 0.9, hh * 12, hh * 12 * 1.1), 'you', 'Groceries, fuel, phone, clothes, everything else. Your figure times 12.', '$' + fmt(hh) + '/mo');

    /* ---------- What the place brings in ---------- */
    if (cows > 0) line(income, 'calves', 'Calves and culls sold', scale(item('calf_sale'), cows), src('calf_sale'), 'What a cow brings in each year on average: her calf at weaning, and her own sale when she is culled.', cows + ' cows');
    if (goats > 0) line(income, 'kids', 'Goat kids sold', scale(item('kid_sale'), goats), src('kid_sale'), 'Kids and cull does sold, per doe per year.', goats + ' does');
    if (hens > 0) {
      var dozens = hens * item('eggs_dozen_per_hen').typ;
      line(income, 'eggs', 'Eggs not bought', scale(item('egg_dozen_value'), dozens), src('egg_dozen_value'), 'Store value of what the hens lay.', Math.round(dozens) + ' dozen');
    }
    if (inp.garden) line(income, 'garden_food', 'Groceries not bought', item('garden_food_value'), src('garden_food_value'), 'What a big garden replaces at the store.');

    var setupTotal = sum(setup);
    var annualTotal = sum(annual);
    var incomeTotal = sum(income);
    var netAnnual = range3(annualTotal.low - incomeTotal.high, annualTotal.typ - incomeTotal.typ, annualTotal.high - incomeTotal.low);

    /* ---------- Walking away from town ---------- */
    var townYear = (+inp.town_monthly || 0) * 12;
    var runwayMonths = Math.max(0, +inp.runway_months || 0);
    var runwayCash = range3(netAnnual.low / 12 * runwayMonths, netAnnual.typ / 12 * runwayMonths, netAnnual.high / 12 * runwayMonths);
    var cashNeeded = addr(setupTotal, runwayCash);
    /* Payback: what you save each year living there vs in town, against what you spent to set up. */
    var saving = townYear - netAnnual.typ;
    var payback = saving > 0 ? setupTotal.typ / saving : null;

    return {
      setup: setup, annual: annual, income: income,
      setupTotal: rnd(setupTotal), annualTotal: rnd(annualTotal), incomeTotal: rnd(incomeTotal), netAnnual: rnd(netAnnual),
      fence: f, structures: structures, taxBase: Math.round(taxBase),
      walk: { townYear: townYear, runwayMonths: runwayMonths, runwayCash: rnd(runwayCash), cashNeeded: rnd(cashNeeded), savingPerYear: Math.round(saving), paybackYears: payback }
    };
  }

  function valueOfStructures(setup) {
    return addAll(setup, ['house', 'house_setup', 'barn', 'well_drill', 'well_pump', 'septic', 'power_line', 'power_drop', 'power']);
  }
  function pick(list, key) { for (var i = 0; i < list.length; i++) if (list[i].key === key) return list[i]; return null; }
  function addAll(list, keys) {
    var r = ZERO;
    for (var i = 0; i < list.length; i++) if (keys.indexOf(list[i].key) >= 0) r = addr(r, list[i]);
    return r;
  }
  function sum(list) { var r = ZERO; for (var i = 0; i < list.length; i++) r = addr(r, list[i]); return r; }
  function rnd(r) { return range3(Math.round(r.low), Math.round(r.typ), Math.round(r.high)); }
  function fmt(n) { n = Math.round(n); return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  /* Group the setup lines for the chart. */
  var GROUPS = [
    ['Land and closing', ['land', 'closing', 'survey']],
    ['House', ['house', 'house_setup']],
    ['Water, sewer, power', ['well_drill', 'well_pump', 'septic', 'power_line', 'power_drop', 'power']],
    ['Fence and barn', ['fence', 'barn']],
    ['Equipment', ['tractor', 'trailer', 'truck', 'utv']],
    ['Animals', ['cows', 'bull', 'horses', 'goats', 'goat_buck', 'hens', 'coop']],
    ['Garden and orchard', ['garden', 'orchard']],
    ['Surprises', ['surprises']]
  ];
  function groupSetup(setup) {
    var out = [];
    for (var i = 0; i < GROUPS.length; i++) {
      var r = addAll(setup, GROUPS[i][1]);
      if (r.typ > 0) out.push({ label: GROUPS[i][0], low: Math.round(r.low), typ: Math.round(r.typ), high: Math.round(r.high) });
    }
    return out;
  }

  /* Ways to bring the cost down. Each tip is figured from the man's own inputs and the same cost
     items as the lines above, so the amount shown is what changes on his numbers, not a slogan.
     amount is one-time dollars unless perYear is true. Only tips that apply are returned, biggest first. */
  function tips(inp, data, r) {
    var C = data.costs.items;
    var out = [];
    function it(k) { if (!C[k]) throw new Error('missing cost item ' + k); return C[k]; }
    function L(key) { return pick(r.setup, key) || pick(r.annual, key); }
    function val(key) { var l = L(key); return l ? l.typ : 0; }
    function tip(key, amount, perYear, title, text, source) {
      if (!(amount > 0)) return;
      out.push({ key: key, amount: Math.round(amount), perYear: !!perYear, title: title, text: text, source: source || '' });
    }
    var acres = Math.max(0, +inp.acres || 0), price = Math.max(0, +inp.price_per_acre || 0);
    var landTotal = acres * price;
    var taxRate = (+inp.tax_rate || 0) / 100;
    var cows = Math.max(0, +inp.cows || 0), horses = Math.max(0, +inp.horses || 0);

    /* Fence */
    var fenceLine = L('fence');
    if (fenceLine) {
      tip('fence_standing', fenceLine.typ, false, 'Buy land that is already fenced',
        'Fence is $' + fmt(fenceLine.typ) + ' here. A standing fence in fair shape saves most of it. Walk every foot before you buy, and set the "fence already standing" slider to what you find.');
      var fenceKey = inp.fence_type === 'woven' ? 'fence_woven_per_ft' : inp.fence_type === 'hightensile' ? 'fence_hightensile_per_ft' : 'fence_barbed_per_ft';
      var newFt = fenceLine.typ / it(fenceKey).typ;
      if (fenceKey !== 'fence_hightensile_per_ft') {
        tip('hightensile', newFt * (it(fenceKey).typ - it('fence_hightensile_per_ft').typ), false, 'Use high-tensile electric fence',
          'About $' + it('fence_hightensile_per_ft').typ.toFixed(2) + ' a foot built against $' + it(fenceKey).typ.toFixed(2) + ' for what you picked. Cattle respect it once they learn it. Not for goats.', it('fence_hightensile_per_ft').source);
      }
      var pastures = Math.max(1, +inp.pastures || 1);
      if (pastures > 2) {
        var side = Math.sqrt(acres * SQFT_PER_ACRE);
        var existingPct = Math.min(100, Math.max(0, +inp.fence_existing_pct || 0)) / 100;
        tip('pastures', (pastures - 2) * side * (1 - existingPct) * it(fenceKey).typ, false, 'Start with two pastures, not ' + pastures,
          'Fence the outside and one cross fence. Add the rest after a year of watching where the cattle graze and where the water is.');
      }
    }

    /* Power */
    if (inp.power === 'grid') {
      var dist = Math.max(0, +inp.power_distance || 0);
      if (dist > 100) {
        tip('power_close', (dist - 100) * it('electric_line_per_ft').typ, false, 'Set the house near the road',
          'Line runs about $' + fmt(it('electric_line_per_ft').typ) + ' a foot. Many co-ops give the first few hundred feet free, so ask the co-op before you pick the house site.', it('electric_line_per_ft').source);
      }
      var gridCost = val('power_line') + val('power_drop');
      if (gridCost > it('solar_offgrid').typ) {
        tip('solar_instead', gridCost - it('solar_offgrid').typ, false, 'Go solar instead of running the line',
          'At ' + fmt(dist) + ' ft the line costs more than an off-grid solar system with batteries. Get a bid on both.', it('solar_offgrid').source);
      }
    }

    /* Septic */
    if (inp.septic === 'aerobic') {
      tip('soil_test', it('septic_aerobic').typ - it('septic_conventional').typ, false, 'Get a soil test before you buy',
        'An aerobic system is forced on you by soil that will not drain. A conventional tank and field is the difference shown, plus no yearly service contract.', it('septic_conventional').source);
    }

    /* House */
    var houseNow = val('house') + val('house_setup');
    var usedMobile = it('house_mobile_used').typ + it('mobile_setup').typ;
    if (inp.house !== 'existing' && inp.house !== 'mobile_used' && houseNow > usedMobile) {
      tip('used_mobile', houseNow - usedMobile, false, 'Live in a used mobile home first',
        'Set it up for about $' + fmt(usedMobile) + ' and live in it while you build. Later it is the guest house, a place for the hired hand, or sold.', it('house_mobile_used').source);
    }
    var improvements = houseNow + val('well_drill') + val('well_pump') + val('septic') + val('power_line') + val('power_drop') + val('power');
    if (inp.house !== 'existing' && improvements > 0) {
      tip('buy_improved', improvements, false, 'Buy a place with the house, well and septic already there',
        'That is $' + fmt(improvements) + ' of new work on these numbers. You pay for them in the asking price, but used improvements rarely bring what new ones cost, and you skip months of waiting on contractors. Have the well and septic inspected.');
    }

    /* Tax */
    if (!inp.ag_exempt && landTotal > 0 && taxRate > 0) {
      tip('ag_valuation', landTotal * (1 - it('ag_valuation_share').typ) * taxRate, true, 'File for ag valuation the day you close',
        'Land running cattle or hay is taxed on what it produces, not what it sells for, in most states. Ask the county appraisal district what it takes to qualify. Check the ag box above to see it on your numbers.', it('ag_valuation_share').source);
    }

    /* Animals */
    if (cows >= 4) {
      var half = Math.floor(cows / 2);
      tip('fewer_cows', half * it('cow_bred').typ, false, 'Start with half the cows and keep your heifers',
        'A bred cow is about $' + fmt(it('cow_bred').typ) + ' right now. Buy ' + (cows - half) + ' instead of ' + cows + ', keep the heifer calves, and the herd is full in about three years, paid for by calf checks.', it('cow_bred').source);
    }
    if (horses > 0) {
      tip('horses', val('horses_keep'), true, 'Skip the horses unless you will work them',
        'Horses cost this much a year and bring in nothing. If you only ride on Sundays, a neighbor with horses is cheaper.', it('horse_annual').source);
    }
    var land = data.land.states[inp.state];
    if (land && land.pasture_rent > 0 && price > 0 && acres >= 20) {
      var tenAcresBuy = 10 * price * (1 + it('closing_pct').typ);
      tip('rent_grass', tenAcresBuy, false, 'Rent grass instead of buying more acres',
        'Pasture rents for about $' + land.pasture_rent.toFixed(2) + ' an acre a year in your state. Buying runs $' + fmt(price) + ' an acre. Every 10 acres you rent from a neighbor instead of buying saves this much up front and costs about $' + fmt(10 * land.pasture_rent) + ' a year.', 'USDA NASS cash rents');
    }

    /* Equipment and buildings */
    if (inp.tractor) {
      tip('hire_tractor', val('tractor'), false, 'Hire out the tractor work the first year',
        'Pay a neighbor to shred, disc and bale. Buy a tractor when you know what size you need, and skip about $' + fmt(it('tractor_used').typ * it('equipment_upkeep_pct').typ) + ' a year of repairs and fuel meanwhile.', it('tractor_used').source);
    }
    if (val('barn') > 0) {
      tip('skip_barn', val('barn'), false, 'Put off the barn',
        'Cattle do fine with shade and a windbreak. A used carport covers the equipment. Build the barn in year three, when you know where it should sit.', it('barn_sqft').source);
    }
    if (inp.utv) {
      tip('skip_utv', val('utv'), false, 'Skip the side-by-side', 'The truck and your feet cover 40 acres. Buy one used later if you still want it.', it('utv').source);
    }

    /* Health insurance */
    var hi = Math.max(0, +inp.health_monthly || 0);
    var single = it('health_family_monthly').low;
    if (hi > single) {
      tip('health', (hi - single) * 12, true, 'Fix the health insurance before you quit',
        'The default is the full family premium an employer pays, about what COBRA costs. One man on the marketplace runs about $' + fmt(single) + ' a month before any subsidy, and a lower income out there often qualifies for one. Or keep a job with benefits part time, or get on a spouse plan.', it('health_family_monthly').source);
    }

    /* Rank yearly savings as five years' worth so a big yearly saving is not buried under one-time items. */
    function rank(t) { return t.perYear ? t.amount * 5 : t.amount; }
    out.sort(function (a, b) { return rank(b) - rank(a); });
    return out;
  }

  root.HCcalc = { compute: compute, tips: tips, fenceFeet: fenceFeet, groupSetup: groupSetup, fmt: fmt, GROUPS: GROUPS };
})(typeof window !== 'undefined' ? window : globalThis);
