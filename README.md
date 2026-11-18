# Pla en marxa · RA2 La gestió dels desastres

Aplicació d'estudi per al mòdul **0053 Logística sanitària en emergències** (CFGM TES, TES 1M · Institut d'FP Sanitària Vall d'Hebron). Web estàtica per a GitHub Pages: no cal compilar res.

## Recorregut (1.000 punts · nota = punts / 100)

| Fase | Contingut | Activitat | Punts |
|---|---|---|---|
| 1 | Fases i gestió del desastre (2.1–2.2) | 10 preguntes amb imatge | 200 |
| 2 | Sistemes d'emergències i protecció civil (2.3–2.4) | 10 preguntes amb imatge | 200 |
| 3 | Ajuda humanitària (2.5) | 3 taulers d'arrossegar (actors, principis, marc legal) | 250 |
| 4 | Casos pràctics en 3D | Riuada a Riubaix · Terratrèmol a Kalami | 350 |
| 5 | Resultats i repàs | Nota, temes per repassar, PDF per al professorat | — |

Cada fase va precedida d'una pàgina de teoria (vídeo, idees clau, exemples i instruccions).

## Accés
Correu `@isvh.cat` + contrasenya comuna (la mateixa de les apps anteriors; només se'n desa el hash SHA-256 a `js/login.js`). És una barrera d'accés, no una autenticació real. El progrés es desa al navegador (localStorage).

## Estructura
- `index.html` · `css/app.css` · `js/` (data, app, quiz, dnd, scene3d, cases, results, login, icons)
- `assets/video/` vídeos: f1–f4 (Remotion), portada i resultats (HyperFrames)
- `assets/img/` imatges (`f1-q1.webp`… `f2-q10.webp`, `th-f1a.webp`…`th-f4b.webp`, `case-a/b.webp`, `portada.webp`). Si falta una imatge, l'app mostra un marcador i continua funcionant.
- `version.json` + `window.APP_VERSION`: en publicar canvis, puja tots dos números i els navegadors es recarreguen sols.

## Contingut
Tot el text, preguntes, respostes i casos són a `js/data.js` (cada pregunta inclou el prompt de la seva imatge).

## PDF per al professorat
Inclou alumne, data, punts per fase i per tema, errors comesos, temes a repassar i un codi de verificació (`RA2-…`).

## Publicar
Copia el contingut d'aquesta carpeta a l'arrel de la branca `main` del repositori i activa GitHub Pages (Deploy from branch · main · /root).
