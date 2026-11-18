/* Accés: nom, correu @isvh.cat i la contrasenya d'aula del mòdul (es compara la seva empremta SHA-256, la mateixa que logistica01 i logistica03) */
(function () {
  "use strict";
  var PASS_SHA256 = "a017f2a772b109f4ab9073155516fd71797d3a1fc329f228f35fb087050f8eb8";
  var DOMAIN_RE = /^[a-z0-9._%+-]+@isvh\.cat$/;
  var SKEY = "pla-ra2-user";
  var login = document.getElementById("login"), app = document.getElementById("app");
  var form = document.getElementById("lgForm"), err = document.getElementById("lgErr");
  function hex(buf) { return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join(""); }
  function enter(u) {
    login.hidden = true; app.hidden = false;
    document.getElementById("logout").onclick = function () { try { sessionStorage.removeItem(SKEY); } catch (e) {} location.reload(); };
    window.APP.start(u);
  }
  var saved = null; try { saved = JSON.parse(sessionStorage.getItem(SKEY) || "null"); } catch (e) {}
  if (saved && DOMAIN_RE.test(saved.email || "")) { enter(saved); return; }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("lgName").value.trim().replace(/\s+/g, " ");
    var email = document.getElementById("lgEmail").value.trim().toLowerCase();
    var pass = document.getElementById("lgPass").value;
    if (name.split(" ").length < 2) { err.textContent = "Escriu el teu nom i almenys un cognom: sortiran al PDF per al professorat."; document.getElementById("lgName").focus(); return; }
    if (!DOMAIN_RE.test(email)) { err.textContent = "Escriu el teu correu de l'institut. Ha d'acabar en @isvh.cat."; document.getElementById("lgEmail").focus(); return; }
    if (!window.crypto || !crypto.subtle) { err.textContent = "Aquest navegador no pot validar l'accés. Fes servir Chrome, Edge, Firefox o Safari actualitzats."; return; }
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(pass)).then(function (buf) {
      if (hex(buf) !== PASS_SHA256) { err.textContent = "La contrasenya no és correcta. Torna-ho a provar."; document.getElementById("lgPass").select(); return; }
      err.textContent = "";
      var u = { name: name, email: email };
      try { sessionStorage.setItem(SKEY, JSON.stringify(u)); } catch (e2) {}
      enter(u);
    });
  });
  document.getElementById("lgName").focus();
})();
