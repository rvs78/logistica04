/* F1 i F2: preguntes de resposta única amb imatge, retroacció explicada i tecles 1–4 */
window.QUIZ = (function () {
  "use strict";
  var A = window.APP, D = window.DATA, I = window.ICON;
  var PTS = 20;

  function render(fid) {
    var qs = D.Q[fid], p = D.PHASES.find(function (x) { return x.id === fid; });
    var S = A.state();
    var run = (S[fid] && !S[fid].done) ? S[fid] : { answers: [], score: 0 };
    S[fid] = run; A.save();
    var idx = run.answers.length, keyH = null;

    function show() {
      if (idx >= qs.length) return finish();
      var q = qs[idx];
      A.mount('<div class="phead"><div class="tri">' + A.tri(p.n, A.COLORS[p.color], 58) + '</div><div><h1>' + A.esc(p.title) + '</h1><p>' + A.esc(p.unit) + '</p></div></div>' +
        '<div class="qwrap"><div class="qimg">' + A.img(q.img, "Imatge de la pregunta " + (idx + 1)) + '</div>' +
        '<div><div class="qprog"><span>Pregunta ' + (idx + 1) + ' de ' + qs.length + '</span><span class="bar2"><i style="width:' + (idx / qs.length * 100) + '%"></i></span><span>' + run.score + ' punts</span></div>' +
        '<p class="qtext" id="qt">' + A.esc(q.q) + '</p>' +
        '<div class="opts" role="group" aria-labelledby="qt">' + q.o.map(function (o, k) {
          return '<button type="button" class="opt" data-k="' + k + '"><span class="k">' + (k + 1) + '</span><span>' + A.esc(o) + '</span></button>';
        }).join("") + '</div><div id="fb" aria-live="polite"></div></div></div>');
      var btns = document.querySelectorAll(".opt");
      Array.prototype.forEach.call(btns, function (b) { b.addEventListener("click", function () { answer(+b.getAttribute("data-k")); }); });
      if (keyH) document.removeEventListener("keydown", keyH);
      keyH = function (e) { if (e.target.tagName === "INPUT") return; var n = parseInt(e.key, 10); if (n >= 1 && n <= 4 && !btns[0].disabled) answer(n - 1); };
      document.addEventListener("keydown", keyH);
      A.setView({ destroy: function () { if (keyH) document.removeEventListener("keydown", keyH); keyH = null; } });
    }

    function answer(k) {
      var q = qs[idx], ok = k === q.a;
      var btns = document.querySelectorAll(".opt");
      Array.prototype.forEach.call(btns, function (b, i) { b.disabled = true; if (i === q.a) b.classList.add("ok"); else if (i === k) b.classList.add("bad"); });
      run.answers.push({ k: k, ok: ok, topic: q.topic }); if (ok) run.score += PTS; A.save();
      var last = idx === qs.length - 1;
      document.getElementById("fb").innerHTML = '<div class="fb ' + (ok ? "ok" : "bad") + '">' + I(ok ? "check" : "x") + '<div><b>' + (ok ? "Correcte · +20 punts" : "No és correcte. La resposta és: " + A.esc(q.o[q.a])) + '</b>' + A.esc(q.why) + '</div></div>' +
        '<div class="next"><button type="button" class="btn" id="nx">' + (last ? "Acaba la fase" : "Següent pregunta") + ' ' + I("arrow") + '</button></div>';
      var nx = document.getElementById("nx"); nx.focus();
      nx.addEventListener("click", function () { idx++; show(); });
    }

    function finish() {
      if (keyH) document.removeEventListener("keydown", keyH);
      A.finishPhase(fid, run);
      var ok = run.answers.filter(function (a) { return a.ok; }).length;
      A.mount('<div class="phead"><div class="tri">' + A.tri(p.n, A.COLORS[p.color], 58) + '</div><div><h1>Fase ' + p.n + ' acabada</h1><p>' + A.esc(p.title) + '</p></div></div>' +
        '<div class="panel"><p class="lead2">Has encertat ' + ok + ' de ' + qs.length + ' preguntes: <b>' + run.score + ' de ' + p.points + ' punts</b>.</p>' +
        '<p>' + (ok >= 8 ? "Molt bé: domines aquest bloc." : ok >= 5 ? "Bé, però repassa les preguntes que has fallat: les trobaràs al resum final." : "Et convé repassar aquest bloc amb la fitxa de reforç abans de l'examen.") + '</p>' +
        '<div class="actions"><button class="btn" id="go">' + I("arrow") + ' Continua al tauler</button></div></div>');
      document.getElementById("go").addEventListener("click", function () { A.go("dash"); });
    }

    show();
  }
  return { render: render };
})();
