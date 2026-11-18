/* Nucli: estat, desat al navegador, tauler, briefings i navegació entre fases */
window.APP = (function () {
  "use strict";
  var D = window.DATA, I = window.ICON;
  var S = null, KEY = "", view = null;
  var COLORS = { orange: "#E8730C", blue: "#1E4FA3", green: "#2E7D4F", purple: "#5B3F9E", ink: "#13223A" };

  function $(sel, el) { return (el || document).querySelector(sel); }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function md(t) { return esc(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>"); }
  function tri(n, color, size) {
    return '<svg viewBox="0 0 64 64" width="' + (size || 40) + '" height="' + (size || 40) + '" aria-hidden="true"><polygon points="32,5 3,58 61,58" fill="' + (color || "#E8730C") + '"/></svg>' + (n != null ? '<span>' + n + '</span>' : '');
  }
  function img(id, alt, cls) {
    return '<img class="' + (cls || "") + '" src="assets/img/' + id + '.webp" alt="' + esc(alt || "") + '" loading="lazy" onerror="APP.phImg(this)">';
  }
  function phImg(el) { var d = document.createElement("div"); d.innerHTML = ph(el.getAttribute("alt") || el.getAttribute("aria-label") || ""); if (el.parentNode) el.parentNode.replaceChild(d.firstChild, el); }
  function ph(alt) { return '<div class="ph" role="img" aria-label="' + esc(alt) + '">' + I("image") + '</div>'; }

  function blank() {
    return { v: 1, name: "", email: "", start: Date.now(), f1: null, f2: null, f3: null, f4: null, finished: null };
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} updateBar(); }
  function load(email) {
    KEY = "pla-ra2-" + email;
    try { S = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { S = null; }
    if (!S || S.v !== 1) S = blank();
  }

  function phaseScore(id) { var p = S[id]; return p && p.done ? p.score : (p ? (p.score || 0) : 0); }
  function total() { return ["f1", "f2", "f3", "f4"].reduce(function (a, k) { return a + phaseScore(k); }, 0); }
  function isDone(id) { return id === "f5" ? !!S.f4 && S.f4.done : !!(S[id] && S[id].done); }
  function unlocked(id) {
    var i = D.PHASES.findIndex(function (p) { return p.id === id; });
    return i === 0 || isDone(D.PHASES[i - 1].id);
  }
  function current() { for (var i = 0; i < 4; i++) if (!isDone(D.PHASES[i].id)) return D.PHASES[i].id; return "f5"; }

  function updateBar() {
    var steps = $("#steps"), cur = current();
    steps.innerHTML = D.PHASES.map(function (p) {
      var c = isDone(p.id) && p.id !== "f5" ? "done" : (p.id === cur ? "now" : "");
      return '<li class="' + c + '" title="' + esc(p.title) + '">' + p.n + ' · ' + esc(p.short) + '</li>';
    }).join("");
    $("#score").innerHTML = "<b>" + Math.round(total()) + "</b><small> / 1000</small>";
  }

  function toast(t) { var el = $("#toast"); el.textContent = t; el.hidden = false; clearTimeout(toast._t); toast._t = setTimeout(function () { el.hidden = true; }, 3600); }

  function mount(html, focus) {
    if (view && view.destroy) { try { view.destroy(); } catch (e) {} }
    view = null;
    var m = $("#view"); m.innerHTML = html; window.scrollTo(0, 0);
    if (focus !== false) m.focus({ preventScroll: true });
    updateBar();
    return m;
  }
  function setView(v) { view = v; }

  /* ---------------------------------------------------------------- Tauler */
  function dashboard() {
    var cur = current(), done = D.PHASES.filter(function (p) { return p.id !== "f5" && isDone(p.id); }).length;
    var pct = Math.round(total() / 10);
    var ring = '<svg viewBox="0 0 42 42" aria-hidden="true"><circle cx="21" cy="21" r="17" fill="none" stroke="#E3E9EF" stroke-width="5"/><circle cx="21" cy="21" r="17" fill="none" stroke="#E8730C" stroke-width="5" stroke-linecap="round" stroke-dasharray="' + (106.8 * pct / 100) + ' 200" transform="rotate(-90 21 21)"/></svg>';
    var stops = D.PHASES.map(function (p) {
      var st = isDone(p.id) && p.id !== "f5" ? "done" : (p.id === cur ? "now" : (unlocked(p.id) ? "" : "locked"));
      var label = st === "done" ? I("check") + " Feta · " + Math.round(phaseScore(p.id)) + " / " + p.points
        : st === "now" ? I("play") + (p.id === "f5" ? " Mira els resultats" : " Comença aquí")
        : st === "locked" ? I("lock") + " S'obre en acabar la fase " + (p.n - 1) : I("arrow") + " Obre";
      return '<button type="button" class="stop ' + st + '" data-id="' + p.id + '"' + (st === "locked" ? ' aria-disabled="true"' : '') + '>' +
        '<div class="tri">' + tri(p.n, COLORS[p.color]) + '</div><h3>' + esc(p.short) + '</h3>' +
        '<div class="meta">' + esc(p.unit) + (p.points ? ' · ' + p.points + ' punts' : '') + '</div>' +
        '<div class="st">' + label + '</div></button>';
    }).join("");
    var first = (S.name || "").split(" ")[0];
    mount('<section class="hero">' +
        '<div class="vid"><video src="assets/video/portada.mp4" poster="assets/img/portada.webp" autoplay muted loop playsinline aria-label="Vídeo de presentació: el cicle del desastre i la resposta"></video></div>' +
        '<div class="hello"><h1>Hola, ' + esc(first || "") + '</h1>' +
        '<p>Repassa l\'<b>RA2 · La gestió dels desastres</b> abans de l\'examen. Fes les fases en ordre: abans de cada una tens un resum de teoria i les instruccions.</p>' +
        '<p class="small muted">El progrés es desa en aquest navegador. Al final descarregaràs un PDF per lliurar al professorat a Classroom.</p>' +
        '<div class="ring">' + ring + '<div><b>' + Math.round(total()) + '</b> <span class="muted">de 1.000 punts</span><br><span class="small muted">' + done + ' de 4 fases fetes</span></div></div></div>' +
      '</section>' +
      '<section class="map" aria-labelledby="mapT"><h2 id="mapT">El teu recorregut</h2><p class="sub">Cinc parades, de les fases del desastre a l\'ajuda internacional.</p>' +
        '<div class="route"><svg class="path" viewBox="0 0 1000 220" preserveAspectRatio="none" aria-hidden="true"><path d="M60 150 C 160 60, 260 60, 300 110 S 460 170, 500 110 S 660 40, 700 110 S 860 170, 940 90" fill="none" stroke="#E8730C" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 14"/></svg>' + stops + '</div></section>');
    Array.prototype.forEach.call(document.querySelectorAll(".stop"), function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-id");
        if (!unlocked(id)) { toast("Aquesta fase s'obre quan acabis l'anterior."); return; }
        if (id === "f5") return go("results");
        if (isDone(id)) return go("brief", id);
        go("brief", id);
      });
    });
    var v = $(".hero video"); if (v && document.documentElement.getAttribute("data-motion") === "off") { v.removeAttribute("autoplay"); v.pause(); }
  }

  /* ---------------------------------------------------------------- Briefing */
  function brief(id) {
    var p = D.PHASES.find(function (x) { return x.id === id; }), B = D.BRIEF[id];
    var blocks = B.blocks.map(function (b) { return '<h2>' + esc(b.h) + '</h2><ul class="keys">' + b.items.map(function (x) { return '<li>' + md(x) + '</li>'; }).join("") + '</ul>'; }).join("");
    var ex = B.examples.map(function (e) { return '<figure>' + img(e.img, e.cap) + '<figcaption>' + esc(e.cap) + '</figcaption></figure>'; }).join("");
    var done = isDone(id);
    mount('<div class="phead"><div class="tri">' + tri(p.n, COLORS[p.color], 58) + '</div><div><h1>' + esc(p.title) + '</h1><p>' + esc(p.unit) + ' · ' + p.points + ' punts</p></div></div>' +
      '<div class="brief"><div class="panel"><p class="lead2">' + esc(B.lead) + '</p>' + blocks + '</div>' +
      '<div class="media"><video controls playsinline preload="metadata" poster="assets/video/' + id + '.jpg" src="assets/video/' + id + '.mp4" aria-label="Vídeo d\'introducció de la fase ' + p.n + '" onerror="APP.phImg(this)"></video>' +
      '<div class="panel"><h2>Exemples</h2><div class="exgrid">' + ex + '</div></div></div></div>' +
      '<section class="how" aria-labelledby="howT"><div><h2 id="howT">Com es juga</h2><ol>' + B.how.map(function (x) { return '<li>' + md(x) + '</li>'; }).join("") + '</ol></div>' +
      '<div class="row">' + (done ? '<span class="small"><b>Ja l\'has feta: ' + Math.round(phaseScore(id)) + ' / ' + p.points + ' punts.</b></span><button class="btn ghost" id="back">' + I("back") + ' Tauler</button>' : '<button class="btn" id="play">' + I("play") + ' Comença la fase ' + p.n + '</button>') + '</div></section>');
    var pl = $("#play"); if (pl) pl.addEventListener("click", function () { go("play", id); });
    var bk = $("#back"); if (bk) bk.addEventListener("click", function () { go("dash"); });
  }

  function go(where, id) {
    if (where === "dash") return dashboard();
    if (where === "brief") return brief(id);
    if (where === "results") return window.RESULTS.render();
    if (where === "play") {
      var p = D.PHASES.find(function (x) { return x.id === id; });
      if (p.kind === "quiz") return window.QUIZ.render(id);
      if (p.kind === "dnd") return window.DND.render();
      if (p.kind === "cases") return window.CASES.render();
    }
  }

  function finishPhase(id, data) {
    S[id] = data; S[id].done = true; S[id].at = Date.now();
    if (id === "f4") S.finished = Date.now();
    save();
  }

  /* ---------------------------------------------------------------- Accessibilitat */
  function applyPrefs() {
    var pr = {}; try { pr = JSON.parse(localStorage.getItem("pla-ra2-prefs") || "{}"); } catch (e) {}
    var r = document.documentElement;
    r.setAttribute("data-size", pr.size || "m"); r.setAttribute("data-font", pr.font || "atkinson");
    r.setAttribute("data-contrast", pr.contrast || "normal"); r.setAttribute("data-motion", pr.motion || (matchMedia("(prefers-reduced-motion: reduce)").matches ? "off" : "on"));
    return pr;
  }
  function initA11y() {
    var pr = applyPrefs(), btn = $("#a11yBtn"), box = $("#a11y");
    ["size", "font", "contrast", "motion"].forEach(function (k) {
      var cur = document.documentElement.getAttribute("data-" + k);
      Array.prototype.forEach.call(document.querySelectorAll('input[name="' + k + '"]'), function (inp) {
        inp.checked = inp.value === cur;
        inp.addEventListener("change", function () { pr[k] = inp.value; try { localStorage.setItem("pla-ra2-prefs", JSON.stringify(pr)); } catch (e) {} applyPrefs(); });
      });
    });
    btn.addEventListener("click", function () { var o = box.hidden; box.hidden = !o; btn.setAttribute("aria-expanded", String(o)); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !box.hidden) { box.hidden = true; btn.setAttribute("aria-expanded", "false"); btn.focus(); } });
  }

  function start(user) {
    load(user.email);
    if (user.name) S.name = user.name;
    S.email = user.email; save();
    $("#who").textContent = S.name || S.email;
    $("#homeBtn").addEventListener("click", function () { go("dash"); });
    initA11y();
    dashboard();
  }
  function reset() { var n = S.name, e = S.email; S = blank(); S.name = n; S.email = e; save(); dashboard(); }

  applyPrefs();
  return { start: start, go: go, save: save, state: function () { return S; }, finishPhase: finishPhase, total: total, phaseScore: phaseScore,
           mount: mount, setView: setView, toast: toast, esc: esc, md: md, img: img, ph: ph, phImg: phImg, tri: tri, COLORS: COLORS, $: $, reset: reset, isDone: isDone };
})();
