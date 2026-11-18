/* Contingut de l'app «Pla en marxa» · RA2 La gestió dels desastres.
   Font: presentacions U2 (2.1–2.4) i 2.5 L'ajuda humanitària, i fitxes de reforç RA2.
   Cada pregunta té un tema (T1–T7) per al repàs final. Els "prompt" serveixen per generar les imatges (tools/gen_images.py). */
window.DATA = (function () {
  "use strict";

  var TOPICS = {
    T1: { name: "Les fases del desastre", where: "Fitxa 1 · pàgina 1 (2.1)" },
    T2: { name: "La gestió del desastre i els plans", where: "Fitxa 1 · pàgina 2 (2.2)" },
    T3: { name: "Els sistemes d'emergències i el 112", where: "Fitxa 1 · pàgina 3 (2.3)" },
    T4: { name: "La protecció civil: funcions, àmbits, UME i Creu Roja", where: "Fitxa 1 · pàgines 3 i 4 (2.4)" },
    T5: { name: "Principis, objectius i necessitats bàsiques", where: "Fitxa 2 · pàgines 1 i 2 (2.5.1)" },
    T6: { name: "Els actors de l'acció humanitària", where: "Fitxa 2 · pàgines 2 i 3 (2.5.2)" },
    T7: { name: "La qualitat (Esfera) i el marc legal", where: "Fitxa 2 · pàgina 4 (2.5.3)" }
  };

  var PHASES = [
    { id: "f1", n: 1, short: "Fases i gestió", title: "Les fases i la gestió del desastre", unit: "Apartats 2.1 i 2.2", kind: "quiz", points: 200, color: "orange", icon: "cycle" },
    { id: "f2", n: 2, short: "Sistemes i protecció civil", title: "Els sistemes d'emergències i la protecció civil", unit: "Apartats 2.3 i 2.4", kind: "quiz", points: 200, color: "blue", icon: "shield" },
    { id: "f3", n: 3, short: "Ajuda humanitària", title: "L'ajuda humanitària", unit: "Apartat 2.5", kind: "dnd", points: 250, color: "green", icon: "hands" },
    { id: "f4", n: 4, short: "Casos en 3D", title: "Casos pràctics en 3D", unit: "Tota la unitat 2", kind: "cases", points: 350, color: "purple", icon: "cube" },
    { id: "f5", n: 5, short: "Resultats", title: "Resultats i repàs", unit: "Abans de l'examen", kind: "results", points: 0, color: "ink", icon: "flag" }
  ];

  /* ------------------------------------------------------------ BRIEFINGS (teoria abans de cada fase) */
  var BRIEF = {
    f1: {
      lead: "Tot desastre passa per cinc fases, i gestionar-lo vol dir planificar què fem abans, durant i després.",
      blocks: [
        { h: "Les cinc fases", items: [
          "**Interdesastres**: no hi ha cap amenaça a la vista. És el temps per preparar-se i fer el **pla d'emergència**.",
          "**Alerta (predesastre)**: el succés és imminent o molt probable. S'avisa la població i es **preactiven els equips**.",
          "**Impacte**: el succés passa. S'activa el pla i s'apliquen les **mesures de protecció**.",
          "**Emergència (socors o aïllament)**: just després. El més urgent: **rescats i atenció sanitària**; recursos locals i ajuda externa.",
          "**Reconstrucció**: deixar la zona **com estava abans** del succés."] },
        { h: "La gestió del desastre", items: [
          "Segons l'ONU, és l'**organització, planificació i aplicació** de mesures de **preparació, resposta i recuperació**.",
          "**Preparació**: eliminar el risc o mitigar-ne els efectes (inclou la monitorització de paràmetres). **Resposta**: durant el succés i just després. **Recuperació**: després.",
          "Plans locals: **territorials**, **especials** (un risc concret) i **d'autoprotecció** (activitats que poden originar emergències).",
          "On no hi ha protecció civil ni recursos mínims, organitzen la resposta les **organitzacions humanitàries**, amb **protocols generals**."] }
      ],
      examples: [
        { img: "th-f1a", cap: "Alerta: dades d'un temporal que arribarà en poques hores." },
        { img: "th-f1b", cap: "Emergència: rescats i atenció sanitària just després del succés." }
      ],
      how: ["10 preguntes amb una imatge cadascuna.", "Mira la imatge, llegeix la pregunta i tria una de les 4 respostes.", "Després de respondre veuràs si és correcta i per què.", "Cada encert val 20 punts. No resta."]
    },
    f2: {
      lead: "Quan passa una emergència, primer es truca a un número i després actua tot un sistema: la protecció civil.",
      blocks: [
        { h: "Dos models de sistemes d'emergències", items: [
          "**Model europeu** (excepte el Regne Unit): **112** com a número únic; el centre **valora la demanda** en el moment de la trucada.",
          "**Model angloamericà**: la central **transfereix** la demanda; **sense regulació sanitària**; hi destaquen els **paramèdics**.",
          "**Teoria de la rutina diària**: els mateixos equips de cada dia han d'estar preparats per a situacions extraordinàries.",
          "A Espanya, el servei 112 el presten les **comunitats autònomes**, amb personal sanitari que valora les demandes."] },
        { h: "La protecció civil", items: [
          "Protegeix **persones, béns i medi ambient** davant el greu risc col·lectiu, les catàstrofes i les calamitats. Actua abans, durant i després.",
          "Sis funcions: **previsió, prevenció, planificació, intervenció, informació i rehabilitació**.",
          "Àmbits: **municipal** (PEM i voluntaris), **autonòmic** (pla territorial i especials) i **estatal** (Direcció General). Els coordina el **Consell Nacional de Protecció Civil**.",
          "La **UME** es pot sol·licitar i dirigeix les emergències d'interès nacional, però **no forma part** del Sistema Nacional. La **Creu Roja** gestiona albergs i abastiment."] }
      ],
      examples: [
        { img: "th-f2a", cap: "Centre 112: es valora la demanda en el moment de la trucada." },
        { img: "th-f2b", cap: "Voluntaris de protecció civil en un dispositiu municipal." }
      ],
      how: ["10 preguntes amb una imatge cadascuna.", "Tria una de les 4 respostes; pots fer servir les tecles 1–4.", "Llegeix l'explicació abans de continuar.", "Cada encert val 20 punts. No resta."]
    },
    f3: {
      lead: "Quan un país no pot fer front a un desastre, arriba l'ajuda humanitària: qui la dona, amb quins principis i amb quines normes.",
      blocks: [
        { h: "Ajuda i acció humanitària", items: [
          "**Ajuda humanitària**: garantir a les víctimes l'accés a **serveis bàsics** (atenció mèdica, aliment, aigua i refugi).",
          "**Acció humanitària**: concepte més ampli; també **protegeix**, **prevé** i defensa la **dignitat i els drets**.",
          "**Principis**: humanitat, neutralitat, imparcialitat i independència operativa.",
          "**Necessitats bàsiques**: atenció sanitària, aigua potable, aliment i abric."] },
        { h: "Qui hi intervé i amb quines normes", items: [
          "Poden intervenir quan el país, o l'ONU en nom seu, llança una **crida internacional d'emergència**.",
          "**Governamentals** (AECID) · **intergovernamentals** (ONU: OCHA, PMA, ACNUR, UNICEF, OMS…; UE: ECHO) · **ONG** (Creu Roja, MSF…).",
          "**Esfera** (1997): qualitat i rendició de comptes. **Ginebra**, **la Haia**, **TPI**, **TEDH** i **RSI** formen el marc legal.",
          "El dret internacional prioritza la **sobirania de l'Estat** per sobre del dret a rebre assistència."] }
      ],
      examples: [
        { img: "th-f3a", cap: "Distribució d'aigua potable i abric en un campament." },
        { img: "th-f3b", cap: "Equips internacionals coordinats sobre el terreny." }
      ],
      how: ["3 taulers. Arrossega cada targeta a la seva caixa.", "Sense ratolí: toca una targeta i després la caixa (o fes servir Tab i Retorn).", "Prem «Comprova» quan les hagis col·locat totes: veuràs encerts i errors.", "Cada targeta ben col·locada val 10 punts."]
    },
    f4: {
      lead: "Ara ho apliques tot en dos casos. Explora cada escena en 3D, obre els punts d'informació i pren les decisions.",
      blocks: [
        { h: "Cas A · Riuada a Riubaix", items: [
          "Un poble a la vora d'un riu. Avança la línia del temps i mira com canvia l'escena.",
          "Decideix en **quina fase** està cada moment, **qui ha de tenir un pla d'autoprotecció** i quina **funció de protecció civil** fa cada actuació."] },
        { h: "Cas B · Terratrèmol a l'estranger", items: [
          "Un país amb pocs recursos demana ajuda. Hi ha un campament humanitari.",
          "Decideix **com pot entrar l'ajuda**, quina **necessitat bàsica** cobreix cada zona del campament, **quin actor** fa cada tasca i quin **principi** cal respectar."] }
      ],
      examples: [
        { img: "th-f4a", cap: "Poble inundat: cal saber en quina fase som." },
        { img: "th-f4b", cap: "Campament humanitari amb hospital de campanya." }
      ],
      how: ["Arrossega per girar l'escena, roda o pessiga per apropar-te.", "Toca els triangles taronja per obrir la informació.", "Respon les decisions del panell. Cada cas val 175 punts.", "Si l'escena 3D no es pot carregar, tens una vista en imatge amb els mateixos punts."]
    }
  };

  /* ------------------------------------------------------------ F1 i F2: 20 preguntes amb imatge */
  var Q = {
    f1: [
      { img: "f1-q1", topic: "T1", prompt: "Civil protection volunteers checking an orderly warehouse of emergency supplies (blankets, water, first-aid kits) on a calm sunny day, inventory clipboard",
        q: "Uns voluntaris revisen i compten el material d'emergència en un dia tranquil, sense cap amenaça a la vista. En quina fase del desastre som?",
        o: ["Interdesastres", "Alerta", "Impacte", "Reconstrucció"], a: 0,
        why: "Si no hi ha cap succés ni dades que en prevegin un, som a la fase d'interdesastres: el temps per preparar-se." },
      { img: "f1-q2", topic: "T1", prompt: "Meteorologist looking at a large weather radar screen showing a huge storm approaching the coast, colleague on the phone, tense atmosphere",
        q: "Les dades meteorològiques indiquen que un temporal arribarà d'aquí a poques hores. Què fan les autoritats en aquesta fase?",
        o: ["Reconstrueixen els serveis bàsics", "Emeten una alerta: informen la població i preactiven els equips", "Demanen la retirada dels equips", "Esperen que passi el succés per actuar"], a: 1,
        why: "És la fase d'alerta (predesastre): s'informa la població, s'adopten mesures preventives i es preactiven els equips segons el pla." },
      { img: "f1-q3", topic: "T1", prompt: "Strong earthquake moment in a small town street, dust cloud, cracked facades, people running to an open square, dramatic but no injuries visible",
        q: "La terra tremola en aquest moment i els edificis s'esquerden. Què ha de fer el sistema local d'emergències durant aquesta fase?",
        o: ["Activar el pla, aplicar mesures de protecció i seguir el succés", "Fer el pla d'emergència des de zero", "Tornar a obrir les escoles", "Avaluar quin principi humanitari s'aplica"], a: 0,
        why: "A la fase d'impacte s'activa el pla: mesures de protecció, seguiment del succés (velocitat, intensitat, durada) i recollida d'informació al centre coordinador." },
      { img: "f1-q4", topic: "T1", prompt: "Rescue team in helmets carrying a survivor on a stretcher out of building rubble, paramedics waiting with equipment, just after a disaster",
        q: "Just després del succés. Quines són les necessitats més urgents en l'àmbit sanitari?",
        o: ["Reconstruir habitatges i escoles", "Redactar un nou pla d'emergència", "Els rescats i l'atenció sanitària de les persones afectades", "Emetre l'alerta a la població"], a: 2,
        why: "A la fase d'emergència (socors o aïllament) el més urgent són els rescats i l'atenció sanitària, amb els recursos locals i l'ajuda externa necessària." },
      { img: "f1-q5", topic: "T1", prompt: "Months after a disaster, construction workers rebuilding houses and a school in a village, scaffolding, cranes, residents returning, sunny",
        q: "Uns mesos després es reconstrueixen cases i escoles. Quin és l'objectiu d'aquesta fase?",
        o: ["Rescatar les persones atrapades", "Deixar la zona tal com estava abans del succés", "Avisar la població del perill", "Classificar els ferits"], a: 1,
        why: "La fase de reconstrucció (recuperació o rehabilitació) vol que la població torni a tenir els serveis i les infraestructures d'abans." },
      { img: "f1-q6", topic: "T2", prompt: "Automatic river level monitoring station with solar panel and sensor on a bridge over a calm river, technician checking a tablet",
        q: "S'instal·len sensors que mesuren contínuament el nivell del riu. Quin tipus de mesura és?",
        o: ["De preparació", "De resposta", "De recuperació", "De reconstrucció"], a: 0,
        why: "Monitoritzar paràmetres és una part important de la preparació: ajuda a detectar el risc a temps i a mitigar-ne els efectes." },
      { img: "f1-q7", topic: "T2", prompt: "Firefighters evacuating residents with a boat in a flooded street while it is still raining heavily",
        q: "Mentre el riu es desborda, els bombers evacuen els veïns. Quan s'apliquen les mesures de resposta?",
        o: ["Anys abans del succés", "Durant el succés i immediatament després", "Només quan s'ha reconstruït la zona", "Mai: no formen part de la gestió"], a: 1,
        why: "Les mesures de resposta es posen en pràctica durant el succés i just després; les de recuperació, després." },
      { img: "f1-q8", topic: "T2", prompt: "Aerial view of a chemical industrial plant with storage tanks next to a small town, clear day",
        q: "Aquesta planta química pot originar una emergència. Quin pla està obligada a elaborar?",
        o: ["El pla territorial de la comunitat autònoma", "Un pla d'autoprotecció", "Un protocol general d'actuació internacional", "El pla especial d'inundacions"], a: 1,
        why: "Els plans d'autoprotecció són obligatoris per a les infraestructures o espais amb activitats que poden originar situacions d'emergència." },
      { img: "f1-q9", topic: "T2", prompt: "Emergency planning meeting around a table with a large regional map showing flood zones in blue, planners with folders",
        q: "Una comunitat autònoma redacta un pla dedicat només al risc d'inundacions. Quin tipus de pla és?",
        o: ["Un pla especial", "Un pla territorial", "Un pla d'autoprotecció", "Un protocol de l'ONU"], a: 0,
        why: "Els plans especials es refereixen a riscos concrets; el pla territorial serveix per a qualsevol emergència dins un territori." },
      { img: "f1-q10", topic: "T2", prompt: "International humanitarian team unloading supplies from an off-road truck in a remote village with no infrastructure, dirt road, mountains",
        q: "Un desastre afecta una zona sense sistema de protecció civil ni recursos mínims. Qui organitza la resposta?",
        o: ["L'ajuntament del municipi més proper", "Les organitzacions humanitàries, amb protocols generals d'actuació", "Ningú: s'espera la reconstrucció", "El centre 112 d'una altra comunitat"], a: 1,
        why: "On no hi ha protecció civil ni recursos mínims, la resposta l'organitzen les organitzacions humanitàries, que fan servir protocols generals perquè no poden planificar en detall." }
    ],
    f2: [
      { img: "f2-q1", topic: "T3", prompt: "Emergency call centre operator with headset taking a call, screens with maps, modern European dispatch room",
        q: "En el model europeu, què fa el centre que rep la trucada d'emergència?",
        o: ["Només passa la trucada al servei que toca", "Valora la demanda en el moment de la trucada i orienta qui truca", "Envia sempre una ambulància, sense preguntar", "Deriva la trucada a la Creu Roja"], a: 1,
        why: "Els centres de recepció de trucades del model europeu valoren la demanda en el moment de la trucada i donen orientació i suport a la persona." },
      { img: "f2-q2", topic: "T3", prompt: "Two paramedics in dark blue uniforms with a stretcher next to a generic ambulance in a North American suburban street, no text no logos",
        q: "Quin és el fet diferencial del model angloamericà de sistemes d'emergències?",
        o: ["El número únic 112", "L'absència de regulació sanitària de la demanda", "Que no aplica mai la rutina diària", "Que el gestiona la Unió Europea"], a: 1,
        why: "Al model angloamericà les centrals transfereixen la demanda sense regulació sanitària, i hi destaquen els paramèdics." },
      { img: "f2-q3", topic: "T3", prompt: "Ambulance crew training with a mass-casualty drill, practicing triage with tarps and equipment, same everyday ambulance in background",
        q: "Els mateixos equips d'ambulància de cada dia practiquen una simulació de catàstrofe. Quina idea hi ha al darrere?",
        o: ["La teoria de la rutina diària", "El principi de neutralitat", "El pla d'autoprotecció", "La fase de reconstrucció"], a: 0,
        why: "Segons la teoria de la rutina diària, els equips que treballen cada dia en situacions habituals han d'estar preparats per a les extraordinàries." },
      { img: "f2-q4", topic: "T3", prompt: "Stylised map of Spain divided into autonomous communities with small emergency phone icons in each region, clean infographic style, no text",
        q: "A Espanya, a qui correspon prestar el servei 112?",
        o: ["A l'Administració General de l'Estat", "A cada comunitat autònoma", "A la Unió Europea", "A cada hospital"], a: 1,
        why: "La prestació del 112 correspon a les comunitats autònomes: cada una gestiona el seu sistema de salut i el seu centre coordinador." },
      { img: "f2-q5", topic: "T4", prompt: "Civil protection technicians studying a hazard map of a town with risk zones highlighted, measuring and analysing, office",
        q: "Uns tècnics identifiquen quins riscos té el municipi, els avaluen i en preveuen l'impacte. Quina funció de protecció civil és?",
        o: ["Previsió", "Rehabilitació", "Intervenció", "Informació"], a: 0,
        why: "La previsió identifica el risc, l'avalua i en coneix l'impacte en el territori." },
      { img: "f2-q6", topic: "T4", prompt: "Forest fire watchtower on a hill in a Mediterranean pine forest, a lookout with binoculars, summer",
        q: "A l'estiu, un vigilant observa el bosc des d'una torre per detectar de seguida qualsevol fum. Quina funció és?",
        o: ["Planificació", "Prevenció", "Rehabilitació", "Previsió"], a: 1,
        why: "La prevenció són actuacions de vigilància per disminuir el risc i detectar-lo de seguida." },
      { img: "f2-q7", topic: "T4", prompt: "Civil protection volunteer giving a self-protection talk to teenagers in a classroom with simple pictogram posters, no text",
        q: "Una campanya ensenya a l'alumnat què ha de fer per protegir-se en una emergència. Quina funció és?",
        o: ["Intervenció", "Informació", "Previsió", "Prevenció"], a: 1,
        why: "La informació fomenta l'autoprotecció de la ciutadania donant a conèixer les mesures de prevenció i d'actuació." },
      { img: "f2-q8", topic: "T4", prompt: "Electric company workers in a bucket truck restoring power lines in a town after a storm, debris cleared, overcast",
        q: "Després de l'emergència es restableix la llum i s'atén els damnificats. Quina funció és?",
        o: ["Rehabilitació", "Planificació", "Prevenció", "Previsió"], a: 0,
        why: "La rehabilitació restableix els serveis essencials, valora els danys i dona suport als damnificats." },
      { img: "f2-q9", topic: "T4", prompt: "Town hall meeting room where the mayor and municipal civil protection volunteers in orange vests review an emergency plan binder",
        q: "Què ha de tenir cada municipi en l'àmbit municipal de la protecció civil?",
        o: ["Un pla d'emergència municipal (PEM)", "Una unitat militar pròpia", "Un tribunal d'emergències", "Una oficina de l'ACNUR"], a: 0,
        why: "Cada municipi ha de disposar d'un Pla d'Emergència Municipal i sovint té agrupacions de voluntaris de protecció civil." },
      { img: "f2-q10", topic: "T4", prompt: "Military emergency unit trucks and soldiers in yellow-green emergency gear helping in a flooded town, no insignia, no flags, no text",
        q: "Quina d'aquestes afirmacions sobre la UME és correcta?",
        o: ["Forma part del Sistema Nacional de Protecció Civil", "Només pot actuar fora d'Espanya", "Assumeix la direcció operativa en una emergència d'interès nacional", "La gestiona la Creu Roja"], a: 2,
        why: "La UME és un recurs mobilitzable (la protecció civil autonòmica en pot demanar la col·laboració) i dirigeix les emergències d'interès nacional, però no forma part del Sistema Nacional." }
    ]
  };

  /* ------------------------------------------------------------ F3: drag and drop */
  var DND = [
    { id: "actors", title: "Classifica els actors", topic: "T6",
      intro: "Arrossega cada organització al tipus que li correspon.",
      bins: [ { id: "G", name: "Governamental", hint: "Organisme oficial d'un país" }, { id: "OIG", name: "Intergovernamental", hint: "Col·laboració entre països" }, { id: "ONG", name: "No governamental", hint: "Social, independent, sense ànim de lucre" } ],
      cards: [
        { t: "AECID", bin: "G" }, { t: "OCHA (ONU)", bin: "OIG" }, { t: "Programa Mundial d'Aliments", bin: "OIG" }, { t: "ACNUR", bin: "OIG" }, { t: "UNICEF", bin: "OIG" },
        { t: "ECHO (Unió Europea)", bin: "OIG" }, { t: "Creu Roja", bin: "ONG" }, { t: "Metges Sense Fronteres", bin: "ONG" }, { t: "Metges del Món", bin: "ONG" }, { t: "Acció contra la Fam", bin: "ONG" } ] },
    { id: "principis", title: "Quin principi es respecta?", topic: "T5",
      intro: "Cada situació mostra com es compleix un principi de l'acció humanitària. Arrossega-la al principi que hi correspon.",
      bins: [ { id: "HUM", name: "Humanitat" }, { id: "NEU", name: "Neutralitat" }, { id: "IMP", name: "Imparcialitat" }, { id: "IND", name: "Independència operativa" } ],
      cards: [
        { t: "Protegeix la vida i la salut, i també el respecte de cada persona afectada.", bin: "HUM" },
        { t: "Abans de fer fotos per a una campanya, l'equip demana permís i preserva la dignitat dels ferits.", bin: "HUM" },
        { t: "En una guerra, l'ONG no fa cap declaració a favor de cap bàndol.", bin: "NEU" },
        { t: "L'equip evita qualsevol gest que es pugui interpretar com a suport a una part del conflicte.", bin: "NEU" },
        { t: "S'atén primer qui està més greu, sense mirar-ne l'origen ni la religió.", bin: "IMP" },
        { t: "L'aigua es reparteix segons la necessitat de cada família, sense discriminació.", bin: "IMP" },
        { t: "L'ONG rebutja uns diners que li exigien treballar només on interessava a un govern.", bin: "IND" },
        { t: "Les decisions es prenen sense objectius polítics, econòmics ni militars.", bin: "IND" } ] },
    { id: "legal", title: "Qualitat i marc legal", topic: "T7",
      intro: "Arrossega cada norma o institució a la descripció que li correspon.",
      bins: [
        { id: "GIN", name: "Tractats per minimitzar els efectes de la guerra sobre soldats i civils" },
        { id: "HAI", name: "Reglamentació de la guerra i creació d'un tribunal internacional d'arbitratge" },
        { id: "TPI", name: "Jutja els crims comesos en els conflictes armats" },
        { id: "TEDH", name: "Rep denúncies per violacions de la Convenció Europea de Drets Humans" },
        { id: "RSI", name: "196 països, coordinats per l'OMS, detecten i notifiquen riscos de salut pública" },
        { id: "ESF", name: "Millorar la qualitat de l'ajuda i la rendició de comptes (1997)" },
        { id: "CNU", name: "Recull com resoldre pacíficament els conflictes entre Estats" } ],
      cards: [
        { t: "Convenció de Ginebra", bin: "GIN" }, { t: "Convenció de la Haia", bin: "HAI" }, { t: "Tribunal Penal Internacional", bin: "TPI" },
        { t: "Tribunal Europeu de Drets Humans", bin: "TEDH" }, { t: "Reglament Sanitari Internacional", bin: "RSI" }, { t: "Projecte Esfera", bin: "ESF" }, { t: "Carta de les Nacions Unides", bin: "CNU" } ] }
  ];

  /* ------------------------------------------------------------ F4: casos 3D */
  var CASES = [
    { id: "A", title: "Riuada a Riubaix", scene: "flood", points: 175,
      intro: "Riubaix (municipi fictici, 4.800 habitants) és a la vora del riu Baix. Hi ha una escola, una residència de gent gran, una planta química al polígon i un pont que és l'única sortida per carretera.",
      hotspots: [
        { id: "riu", label: "El riu Baix", fx: 48.7, fy: 33.3, text: "Un sensor mesura el nivell del riu cada 10 minuts. Quan supera el llindar, avisa el centre de coordinació." },
        { id: "quimica", label: "Planta química", fx: 40, fy: 16.5, text: "Fabrica i emmagatzema productes químics. Si l'aigua hi arriba, hi podria haver una fuita." },
        { id: "escola", label: "Escola", fx: 56.9, fy: 60.1, text: "Té 300 alumnes. Fa simulacres dos cops l'any." },
        { id: "residencia", label: "Residència", fx: 66.3, fy: 80.8, text: "Hi viuen 60 persones grans, moltes amb mobilitat reduïda." },
        { id: "pont", label: "El pont", fx: 56.2, fy: 44.8, text: "És l'única sortida per carretera. Si cau, el poble queda aïllat." } ],
      timeline: [
        { label: "Fa un any", text: "L'ajuntament actualitza el pla i forma els voluntaris. Ni rastre de pluja.", level: 0, answer: "inter" },
        { label: "Dilluns 18:00", text: "Avís meteorològic: pluges torrencials d'aquí a 12 hores. Es preactiven els equips.", level: 0.15, answer: "alerta" },
        { label: "Dimarts 06:00", text: "El riu es desborda i l'aigua entra als carrers baixos.", level: 0.75, answer: "impacte" },
        { label: "Dimarts 10:00", text: "El pont ha caigut. Rescats amb barca i atenció dels ferits.", level: 0.6, answer: "emergencia" },
        { label: "Tres mesos després", text: "Es reconstrueix el pont i les famílies tornen a casa.", level: 0, answer: "recon" } ],
      phases: [ ["inter", "Interdesastres"], ["alerta", "Alerta"], ["impacte", "Impacte"], ["emergencia", "Emergència"], ["recon", "Reconstrucció"] ],
      tasks: [
        { id: "A1", type: "timeline", topic: "T1", pts: 75, q: "Mou la línia del temps. Per a cada moment, tria en quina fase del desastre és Riubaix. (15 punts per moment)" },
        { id: "A2", type: "pick", topic: "T2", pts: 40, q: "Toca a l'escena l'edifici que, per l'activitat que s'hi fa, pot originar ell mateix una emergència i, per tant, ha d'elaborar un pla d'autoprotecció.", answer: "quimica",
          why: "La planta química fa una activitat que pot originar una emergència: ha de tenir un pla d'autoprotecció." },
        { id: "A3", type: "match", topic: "T4", pts: 60, q: "Quina funció de protecció civil fa cada actuació? (20 punts per encert)",
          items: [ { t: "Estudiar quines zones del poble s'inunden i avaluar-ne el risc.", a: "Previsió" },
                   { t: "Els missatges als mòbils amb consells per protegir-se.", a: "Informació" },
                   { t: "Tornar a obrir el pont i donar suport a les famílies afectades.", a: "Rehabilitació" } ],
          options: ["Previsió", "Prevenció", "Planificació", "Intervenció", "Informació", "Rehabilitació"] } ] },
    { id: "B", title: "Terratrèmol a Kalami", scene: "camp", points: 175,
      intro: "Un terratrèmol ha destruït bona part de Kalami, la capital d'un país fictici amb pocs recursos. Hi ha milers de persones sense casa i l'aigua està contaminada. S'ha muntat un campament.",
      hotspots: [
        { id: "hospital", label: "Hospital de campanya", fx: 49.6, fy: 41.8, text: "Tendes amb quiròfan i llits. Atén els ferits i vacuna per evitar epidèmies." },
        { id: "aigua", label: "Planta d'aigua", fx: 68.1, fy: 25.2, text: "Potabilitza l'aigua del riu per a tot el campament." },
        { id: "tendes", label: "Zona de tendes", fx: 35.9, fy: 73.3, text: "Tendes i mantes per a les famílies que han perdut la casa." },
        { id: "magatzem", label: "Magatzem d'aliments", fx: 15.4, fy: 44.6, text: "Arriben camions amb sacs d'arròs i farina." },
        { id: "infants", label: "Espai per a infants", fx: 70.4, fy: 42.9, text: "Infants que han perdut el contacte amb la seva família." } ],
      tasks: [
        { id: "B1", type: "choice", topic: "T7", pts: 35, q: "Què ha de fer el país perquè les organitzacions internacionals hi puguin entrar?",
          options: ["Res: les organitzacions entren sempre que volen", "Llançar una crida internacional d'emergència (o que la faci l'ONU en nom seu)", "Demanar permís al Tribunal Penal Internacional", "Esperar la fase de reconstrucció"], a: 1,
          why: "Les organitzacions d'ajuda només poden actuar quan el país, o l'ONU en nom seu, llança una crida internacional: el dret internacional prioritza la sobirania de l'Estat." },
        { id: "B2", type: "need", topic: "T5", pts: 60, q: "Toca cada zona del campament i digues quina necessitat bàsica cobreix. (15 punts per zona)",
          items: [ { spot: "hospital", a: "Atenció sanitària" }, { spot: "aigua", a: "Aigua potable" }, { spot: "tendes", a: "Abric" }, { spot: "magatzem", a: "Aliment" } ],
          options: ["Atenció sanitària", "Aigua potable", "Aliment", "Abric"] },
        { id: "B3", type: "match", topic: "T6", pts: 50, q: "Quin organisme de l'ONU fa cada tasca? (12,5 punts per encert)",
          items: [ { t: "Coordina tota la intervenció humanitària internacional.", a: "OCHA" }, { t: "Fa arribar els aliments en menys de 48 hores.", a: "PMA" },
                   { t: "Protegeix les persones desplaçades que han hagut de fugir.", a: "ACNUR" }, { t: "Atén els infants separats de la família.", a: "UNICEF" } ],
          options: ["OCHA", "PMA", "ACNUR", "UNICEF", "OMS"] },
        { id: "B4", type: "choice", topic: "T5", pts: 30, q: "Un grup armat ofereix escorta al campament si només s'atén la gent del seu poble. Què ha de fer l'organització?",
          options: ["Acceptar-ho: així el campament és més segur", "Rebutjar-ho: l'ajuda es dona segons la necessitat i sense afavorir cap part", "Atendre primer la gent del grup armat i després la resta", "Tancar el campament"], a: 1,
          why: "Acceptar-ho vulneraria la imparcialitat (ajuda segons la necessitat, sense discriminació), la neutralitat i la independència operativa." } ] }
  ];

  return { TOPICS: TOPICS, PHASES: PHASES, BRIEF: BRIEF, Q: Q, DND: DND, CASES: CASES };
})();
