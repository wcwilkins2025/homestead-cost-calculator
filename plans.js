/* Saved plans: sign in with a 6-digit code from email (no password) and keep several named sets of inputs.
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
      /* the email carries only a 6-digit code, no link, so nothing has to open in the right browser */
      auth: { persistSession: true, detectSessionInUrl: false }
    });
    function must(r) { if (r.error) throw r.error; return r.data; }
    function user() { return c.auth.getSession().then(function (r) { return r.data.session ? r.data.session.user : null; }); }
    return {
      user: user,
      onChange: function (cb) { c.auth.onAuthStateChange(function (_e, s) { cb(s ? s.user : null); }); },
      sendCode: function (email) { return c.auth.signInWithOtp({ email: String(email).trim() }).then(must); },
      /* type 'email' covers both a new account and a returning one */
      verifyCode: function (email, code) {
        return c.auth.verifyOtp({ email: String(email).trim(), token: String(code).replace(/\D/g, ''), type: 'email' }).then(function (r) {
          if (r.error) throw r.error;
          if (!r.data || !r.data.session) throw new Error('no session');
          return r.data.session.user;
        });
      },
      signOut: function () { return c.auth.signOut(); },
      list: function () { return c.from(TABLE).select('id, name, inputs, updated_at').order('updated_at', { ascending: false }).then(must); },
      add: function (name, inputs) { return c.from(TABLE).insert({ name: cleanName(name), inputs: inputs }).select('id').then(must); },
      update: function (id, fields) { return c.from(TABLE).update(fields).eq('id', id).then(must); },
      remove: function (id) { return c.from(TABLE).delete().eq('id', id).then(must); },
      /* closes the account; the plans go with it (on delete cascade) */
      deleteMe: function () { return c.rpc('delete_me').then(must).then(function () { return c.auth.signOut(); }); }
    };
  }

  root.HCplans = { cleanName: cleanName, cleanInputs: cleanInputs, suggestName: suggestName, findByName: findByName, makeStore: makeStore, MAX_NAME: MAX_NAME };
})(typeof window !== 'undefined' ? window : globalThis);
