/* Saved plans: sign in by email link (shared with Groundwork) and keep several named sets of inputs.
   The pure helpers (cleanName, cleanInputs, suggestName, findByName) are checked by tests/run_tests.js.
   The store needs supabase-js and window.HC_SUPA; without them the page works as before, signed out. */
(function (root) {
  'use strict';
  var MAX_NAME = 80, MAX_VALUE = 60, TABLE = 'calc_plans';

  function cleanName(s) {
    return String(s == null ? '' : s).replace(/\s+/g, ' ').trim().slice(0, MAX_NAME);
  }
  /* keep only the page's own input ids; checkboxes as true/false, everything else as short text */
  function cleanInputs(inp, ids, checks) {
    var out = {};
    ids.forEach(function (id) {
      if (!inp || !Object.prototype.hasOwnProperty.call(inp, id)) return;
      var v = inp[id];
      if (checks.indexOf(id) >= 0) out[id] = v === true || v === 'true' || v === 1 || v === '1';
      else if (v !== null && v !== undefined) out[id] = String(v).slice(0, MAX_VALUE);
    });
    return out;
  }
  function suggestName(inp) {
    var acres = inp && inp.acres ? inp.acres + ' acres' : '';
    var county = inp && inp.county ? String(inp.county).replace(/ County$/, '') + ' County' : '';
    var parts = [acres, county, inp && inp.state ? inp.state : ''].filter(Boolean);
    return cleanName(parts.length ? parts.join(', ') : 'My plan');
  }
  function findByName(list, name) {
    var n = cleanName(name).toLowerCase();
    for (var i = 0; i < (list || []).length; i++) if (cleanName(list[i].name).toLowerCase() === n) return list[i];
    return null;
  }

  function makeStore() {
    if (!root.supabase || !root.HC_SUPA) return null;
    var c = root.supabase.createClient(root.HC_SUPA.url, root.HC_SUPA.key, {
      /* implicit, not pkce: the sign-in rides in the link, so it works when the email opens in another browser */
      auth: { persistSession: true, detectSessionInUrl: true, flowType: 'implicit' }
    });
    function must(r) { if (r.error) throw r.error; return r.data; }
    function user() { return c.auth.getSession().then(function (r) { return r.data.session ? r.data.session.user : null; }); }
    return {
      user: user,
      onChange: function (cb) { c.auth.onAuthStateChange(function (_e, s) { cb(s ? s.user : null); }); },
      signIn: function (email, back) { return c.auth.signInWithOtp({ email: email, options: { emailRedirectTo: back } }).then(must); },
      signOut: function () { return c.auth.signOut(); },
      list: function () { return c.from(TABLE).select('id, name, inputs, updated_at').order('updated_at', { ascending: false }).then(must); },
      add: function (name, inputs) { return c.from(TABLE).insert({ name: cleanName(name), inputs: inputs }).select('id').then(must); },
      update: function (id, fields) { return c.from(TABLE).update(fields).eq('id', id).then(must); },
      remove: function (id) { return c.from(TABLE).delete().eq('id', id).then(must); }
    };
  }

  root.HCplans = { cleanName: cleanName, cleanInputs: cleanInputs, suggestName: suggestName, findByName: findByName, makeStore: makeStore, MAX_NAME: MAX_NAME };
})(typeof window !== 'undefined' ? window : globalThis);
