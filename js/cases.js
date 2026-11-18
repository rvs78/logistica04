/* F4: dos casos pràctics amb escena 3D i decisions al panell */
window.CASES = (function () {
  "use strict";
  var A = window.APP, D = window.DATA, I = window.ICON;
  var STATES = {
    inter: { level: 0, rain: false, bridge: "ok" }, alerta: { level: 0, rain: false, alert: true, bridge: "ok" },
    impacte: { level: 0.75, rain: true, alert: true, bridge: "ok" }, emergencia: { level: 0.55, rain: true, boats: true, alert: true, bridge: "down" },
    recon: { level: 0, rain: false, cranes: true, bridge: "new" }
  };

  function render(which) {
    var S = A.state(), p = D.PHASES[3];
    var run = (S.f4 && !S.f4.done) ? S.f4 : { A: {}, B: {}, score: 0 };
    S.f4 = run; A.save();
    var ci = which != null ? which : (allChecked(D.CASES[0], run.A) ? 1 : 0);
    var C = D.CASES[ci], R = run[C.id], scene = null, moment = 0;

    function allChecked(c, r) { return c.tasks.every(function (t) { return r[t.id] && r[t.id].checked; }); }
    function caseScore(c) { return c.tasks.reduce(function (a, t) { var r = run[c.id][t.id]; return a + (r && r.checked ? r.pts : 0); }, 0); }
    function recompute() { run.score = caseScore(D.CASES[0]) + caseScore(D.CASES[1]); A.save(); }

    var tabs = D.CASES.map(function (c, i) {
      var can = i === 0 || allChecked(D.CASES[0], run.A);
      return '<button class="btn small ' + (i === ci ? "" : "ghost") + '" data-case="' + i + '"' + (can ? "" : " disabled") + '>Cas ' + c.id + ' · ' + A.esc(c.title) + (allChecked(c, run[c.id]) ? ' ' + I("check") : '') + '</button>';
    }).join("");
    A.mount('<div class="phead"><div class="tri">' + A.tri(p.n, A.COLORS[p.color], 58) + '</div><div><h1>' + A.esc(p.title) + '</h1><p>Cas ' + C.id + ' · ' + C.points + ' punts · Punts de la fase: <b id="f4s">' + Math.round(run.score) + '</b> / 350</p></div></div>' +
      '<div class="casetabs" role="group" aria-label="Casos">' + tabs + '</div>' +
      '<div class="cases"><div class="stage" id="stage"><div class="legend">' + I("hand") + ' Arrossega per girar · roda o pessiga per apropar · toca els triangles</div></div>' +
      '<div class="tasks"><div class="task"><h3>' + A.esc(C.title) + '</h3><p>' + A.esc(C.intro) + '</p></div><div id="tasks"></div><div id="endbox"></div></div></div>');
    Array.prototype.forEach.call(document.querySelectorAll("[data-case]"), function (b) { b.addEventListener("click", function () { render(+b.getAttribute("data-case")); }); });

    var stage = document.getElementById("stage");
    function openInfo(id) {
      var s = C.hotspots.find(function (h) { return h.id === id; }); if (!s) return;
      R.seen = R.seen || {}; R.seen[id] = true; A.save(); scene.mark(id, "seen");
      var old = stage.querySelector(".info"); if (old) old.remove();
      var pickT = C.tasks.find(function (t) { return t.type === "pick"; }), pickOpen = pickT && !(R[pickT.id] && R[pickT.id].checked);
      var el = document.createElement("div"); el.className = "info"; el.setAttribute("role", "dialog"); el.setAttribute("aria-label", s.label);
      el.innerHTML = '<button class="btn ghost small x" aria-label="Tanca">' + I("x") + '</button><b>' + A.esc(s.label) + '</b><p>' + A.esc(s.text) + '</p>' +
        (pickOpen ? '<button class="btn small blue" id="pickBtn">' + I("target") + ' Tria aquest edifici per a la decisió ' + pickT.id + '</button>' : '');
      stage.appendChild(el);
      el.querySelector(".x").addEventListener("click", function () { el.remove(); });
      var pb = el.querySelector("#pickBtn"); if (pb) pb.addEventListener("click", function () { R._pick = id; A.save(); el.remove(); drawTasks(); });
      el.querySelector(".x").focus();
    }
    scene = window.SCENE3D.create(stage, C.scene, C.hotspots, openInfo);
    A.setView({ destroy: function () { scene.destroy(); } });
    Object.keys(R.seen || {}).forEach(function (k) { scene.mark(k, "seen"); });
    if (C.scene === "flood") { var t0 = C.timeline[moment]; scene.setState(STATES[t0.answer]); }

    function chips(name, opts, val, done, good) {
      return '<div class="chips" role="radiogroup">' + opts.map(function (o) {
        var v = Array.isArray(o) ? o[0] : o, l = Array.isArray(o) ? o[1] : o, cls = "";
        if (done) cls = v === good ? " ok" : (v === val ? " bad" : ""); else if (v === val) cls = " on";
        return '<button type="button" class="chip' + cls + '" role="radio" aria-checked="' + (v === val) + '" data-n="' + name + '" data-v="' + A.esc(v) + '"' + (done ? " disabled" : "") + '>' + A.esc(l) + '</button>';
      }).join("") + '</div>';
    }
    function sel(name, opts, val, done, good) {
      if (done) return '<p class="small"><b style="color:' + (val === good ? "var(--ok)" : "var(--bad)") + '">' + (val === good ? "✓ " : "✗ ") + A.esc(val || "—") + '</b>' + (val === good ? "" : " · correcte: <b>" + A.esc(good) + "</b>") + '</p>';
      return '<select data-n="' + name + '" aria-label="Tria una opció"><option value="">Tria…</option>' + opts.map(function (o) { return '<option' + (o === val ? " selected" : "") + '>' + A.esc(o) + '</option>'; }).join("") + '</select>';
    }

    function drawTasks() {
      var box = document.getElementById("tasks");
      box.innerHTML = C.tasks.map(function (t) {
        var r = R[t.id] || {}, done = !!r.checked, body = "";
        if (t.type === "timeline") {
          var ans = r.ans || {};
          body = '<div class="tl" role="group" aria-label="Línia del temps">' + C.timeline.map(function (m, i) { return '<button type="button" data-m="' + i + '" class="' + (i === moment ? "now" : "") + (ans[i] ? " set" : "") + '">' + A.esc(m.label) + '</button>'; }).join("") + '</div>' +
            '<p><b>' + A.esc(C.timeline[moment].label) + ':</b> ' + A.esc(C.timeline[moment].text) + '</p>' +
            chips("ph" + moment, C.phases, ans[moment], done, C.timeline[moment].answer) +
            '<p class="small muted">Has decidit ' + Object.keys(ans).length + ' de ' + C.timeline.length + ' moments.</p>';
        } else if (t.type === "pick") {
          var picked = r.pick || R._pick, lab = picked ? C.hotspots.find(function (h) { return h.id === picked; }).label : null;
          body = '<p class="small">' + (lab ? 'Has triat: <b>' + A.esc(lab) + '</b>' : 'Toca un triangle de l\'escena i prem «Tria aquest edifici».') + '</p>' +
            (done ? '<p class="small"><b style="color:' + (r.ok ? "var(--ok)" : "var(--bad)") + '">' + (r.ok ? "Correcte. " : "No és correcte. ") + '</b>' + A.esc(t.why) + '</p>' : '');
        } else if (t.type === "match" || t.type === "need") {
          var vals = r.vals || {};
          body = t.items.map(function (it, i) {
            var label = t.type === "need" ? C.hotspots.find(function (h) { return h.id === it.spot; }).label : it.t;
            return '<div class="mrow"><p style="margin:0 0 4px">' + (t.type === "need" ? '<button type="button" class="btn ghost small" data-spot="' + it.spot + '">' + I("info") + ' ' + A.esc(label) + '</button>' : A.esc(label)) + '</p>' + sel(t.id + ":" + i, t.options, vals[i], done, it.a) + '</div>';
          }).join("");
        } else if (t.type === "choice") {
          body = '<div class="opts">' + t.options.map(function (o, i) {
            var cls = done ? (i === t.a ? " ok" : (i === r.k ? " bad" : "")) : (i === r.k ? " ok" : "");
            return '<button type="button" class="opt' + (done ? cls : (i === r.k ? "" : "")) + '" data-c="' + i + '" aria-pressed="' + (i === r.k) + '"' + (done ? " disabled" : "") + ' style="' + (!done && i === r.k ? "border-color:var(--blue);background:var(--blue-soft)" : "") + '"><span class="k">' + (i + 1) + '</span><span>' + A.esc(o) + '</span></button>';
          }).join("") + '</div>' + (done ? '<p class="small"><b style="color:' + (r.ok ? "var(--ok)" : "var(--bad)") + '">' + (r.ok ? "Correcte. " : "No és correcte. ") + '</b>' + A.esc(t.why) + '</p>' : '');
        }
        return '<div class="task' + (done ? " done" : "") + '" data-t="' + t.id + '"><h3><span>Decisió ' + t.id + '</span><small>' + (done ? Math.round(r.pts) + " / " + t.pts + " punts" : t.pts + " punts") + '</small></h3><p>' + A.esc(t.q) + '</p>' + body +
          (done ? '' : '<div class="next"><button type="button" class="btn small blue" data-check="' + t.id + '">' + I("check") + ' Comprova</button></div>') + '</div>';
      }).join("");
      bindTasks();
      var end = document.getElementById("endbox");
      if (allChecked(C, R)) {
        var bothDone = allChecked(D.CASES[0], run.A) && allChecked(D.CASES[1], run.B);
        end.innerHTML = '<div class="task done"><h3>Cas ' + C.id + ' resolt <small>' + Math.round(caseScore(C)) + ' / ' + C.points + '</small></h3>' +
          (bothDone ? '<button class="btn" id="fin">' + I("flag") + ' Acaba la fase 4 i mira els resultats</button>' : '<button class="btn" id="nextCase">' + I("arrow") + ' Passa al cas B</button>') + '</div>';
        var f = document.getElementById("fin"); if (f) f.addEventListener("click", finish);
        var nc = document.getElementById("nextCase"); if (nc) nc.addEventListener("click", function () { render(1); });
      } else end.innerHTML = "";
    }

    function bindTasks() {
      var box = document.getElementById("tasks");
      Array.prototype.forEach.call(box.querySelectorAll("[data-m]"), function (b) { b.addEventListener("click", function () { moment = +b.getAttribute("data-m"); scene.setState(STATES[C.timeline[moment].answer]); drawTasks(); var n = document.querySelector('[data-m="' + moment + '"]'); if (n) n.focus(); }); });
      Array.prototype.forEach.call(box.querySelectorAll(".chip"), function (b) { b.addEventListener("click", function () {
        var r = R.A1 = R.A1 || {}; r.ans = r.ans || {}; r.ans[moment] = b.getAttribute("data-v"); A.save();
        if (moment < C.timeline.length - 1 && Object.keys(r.ans).length < C.timeline.length) { moment++; scene.setState(STATES[C.timeline[moment].answer]); }
        drawTasks(); }); });
      Array.prototype.forEach.call(box.querySelectorAll("select"), function (s) { s.addEventListener("change", function () {
        var parts = s.getAttribute("data-n").split(":"), r = R[parts[0]] = R[parts[0]] || {}; r.vals = r.vals || {}; r.vals[parts[1]] = s.value; A.save(); }); });
      Array.prototype.forEach.call(box.querySelectorAll("[data-spot]"), function (b) { b.addEventListener("click", function () { openInfo(b.getAttribute("data-spot")); }); });
      Array.prototype.forEach.call(box.querySelectorAll("[data-c]"), function (b) { b.addEventListener("click", function () {
        var tid = b.closest(".task").getAttribute("data-t"), r = R[tid] = R[tid] || {}; r.k = +b.getAttribute("data-c"); A.save(); drawTasks(); }); });
      Array.prototype.forEach.call(box.querySelectorAll("[data-check]"), function (b) { b.addEventListener("click", function () { check(b.getAttribute("data-check")); }); });
    }

    function check(tid) {
      var t = C.tasks.find(function (x) { return x.id === tid; }), r = R[tid] = R[tid] || {};
      if (t.type === "timeline") {
        var ans = r.ans || {}; if (Object.keys(ans).length < C.timeline.length) return A.toast("Decideix la fase de tots els moments de la línia del temps.");
        var ok = C.timeline.filter(function (m, i) { return ans[i] === m.answer; }).length;
        r.pts = ok * t.pts / C.timeline.length; r.ok = ok === C.timeline.length; r.errs = C.timeline.map(function (m, i) { return ans[i] === m.answer ? null : m.label; }).filter(Boolean);
      } else if (t.type === "pick") {
        r.pick = r.pick || R._pick; if (!r.pick) return A.toast("Primer toca un triangle de l'escena i tria l'edifici.");
        r.ok = r.pick === t.answer; r.pts = r.ok ? t.pts : 0;
      } else if (t.type === "match" || t.type === "need") {
        var vals = r.vals || {}; if (t.items.some(function (it, i) { return !vals[i]; })) return A.toast("Tria una resposta per a cada fila.");
        var okm = t.items.filter(function (it, i) { return vals[i] === it.a; }).length;
        r.pts = okm * t.pts / t.items.length; r.ok = okm === t.items.length; r.errs = t.items.map(function (it, i) { return vals[i] === it.a ? null : (it.t || it.spot); }).filter(Boolean);
      } else if (t.type === "choice") {
        if (r.k == null) return A.toast("Tria una resposta.");
        r.ok = r.k === t.a; r.pts = r.ok ? t.pts : 0;
      }
      r.checked = true; r.topic = t.topic; recompute();
      document.getElementById("f4s").textContent = Math.round(run.score);
      if (t.type === "pick") scene.mark(t.answer, "seen");
      drawTasks();
      A.toast(r.ok ? "Correcte · +" + Math.round(r.pts) + " punts" : "Revisat · +" + Math.round(r.pts) + " punts. Mira la correcció al panell.");
    }

    function finish() { recompute(); A.finishPhase("f4", run); A.go("results"); }
    drawTasks();
  }
  return { render: function () { render(); } };
})();
