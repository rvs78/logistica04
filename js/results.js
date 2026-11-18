/* F5: puntuació, valoració, què cal repassar i PDF per al professorat (jsPDF 2.5.1) */
window.RESULTS = (function () {
  "use strict";
  var A = window.APP, D = window.DATA, I = window.ICON;

  function analyse() {
    var S = A.state(), T = {}, errors = [];
    Object.keys(D.TOPICS).forEach(function (k) { T[k] = { got: 0, max: 0 }; });
    ["f1", "f2"].forEach(function (f) {
      var run = S[f]; if (!run) return;
      D.Q[f].forEach(function (q, i) {
        var a = run.answers[i]; T[q.topic].max += 20;
        if (a && a.ok) T[q.topic].got += 20;
        else if (a) errors.push({ phase: f, topic: q.topic, q: q.q, your: q.o[a.k], good: q.o[q.a] });
      });
    });
    if (S.f3) D.DND.forEach(function (b) {
      var r = (S.f3.results || []).find(function (x) { return x.id === b.id; }); T[b.topic].max += b.cards.length * 10;
      if (r) { T[b.topic].got += r.ok * 10; (r.errs || []).forEach(function (e) {
        var good = b.bins.find(function (x) { return x.id === e.good; }).name, put = (b.bins.find(function (x) { return x.id === e.put; }) || {}).name;
        errors.push({ phase: "f3", topic: b.topic, q: b.title + ": «" + e.card + "»", your: put || "—", good: good }); }); }
    });
    if (S.f4) D.CASES.forEach(function (c) { c.tasks.forEach(function (t) {
      var r = (S.f4[c.id] || {})[t.id]; T[t.topic].max += t.pts;
      if (r && r.checked) { T[t.topic].got += r.pts; if (!r.ok) errors.push({ phase: "f4", topic: t.topic, q: "Cas " + c.id + " · decisió " + t.id + ": " + t.q, your: (r.errs && r.errs.length ? "errors a: " + r.errs.join(", ") : "resposta incorrecta"), good: t.why || "vegeu la correcció al cas" }); }
    }); });
    return { T: T, errors: errors };
  }

  function grade(total) { return Math.round(total / 100 * 10) / 10; }
  function band(n) { return n >= 9 ? ["Excel·lent", "Domines la unitat. Fes un darrer cop d'ull a les idees clau i ja estàs a punt per a l'examen."]
    : n >= 7 ? ["Notable", "Tens una bona base. Repassa els temes marcats en taronja per arribar a l'examen amb seguretat."]
    : n >= 5 ? ["Suficient", "Coneixes l'essencial, però hi ha temes que encara fallen. Repassa'ls amb les fitxes de reforç abans de l'examen."]
    : ["Cal repassar", "Abans de l'examen et cal tornar a estudiar la unitat. Comença pels temes en vermell i fes les fitxes de reforç."]; }
  function code() { var S = A.state(), s = S.email + "|" + Math.round(A.total()) + "|" + (S.finished || ""), h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return ("RA2-" + (h >>> 0).toString(36).toUpperCase()).slice(0, 11); }

  function render() {
    var S = A.state(), tot = A.total(), n = grade(tot), b = band(n), an = analyse();
    var phases = D.PHASES.slice(0, 4).map(function (p) { var sc = A.phaseScore(p.id), pc = sc / p.points;
      return '<div class="brow"><span>' + p.n + ' · ' + A.esc(p.short) + '</span><span class="t"><i class="' + (pc >= .8 ? "good" : pc >= .5 ? "mid" : "low") + '" style="width:' + Math.round(pc * 100) + '%"></i></span><b>' + Math.round(sc) + '/' + p.points + '</b></div>'; }).join("");
    var topics = Object.keys(D.TOPICS).map(function (k) { var t = an.T[k], pc = t.max ? t.got / t.max : 0;
      return '<div class="brow"><span>' + A.esc(D.TOPICS[k].name) + '</span><span class="t"><i class="' + (pc >= .8 ? "good" : pc >= .5 ? "mid" : "low") + '" style="width:' + Math.round(pc * 100) + '%"></i></span><b>' + Math.round(pc * 100) + '%</b></div>'; }).join("");
    var weak = Object.keys(D.TOPICS).filter(function (k) { var t = an.T[k]; return t.max && t.got / t.max < 0.8; });
    var review = weak.length ? weak.map(function (k) {
      var errs = an.errors.filter(function (e) { return e.topic === k; }).slice(0, 3);
      return '<li><b>' + A.esc(D.TOPICS[k].name) + '</b> · ' + A.esc(D.TOPICS[k].where) + (errs.length ? '<ul class="small">' + errs.map(function (e) { return '<li>' + A.esc(e.q.length > 120 ? e.q.slice(0, 117) + "…" : e.q) + ' → <b>' + A.esc(e.good.length > 140 ? e.good.slice(0, 137) + "…" : e.good) + '</b></li>'; }).join("") + '</ul>' : '') + '</li>';
    }).join("") : '<li class="okk"><b>Cap tema per sota del 80%.</b> Fes un darrer repàs de les idees clau de les dues fitxes.</li>';
    var done = A.isDone("f4");
    A.mount('<div class="phead"><div class="tri">' + A.tri(5, "#13223A", 58) + '</div><div><h1>Resultats i repàs</h1><p>' + A.esc(S.name) + ' · ' + A.esc(S.email) + '</p></div></div>' +
      (done ? '' : '<div class="fb bad">' + I("info") + '<div><b>Encara no has acabat totes les fases.</b>Aquests resultats són provisionals.</div></div>') +
      '<div class="resgrid"><div class="grade"><video src="assets/video/resultats.mp4" autoplay muted playsinline aria-hidden="true"></video>' +
        '<span>La teva nota</span><div class="n">' + n.toFixed(1).replace(".", ",") + '<small> / 10</small></div><h2>' + b[0] + '</h2><p>' + b[1] + '</p>' +
        '<p class="small">' + Math.round(tot) + ' de 1.000 punts · codi de verificació <b>' + code() + '</b></p></div>' +
      '<div class="panel"><h2>Per fases</h2><div class="bars">' + phases + '</div><h2 style="margin-top:14px">Per temes de la unitat</h2><div class="bars">' + topics + '</div></div></div>' +
      '<section class="panel" style="margin-top:20px"><h2>Què has de repassar abans de l\'examen</h2><ul class="review">' + review + '</ul>' +
      '<p class="small muted">Les fitxes de reforç de l\'RA2 (Fitxa 1: la gestió dels desastres; Fitxa 2: l\'ajuda humanitària) són a Classroom.</p>' +
      '<div class="actions"><button class="btn" id="pdf">' + I("download") + ' Descarrega el PDF per al professorat</button><button class="btn ghost" id="dash">' + I("back") + ' Tauler</button><button class="btn ghost" id="again">' + I("refresh") + ' Torna a començar</button></div>' +
      '<p class="small muted">Puja el PDF a la tasca de Classroom. El professorat comprova el codi de verificació.</p></section>');
    document.getElementById("pdf").addEventListener("click", function () { pdf(an, n, b); });
    document.getElementById("dash").addEventListener("click", function () { A.go("dash"); });
    var ag = document.getElementById("again"), armed = false;
    ag.addEventListener("click", function () { if (!armed) { armed = true; ag.innerHTML = I("refresh") + " Segur? Es perdran els punts. Torna a prémer"; return; } A.reset(); });
    var v = document.querySelector(".grade video"); if (v && document.documentElement.getAttribute("data-motion") === "off") v.remove();
  }

  /* ------------------------------------------------------------ PDF */
  function tx(s) { return String(s).replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-").replace(/…/g, "...").replace(/→/g, "->").replace(/[^\x00-\xFF]/g, ""); }
  function pdf(an, n, b) {
    if (!window.jspdf || !window.jspdf.jsPDF) { A.toast("Encara s'està carregant el generador de PDF. Torna-ho a provar en uns segons."); return; }
    var S = A.state(), doc = new window.jspdf.jsPDF({ unit: "mm", format: "a4" }), W = 210, M = 16, y = 0;
    function head() {
      doc.setFillColor(19, 34, 58); doc.rect(0, 0, W, 24, "F");
      doc.setFillColor(232, 115, 12); doc.rect(M, 6, 12, 12, "F"); doc.setFillColor(30, 79, 163); doc.triangle(M + 6, 7.8, M + 1.6, 16.4, M + 10.4, 16.4, "F");
      doc.setTextColor(255); doc.setFont("helvetica", "bold"); doc.setFontSize(15); doc.text(tx("Pla en marxa · Informe de l'RA2"), M + 16, 12);
      doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.text(tx("0053 Logística sanitària en emergències · TES 1M · Institut d'FP Sanitària Vall d'Hebron"), M + 16, 18);
      doc.setTextColor(19, 34, 58); y = 32;
    }
    function need(h) { if (y + h > 285) { doc.addPage(); head(); } }
    function line(t, size, bold, color) { doc.setFont("helvetica", bold ? "bold" : "normal"); doc.setFontSize(size || 10); if (color) doc.setTextColor(color[0], color[1], color[2]); else doc.setTextColor(19, 34, 58);
      var L = doc.splitTextToSize(tx(t), W - 2 * M); need(L.length * (size || 10) * 0.42 + 1); doc.text(L, M, y); y += L.length * (size || 10) * 0.42 + 1.4; }
    head();
    line("Alumne/a: " + S.name, 11, true); line("Correu: " + S.email + "   ·   Data: " + new Date(S.finished || Date.now()).toLocaleString("ca-ES"), 9.5);
    y += 2; doc.setFillColor(243, 246, 248); doc.roundedRect(M, y, W - 2 * M, 22, 3, 3, "F");
    doc.setFont("helvetica", "bold"); doc.setFontSize(26); doc.text(tx(n.toFixed(1).replace(".", ",")), M + 6, y + 15); doc.setFontSize(11); doc.text("/ 10", M + 28, y + 15);
    doc.setFontSize(12); doc.text(tx(b[0]), M + 48, y + 9); doc.setFont("helvetica", "normal"); doc.setFontSize(9.5);
    doc.text(doc.splitTextToSize(tx(b[1]), W - 2 * M - 52), M + 48, y + 14.5); y += 28;
    line("Punts: " + Math.round(A.total()) + " / 1000   ·   Codi de verificació: " + code(), 10, true);
    y += 2; line("Punts per fase", 12, true);
    D.PHASES.slice(0, 4).forEach(function (p) { var sc = A.phaseScore(p.id); need(7);
      doc.setFont("helvetica", "normal"); doc.setFontSize(9.5); doc.text(tx(p.n + ". " + p.title), M, y + 3.5);
      doc.setFillColor(225, 231, 237); doc.rect(M + 92, y, 60, 4.5, "F"); doc.setFillColor(sc / p.points >= .8 ? 31 : sc / p.points >= .5 ? 232 : 179, sc / p.points >= .8 ? 122 : sc / p.points >= .5 ? 115 : 38, sc / p.points >= .8 ? 74 : sc / p.points >= .5 ? 12 : 30);
      doc.rect(M + 92, y, 60 * sc / p.points, 4.5, "F"); doc.text(Math.round(sc) + " / " + p.points, M + 156, y + 3.5); y += 7; });
    y += 2; line("Domini per temes", 12, true);
    Object.keys(D.TOPICS).forEach(function (k) { var t = an.T[k], pc = t.max ? t.got / t.max : 0; need(7);
      doc.setFont("helvetica", "normal"); doc.setFontSize(9.5); doc.text(tx(D.TOPICS[k].name), M, y + 3.5);
      doc.setFillColor(225, 231, 237); doc.rect(M + 92, y, 60, 4.5, "F"); doc.setFillColor(pc >= .8 ? 31 : pc >= .5 ? 232 : 179, pc >= .8 ? 122 : pc >= .5 ? 115 : 38, pc >= .8 ? 74 : pc >= .5 ? 12 : 30);
      doc.rect(M + 92, y, 60 * pc, 4.5, "F"); doc.text(Math.round(pc * 100) + "%", M + 156, y + 3.5); y += 7; });
    var weak = Object.keys(D.TOPICS).filter(function (k) { var t = an.T[k]; return t.max && t.got / t.max < 0.8; });
    y += 2; line("Temes a repassar abans de l'examen", 12, true);
    if (!weak.length) line("Cap tema per sota del 80 %.", 10);
    weak.forEach(function (k) { line("· " + D.TOPICS[k].name + " (" + D.TOPICS[k].where + ")", 10); });
    y += 2; line("Errors (" + an.errors.length + ")", 12, true);
    if (!an.errors.length) line("Cap error.", 10);
    an.errors.forEach(function (e, i) { line((i + 1) + ". " + e.q, 9.5, true); line("   Resposta de l'alumne: " + e.your, 9, false, [179, 38, 30]); line("   Correcte: " + e.good, 9, false, [31, 122, 74]); y += 0.8; });
    var pages = doc.getNumberOfPages();
    for (var pg = 1; pg <= pages; pg++) { doc.setPage(pg); doc.setFontSize(8); doc.setTextColor(90); doc.text(tx("Pla en marxa · RA2 · " + S.email + " · " + code()), M, 292); doc.text(pg + " / " + pages, W - M, 292, { align: "right" }); }
    var fn = "RA2_Pla_en_marxa_" + (S.name || S.email).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9]+/g, "_") + ".pdf";
    doc.save(fn);
    A.toast("PDF descarregat: " + fn);
  }
  return { render: render, analyse: analyse };
})();
