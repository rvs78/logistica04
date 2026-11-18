/* Escenes 3D dels casos pràctics (three.js r128): «Riuada a Riubaix» i «Campament a Kalami».
   Punts d'informació HTML sobre el canvas (accessibles amb teclat). Si no hi ha WebGL, vista en imatge amb els mateixos punts. */
window.SCENE3D = (function () {
  "use strict";
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  function create(stage, kind, spots, onSpot) {
    var api = { ok: false, setState: function () {}, mark: function () {}, pulse: function () {}, destroy: function () {} };
    var reduced = document.documentElement.getAttribute("data-motion") === "off";
    var layer = document.createElement("div"); layer.className = "hslayer"; stage.appendChild(layer);
    var btns = {};
    spots.forEach(function (s) {
      var b = document.createElement("button"); b.type = "button"; b.className = "hs"; b.setAttribute("data-id", s.id);
      b.innerHTML = '<svg viewBox="0 0 40 40" aria-hidden="true"><polygon points="20,3 2,36 38,36" fill="#E8730C" stroke="#fff" stroke-width="2.5"/><text x="20" y="31" text-anchor="middle" font-size="16" font-weight="700" fill="#fff" font-family="Arial">i</text></svg><span>' + s.label + '</span>';
      b.addEventListener("click", function () { onSpot(s.id); });
      layer.appendChild(b); btns[s.id] = b;
    });
    api.mark = function (id, cls, on) { if (btns[id]) btns[id].classList.toggle(cls, on !== false); };
    api.pulse = function (ids) { Object.keys(btns).forEach(function (k) { btns[k].classList.toggle("pick", ids.indexOf(k) >= 0); }); };

    function fallback(msg) {
      var im = document.createElement("img"); im.className = "fallback"; im.alt = "Vista de l'escena del cas"; im.src = "assets/img/case-" + (kind === "flood" ? "a" : "b") + ".webp";
      stage.insertBefore(im, layer);
      spots.forEach(function (s) { var b = btns[s.id]; b.style.left = s.fx + "%"; b.style.top = s.fy + "%"; });
      var n = document.createElement("div"); n.className = "legend"; n.textContent = msg; stage.appendChild(n);
      return api;
    }
    if (!window.THREE || !THREE.OrbitControls) return fallback("Vista en imatge: no s'ha pogut carregar el 3D.");
    var renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true }); } catch (e) { return fallback("Vista en imatge: aquest dispositiu no permet 3D."); }
    api.ok = true;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
    stage.insertBefore(renderer.domElement, layer);
    var scene = new THREE.Scene();
    var cam = new THREE.PerspectiveCamera(42, 1, 0.5, 800);
    var ctr = new THREE.OrbitControls(cam, renderer.domElement);
    ctr.enableDamping = true; ctr.maxPolarAngle = 1.32; ctr.minDistance = 25; ctr.maxDistance = 140; ctr.enablePan = false;
    var hemi = new THREE.HemisphereLight(0xdfe9f5, 0x4a5636, 0.55); scene.add(hemi);
    var sun = new THREE.DirectionalLight(0xfff4e0, 1.25); sun.position.set(-40, 70, 30); sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048); var sc = sun.shadow.camera; sc.left = -80; sc.right = 80; sc.top = 80; sc.bottom = -80; sc.far = 220; scene.add(sun);
    var std = function (c, o) { var m = new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.85, metalness: 0 }, o || {})); m.color.convertSRGBToLinear(); return m; };
    var seed = 13; var rnd = function () { return (seed = (seed * 16807) % 2147483647) / 2147483647; };
    function box(w, h, d, m, x, y, z, parent) { var o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y + h / 2, z); o.castShadow = o.receiveShadow = true; (parent || scene).add(o); return o; }
    function house(x, z, rot, col, s) {
      s = s || 1; var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot || 0; scene.add(g);
      box(6 * s, 4 * s, 5 * s, std(col || 0xEDE3D1), 0, 0, 0, g);
      var roof = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 4.4 * s, 2.6 * s, 4, 1), std(0xB5543A)); roof.rotation.y = Math.PI / 4; roof.scale.set(1, 1, 0.8); roof.position.y = 5.3 * s; roof.castShadow = true; g.add(roof);
      return g;
    }
    function tree(x, z, s, col) { var t = new THREE.Mesh(new THREE.ConeGeometry(1.6 * s, 5 * s, 7), std(col || 0x3E7A45)); t.position.set(x, 2.5 * s + 0.6, z); t.castShadow = true; scene.add(t);
      var k = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 1.2, 6), std(0x6B4A2E)); k.position.set(x, 0.6, z); scene.add(k); }
    var spotPos = {}, anim = [];

    /* ============================ ESCENA A · RIUADA */
    var flood = null, rain = null, bridge = null, bridgeNew = null, boats = [], cranes = [], beacons = [];
    if (kind === "flood") {
      scene.background = new THREE.Color(0xBFD3E6); scene.fog = new THREE.Fog(0xBFD3E6, 190, 420);
      cam.position.set(58, 52, 70); ctr.target.set(0, 0, 6);
      var ground = new THREE.Mesh(new THREE.PlaneGeometry(900, 900, 1, 1), std(0x6E9A4F)); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
      var bank = new THREE.Mesh(new THREE.PlaneGeometry(900, 30), std(0x9C8C68)); bank.rotation.x = -Math.PI / 2; bank.position.set(0, 0.05, -6); scene.add(bank);
      var river = new THREE.Mesh(new THREE.PlaneGeometry(900, 16), std(0x2F6E99, { roughness: 0.25, metalness: 0.1 })); river.rotation.x = -Math.PI / 2; river.position.set(0, 0.12, -6); scene.add(river);
      flood = new THREE.Mesh(new THREE.PlaneGeometry(300, 90), std(0x7A6A4F, { roughness: 0.35, metalness: 0.05, transparent: true, opacity: 0.9 }));
      flood.rotation.x = -Math.PI / 2; flood.position.set(0, -1, 4); scene.add(flood);
      /* nucli urbà al costat sud (zona baixa) */
      for (var i = 0; i < 14; i++) { var hx = -48 + (i % 7) * 13 + rnd() * 2, hz = 12 + Math.floor(i / 7) * 12 + rnd() * 2; house(hx, hz, rnd() * 0.3, [0xEDE3D1, 0xE9D7BB, 0xF2EEE6][i % 3]); }
      var road = new THREE.Mesh(new THREE.PlaneGeometry(900, 5), std(0x5E636B)); road.rotation.x = -Math.PI / 2; road.position.set(0, 0.08, 6); road.receiveShadow = true; scene.add(road);
      var road2 = new THREE.Mesh(new THREE.PlaneGeometry(5, 120), std(0x5E636B)); road2.rotation.x = -Math.PI / 2; road2.position.set(8, 0.07, 60); scene.add(road2);
      var school = box(16, 6, 9, std(0xF1C24B), 26, 0, 16); box(16.4, 0.6, 9.4, std(0x7E5B2A), 26, 6, 16); spotPos.escola = new THREE.Vector3(26, 9, 16);
      var res = box(12, 7, 8, std(0xC9D8E8), 44, 0, 30); box(8, 7, 8, std(0xC9D8E8), 50, 0, 22); spotPos.residencia = new THREE.Vector3(46, 10, 27);
      /* polígon i planta química, també a la vora del riu */
      box(20, 5, 12, std(0xB7BCC2), -58, 0, -26); for (var t = 0; t < 3; t++) { var tk = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, 7, 20), std(0xE4E7EA, { metalness: 0.3, roughness: 0.4 })); tk.position.set(-70 + t * 7, 3.5, -38); tk.castShadow = true; scene.add(tk); }
      var ch = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.1, 16, 12), std(0x9AA1A8)); ch.position.set(-50, 8, -30); ch.castShadow = true; scene.add(ch);
      box(1.2, 1.2, 1.2, std(0xD23B2A), -50, 15.6, -30);
      spotPos.quimica = new THREE.Vector3(-60, 13, -32);
      /* pont: l'única sortida */
      bridge = new THREE.Group(); scene.add(bridge);
      box(7, 1, 22, std(0x9D968B), 8, 2.2, -6, bridge); box(1.2, 2.4, 1.2, std(0x7F786E), 8, 0, -12, bridge); box(1.2, 2.4, 1.2, std(0x7F786E), 8, 0, 0, bridge);
      bridgeNew = new THREE.Group(); bridgeNew.visible = false; scene.add(bridgeNew);
      box(7, 1, 22, std(0xD8D4CC), 8, 2.2, -6, bridgeNew); box(1.2, 2.4, 1.2, std(0xBFB9AE), 8, 0, -12, bridgeNew); box(1.2, 2.4, 1.2, std(0xBFB9AE), 8, 0, 0, bridgeNew);
      spotPos.pont = new THREE.Vector3(8, 6, -6);
      /* sensor del riu */
      var post = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 6, 8), std(0x555555)); post.position.set(-14, 3, -15); scene.add(post);
      var panel = box(2.4, 0.2, 1.6, std(0x1E4FA3, { metalness: 0.4, roughness: 0.3 }), -14, 6, -15); panel.rotation.x = -0.5;
      spotPos.riu = new THREE.Vector3(-14, 9, -12);
      /* bosc a l'altra riba */
      for (var k = 0; k < 45; k++) tree(-120 + rnd() * 240, -40 - rnd() * 60, 0.8 + rnd() * 0.8);
      for (var k2 = 0; k2 < 12; k2++) tree(-100 + rnd() * 200, 45 + rnd() * 30, 0.8 + rnd() * 0.6, 0x4E8A4F);
      /* barques i grues (segons el moment) */
      for (var b = 0; b < 3; b++) { var bt = new THREE.Group(); bt.visible = false; scene.add(bt); box(4, 0.9, 1.8, std(0xE8730C), 0, 0, 0, bt); box(1, 1.2, 1, std(0x1E4FA3), 0.8, 0.9, 0, bt); bt.position.set(-30 + b * 22, 1.3, 20 + b * 3); boats.push(bt); }
      for (var c = 0; c < 2; c++) { var cr = new THREE.Group(); cr.visible = false; scene.add(cr); box(0.8, 18, 0.8, std(0xF1B51C), 0, 0, 0, cr); box(14, 0.7, 0.7, std(0xF1B51C), 5, 17.5, 0, cr); cr.position.set(-2 + c * 22, 0, -18 + c * 26); cranes.push(cr); }
      for (var e = 0; e < 4; e++) { var bc = new THREE.Mesh(new THREE.SphereGeometry(0.45, 10, 8), new THREE.MeshBasicMaterial({ color: 0xFFB020 })); bc.position.set(-40 + e * 25, 3, 6); bc.visible = false; scene.add(bc); beacons.push(bc); }
      /* pluja */
      var n = 1600, geo = new THREE.BufferGeometry(), pos = new Float32Array(n * 3);
      for (var r = 0; r < n; r++) { pos[r * 3] = -110 + rnd() * 220; pos[r * 3 + 1] = rnd() * 70; pos[r * 3 + 2] = -70 + rnd() * 140; }
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      rain = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xDCE7F2, size: 0.45, transparent: true, opacity: 0.75 })); rain.visible = false; scene.add(rain);
      anim.push(function (dt) {
        if (rain.visible && !reduced) { var p = rain.geometry.attributes.position; for (var q = 0; q < n; q++) { var y = p.array[q * 3 + 1] - dt * 55; p.array[q * 3 + 1] = y < 0 ? 70 : y; } p.needsUpdate = true; }
        var tl = performance.now() / 300; beacons.forEach(function (bc, j) { if (bc.visible) bc.material.color.setHex(Math.sin(tl + j) > 0 ? 0xFFB020 : 0x1E4FA3); });
      });
    }

    /* ============================ ESCENA B · CAMPAMENT */
    if (kind === "camp") {
      scene.background = new THREE.Color(0xE6D9C2); scene.fog = new THREE.Fog(0xE6D9C2, 190, 420);
      cam.position.set(-62, 50, 66); ctr.target.set(0, 0, 0);
      var g2 = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), std(0xC2A876)); g2.rotation.x = -Math.PI / 2; g2.receiveShadow = true; scene.add(g2);
      /* ciutat danyada al fons */
      for (var u = 0; u < 22; u++) {
        var w = 6 + rnd() * 6, h = 4 + rnd() * 14, ux = -90 + rnd() * 180, uz = -70 - rnd() * 40;
        var bld = box(w, h, w, std([0xBFB3A0, 0xA99C88, 0xD3C8B5][u % 3]), ux, 0, uz); bld.rotation.z = (rnd() - 0.5) * 0.25; bld.rotation.y = rnd();
        if (u % 3 === 0) { var rub = box(w * 1.3, 1.6, w * 1.1, std(0x9C9182), ux + 4, 0, uz + 6); rub.rotation.y = rnd(); }
      }
      for (var m = 0; m < 5; m++) { var mt = new THREE.Mesh(new THREE.ConeGeometry(30 + rnd() * 20, 30 + rnd() * 25, 6), std(0xA6977A)); mt.position.set(-140 + m * 70, 12, -170); scene.add(mt); }
      /* riu i planta d'aigua */
      var rv = new THREE.Mesh(new THREE.PlaneGeometry(14, 320), std(0x5D8FA8, { roughness: 0.3 })); rv.rotation.x = -Math.PI / 2; rv.position.set(72, 0.1, 0); scene.add(rv);
      for (var a = 0; a < 3; a++) { var tnk = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.8, 5, 20), std(0x2F6FB0, { roughness: 0.4 })); tnk.position.set(52 + a * 7, 2.5, -8); tnk.castShadow = true; scene.add(tnk); }
      box(10, 3, 5, std(0xE9EEF2), 58, 0, 2); var pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 14, 8), std(0x7A8790)); pipe.rotation.z = Math.PI / 2; pipe.position.set(64, 1, -2); scene.add(pipe);
      spotPos.aigua = new THREE.Vector3(58, 9, -6);
      /* hospital de campanya: tendes blanques amb franja blava (sense cap emblema) */
      function tentBig(x, z, rot) { var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot || 0; scene.add(g);
        var cyl = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.4, 12, 18, 1, false, 0, Math.PI), std(0xF4F6F8)); cyl.rotation.z = Math.PI / 2; cyl.position.y = 0.01; cyl.castShadow = true; g.add(cyl);
        var st = new THREE.Mesh(new THREE.CylinderGeometry(3.45, 3.45, 1.2, 18, 1, false, 0, Math.PI), std(0x1E4FA3)); st.rotation.z = Math.PI / 2; st.position.set(0, 0.02, 0); g.add(st); return g; }
      tentBig(-6, -6, 0); tentBig(-6, 4, 0); tentBig(8, -1, Math.PI / 2);
      spotPos.hospital = new THREE.Vector3(0, 8, -1);
      /* zona de tendes familiars */
      for (var tt = 0; tt < 24; tt++) { var tx = -58 + (tt % 6) * 7.5, tz = 8 + Math.floor(tt / 6) * 8;
        var tent = new THREE.Mesh(new THREE.ConeGeometry(2.6, 3, 4), std([0x3E7FA0, 0xE8E0CC, 0x4F8C63][tt % 3])); tent.rotation.y = Math.PI / 4; tent.position.set(tx, 1.5, tz); tent.castShadow = true; scene.add(tent); }
      spotPos.tendes = new THREE.Vector3(-40, 7, 20);
      /* magatzem d'aliments i camions */
      box(18, 7, 11, std(0xD6D9DD), -44, 0, -24); box(18.4, 0.8, 11.4, std(0x8D949B), -44, 7, -24);
      for (var cb = 0; cb < 8; cb++) box(1.6, 1.2, 1.6, std(0xB08A57), -54 + (cb % 4) * 2.2, Math.floor(cb / 4) * 1.2, -15);
      function truck(x, z, r) { var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = r; scene.add(g); box(7, 3.2, 3, std(0xF4F6F8), 0, 0.8, 0, g); box(2.4, 2.6, 3, std(0x2E7D4F), 4.6, 0.8, 0, g);
        [-2, 2, 4.8].forEach(function (wx) { [-1.6, 1.6].forEach(function (wz) { var wh = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.5, 12), std(0x222222)); wh.rotation.x = Math.PI / 2; wh.position.set(wx, 0.8, wz); g.add(wh); }); }); return g; }
      truck(-24, -30, 0.2); truck(-26, -18, -0.1);
      spotPos.magatzem = new THREE.Vector3(-44, 12, -24);
      /* espai per a infants */
      var fence = new THREE.Mesh(new THREE.TorusGeometry(7, 0.2, 6, 40), std(0xE8730C)); fence.rotation.x = Math.PI / 2; fence.position.set(24, 1, 22); scene.add(fence);
      [[22, 20, 0xF1C24B], [26, 24, 0x2E7D4F], [25, 19, 0x1E4FA3]].forEach(function (s) { var bl = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), std(s[2])); bl.position.set(s[0], 1, s[1]); bl.castShadow = true; scene.add(bl); });
      box(4, 3, 3, std(0xF4F6F8), 28, 0, 26);
      spotPos.infants = new THREE.Vector3(24, 7, 22);
      for (var tr = 0; tr < 14; tr++) tree(-110 + rnd() * 220, 50 + rnd() * 50, 0.7 + rnd() * 0.5, 0x6E7F4A);
    }

    /* ============================ bucle, mida i projecció dels punts */
    function size() { var w = stage.clientWidth, h = stage.clientHeight; renderer.setSize(w, h, false); cam.aspect = w / h; var a = w / h; cam.fov = a < 1.3 ? Math.min(78, 42 * Math.pow(1.3 / a, 0.75)) : 42; cam.updateProjectionMatrix(); }
    var ro = window.ResizeObserver ? new ResizeObserver(size) : null; if (ro) ro.observe(stage); else window.addEventListener("resize", size);
    size();
    var last = performance.now(), raf = 0, v = new THREE.Vector3();
    function tick(now) {
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      ctr.update(); anim.forEach(function (f) { f(dt); });
      if (flood) { flood.position.y += (flood.userData.target - flood.position.y) * Math.min(1, dt * 2.5); }
      renderer.render(scene, cam);
      var w = stage.clientWidth, h = stage.clientHeight;
      spots.forEach(function (s) {
        var p = spotPos[s.id], b = btns[s.id]; if (!p) return;
        v.copy(p).project(cam); var vis = v.z < 1 && Math.abs(v.x) < 1.1 && Math.abs(v.y) < 1.1;
        b.style.display = vis ? "" : "none"; b.style.left = ((v.x + 1) / 2 * w) + "px"; b.style.top = ((1 - v.y) / 2 * h) + "px";
      });
      raf = requestAnimationFrame(tick);
    }
    if (flood) flood.userData.target = -1;
    raf = requestAnimationFrame(tick);

    api.setState = function (st) {
      if (kind !== "flood") return;
      flood.userData.target = st.level > 0 ? 0.2 + st.level * 3.2 : -1;
      if (reduced) flood.position.y = flood.userData.target;
      rain.visible = !!st.rain; bridge.visible = st.bridge === "ok"; bridgeNew.visible = st.bridge === "new";
      boats.forEach(function (b) { b.visible = !!st.boats; }); cranes.forEach(function (c) { c.visible = !!st.cranes; }); beacons.forEach(function (b) { b.visible = !!st.alert; });
      scene.background.setHex(st.rain ? 0x9AA8B6 : 0xBFD3E6); scene.fog.color.setHex(st.rain ? 0x9AA8B6 : 0xBFD3E6); scene.fog.near = st.rain ? 110 : 190;
      sun.intensity = st.rain ? 0.55 : 1.25;
    };
    api.destroy = function () { cancelAnimationFrame(raf); if (ro) ro.disconnect(); ctr.dispose(); renderer.dispose(); };
    return api;
  }
  return { create: create };
})();
