/* F3: drag and drop en 3 taulers. Funciona amb ratolí, tàctil (Pointer Events), clic i teclat */
window.DND = (function () {
  "use strict";
  var A = window.APP, D = window.DATA, I = window.ICON;
  var PTS = 10;

  function shuffle(arr, seed) { var a = arr.slice(), s = seed || 7; for (var i = a.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; var j = Math.floor(s / 233280 * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  function render() {
    var S = A.state(), p = D.PHASES[2];
    var run = (S.f3 && !S.f3.done) ? S.f3 : { boards: {}, score: 0, results: [] };
    S.f3 = run; A.save();
    var bi = run.results.length;

    function board() {
      if (bi >= D.DND.length) return finish();
      var B = D.DND[bi], place = {}, checked = false, sel = null, drag = null;
      var order = shuffle(B.cards.map(function (c, i) { return i; }), 11 + bi * 5);
      var legal = B.id === "legal", longCards = B.id === "principis";
      A.mount('<div class="phead"><div class="tri">' + A.tri(p.n, A.COLORS[p.color], 58) + '</div><div><h1>' + A.esc(p.title) + '</h1><p>Tauler ' + (bi + 1) + ' de ' + D.DND.length + ' · ' + run.score + ' punts fins ara</p></div></div>' +
        '<div class="dndhead"><div><h2>' + A.esc(B.title) + '</h2><p class="muted" id="dndI">' + A.esc(B.intro) + ' <span class="sr">Amb el teclat: selecciona una targeta amb Retorn i després prem Retorn sobre una caixa.</span></p></div>' +
        '<button class="btn blue" id="check" disabled>' + I("check") + ' Comprova</button></div>' +
        '<div class="tray" id="tray" aria-label="Targetes per col·locar"></div>' +
        '<div class="bins' + (legal ? ' legal' : '') + '" id="bins">' + B.bins.map(function (b) {
          return '<div class="bin target" role="button" tabindex="0" data-bin="' + b.id + '" aria-label="Caixa: ' + A.esc(b.name) + '"><header>' + A.esc(b.name) + (b.hint ? '<small>' + A.esc(b.hint) + '</small>' : '') + '</header></div>';
        }).join("") + '</div><div id="fb" aria-live="polite"></div>');

      var tray = document.getElementById("tray"), binsEl = document.getElementById("bins"), chk = document.getElementById("check");

      function cardEl(i) {
        var c = B.cards[i], el = document.createElement("button");
        el.type = "button"; el.className = "card" + (longCards ? " long" : ""); el.setAttribute("data-i", i); el.textContent = c.t;
        return el;
      }
      function draw() {
        tray.innerHTML = ""; Array.prototype.forEach.call(binsEl.querySelectorAll(".card"), function (n) { n.remove(); });
        order.forEach(function (i) {
          var el = cardEl(i);
          if (place[i]) binsEl.querySelector('[data-bin="' + place[i] + '"]').appendChild(el); else tray.appendChild(el);
          if (sel === i) el.classList.add("sel");
          if (checked) {
            var ok = place[i] === B.cards[i].bin; el.classList.add(ok ? "ok" : "bad"); el.disabled = true;
            el.innerHTML = '<span class="mark">' + I(ok ? "check" : "x") + '</span>' + A.esc(B.cards[i].t) + (ok ? '' : '<br><small>Va a: ' + A.esc(B.bins.find(function (b) { return b.id === B.cards[i].bin; }).name) + '</small>');
          }
        });
        chk.disabled = checked || Object.keys(place).length < B.cards.length;
      }
      function put(i, bin) { if (checked) return; if (bin) place[i] = bin; else delete place[i]; sel = null; draw(); }

      /* clic o teclat: selecciona i col·loca */
      tray.addEventListener("click", function (e) {
        var c = e.target.closest(".card");
        if (c) { var i = +c.getAttribute("data-i"); if (drag && drag.moved) return; sel = sel === i ? null : i; draw(); var n = tray.querySelector('[data-i="' + i + '"]') || binsEl.querySelector('[data-i="' + i + '"]'); if (n) n.focus(); return; }
        if (sel !== null) put(sel, null);
      });
      binsEl.addEventListener("click", function (e) {
        if (drag && drag.moved) return;
        var c = e.target.closest(".card");
        if (c && sel === null) { sel = +c.getAttribute("data-i"); draw(); var n = binsEl.querySelector('[data-i="' + sel + '"]'); if (n) n.focus(); return; }
        var b = e.target.closest(".bin"); if (b && sel !== null) { var i = sel; put(i, b.getAttribute("data-bin")); var m = binsEl.querySelector('[data-i="' + i + '"]'); if (m) m.focus(); }
      });
      binsEl.addEventListener("keydown", function (e) {
        if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("bin") && sel !== null) { e.preventDefault(); put(sel, e.target.getAttribute("data-bin")); e.target.focus(); }
      });

      /* arrossegar amb Pointer Events (ratolí i tàctil) */
      function onDown(e) {
        var c = e.target.closest(".card"); if (!c || checked || e.button > 0) return;
        drag = { i: +c.getAttribute("data-i"), x: e.clientX, y: e.clientY, src: c, ghost: null, moved: false };
        c.setPointerCapture && c.setPointerCapture(e.pointerId);
      }
      var viewEl = document.getElementById("view"); viewEl.addEventListener("pointerdown", onDown);
      function over(x, y) { var el = document.elementFromPoint(x, y); return el && (el.closest(".bin") || el.closest(".tray")); }
      function onMove(e) {
        if (!drag) return;
        var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 7) return;
        if (!drag.moved) {
          drag.moved = true; var r = drag.src.getBoundingClientRect();
          drag.ox = drag.x - r.left; drag.oy = drag.y - r.top;
          drag.ghost = drag.src.cloneNode(true); drag.ghost.classList.add("drag"); drag.ghost.style.width = r.width + "px"; document.body.appendChild(drag.ghost);
          drag.src.classList.add("ghost");
        }
        drag.ghost.style.left = (e.clientX - drag.ox) + "px"; drag.ghost.style.top = (e.clientY - drag.oy) + "px";
        drag.ghost.style.display = "none"; var t = over(e.clientX, e.clientY); drag.ghost.style.display = "";
        Array.prototype.forEach.call(binsEl.querySelectorAll(".bin"), function (b) { b.classList.toggle("over", b === t); });
        /* desplaçament automàtic prop de les vores (mòbil: les categories queden fora de pantalla) */
        var edge = 70, vh = window.innerHeight;
        if (e.clientY > vh - edge) window.scrollBy(0, 14); else if (e.clientY < edge + 60) window.scrollBy(0, -14);
      }
      function onUp(e) {
        if (!drag) return;
        var d = drag;
        if (d.moved) {
          d.ghost.style.display = "none"; var t = over(e.clientX, e.clientY); d.ghost.remove();
          Array.prototype.forEach.call(binsEl.querySelectorAll(".bin"), function (b) { b.classList.remove("over"); });
          if (t && t.classList.contains("bin")) put(d.i, t.getAttribute("data-bin")); else if (t && t.id === "tray") put(d.i, null); else draw();
          setTimeout(function () { drag = null; }, 0);
        } else drag = null;
      }
      window.addEventListener("pointermove", onMove); window.addEventListener("pointerup", onUp); window.addEventListener("pointercancel", onUp);
      A.setView({ destroy: function () { viewEl.removeEventListener("pointerdown", onDown); window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); window.removeEventListener("pointercancel", onUp); } });

      chk.addEventListener("click", function () {
        checked = true; draw();
        var ok = B.cards.filter(function (c, i) { return place[i] === c.bin; }).length;
        var errs = B.cards.map(function (c, i) { return place[i] === c.bin ? null : { card: c.t, put: place[i], good: c.bin }; }).filter(Boolean);
        run.results.push({ id: B.id, ok: ok, n: B.cards.length, topic: B.topic, errs: errs }); run.score += ok * PTS; A.save();
        var last = bi === D.DND.length - 1;
        document.getElementById("fb").innerHTML = '<div class="fb ' + (ok === B.cards.length ? "ok" : "bad") + '">' + I(ok === B.cards.length ? "check" : "info") + '<div><b>' + ok + ' de ' + B.cards.length + ' ben col·locades · +' + ok * PTS + ' punts</b>' +
          (ok === B.cards.length ? "Perfecte." : "Les targetes en vermell indiquen on anaven.") + '</div></div><div class="next"><button class="btn" id="nx">' + (last ? "Acaba la fase" : "Següent tauler") + ' ' + I("arrow") + '</button></div>';
        var nx = document.getElementById("nx"); nx.focus(); nx.addEventListener("click", function () { bi++; board(); });
      });
      draw();
    }

    function finish() {
      A.finishPhase("f3", run);
      A.mount('<div class="phead"><div class="tri">' + A.tri(p.n, A.COLORS[p.color], 58) + '</div><div><h1>Fase 3 acabada</h1><p>' + A.esc(p.title) + '</p></div></div>' +
        '<div class="panel"><p class="lead2">Has fet <b>' + run.score + ' de ' + p.points + ' punts</b>.</p><ul class="keys">' + run.results.map(function (r) {
          return '<li>' + A.esc(D.DND.find(function (b) { return b.id === r.id; }).title) + ': ' + r.ok + ' de ' + r.n + '</li>'; }).join("") + '</ul>' +
        '<div class="actions"><button class="btn" id="go">' + I("arrow") + ' Continua al tauler</button></div></div>');
      document.getElementById("go").addEventListener("click", function () { A.go("dash"); });
    }
    board();
  }
  return { render: render };
})();
