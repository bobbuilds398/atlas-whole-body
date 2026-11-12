/* Atlas du corps — langue de l'interface (français ou anglais).
   Choix : ?lang=fr|en dans l'adresse, sinon le dernier choix enregistré, sinon la langue du navigateur
   (français si elle est préférée au français et à l'anglais, anglais pour toute autre langue).
   Les contenus anglais sont dans content/en/*.json (fusionnés par js/atlas.js) et js/hip-en.js. */
(function () {
  'use strict';
  const ok = l => l === 'fr' || l === 'en';
  let lang = null;
  try {
    const q = new URLSearchParams(location.search).get('lang');
    if (ok(q)) {
      lang = q;
      try { localStorage.setItem('atlas-lang', q); } catch (e) {}
    }
  } catch (e) {}
  if (!lang) try { const s = localStorage.getItem('atlas-lang'); if (ok(s)) lang = s; } catch (e) {}
  if (!lang) {
    const prefs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'fr'])
      .map(l => String(l).slice(0, 2).toLowerCase());
    lang = prefs.find(ok) || 'en';
  }
  window.LANG = lang;
  document.documentElement.lang = lang;

  /* textes fixes de index.html, appliqués en anglais (le français est dans la page) */
  const EMERG = 'Emergency: <b>112</b> in Europe (in France also <b>15</b>), <b>999</b> in the UK, <b>911</b> in the US and Canada, or your local number';
  const HTML_EN = {
    h1: 'Body Atlas',
    chooseZone: 'Choose an area:',
    urg1: '<strong>Pain after an accident or a fall, chest pain, shortness of breath, loss of strength or feeling, difficulty passing urine, fever with a hot joint? Do not use this site: call emergency services now</strong> (112 in Europe, 15 in France, 999 in the UK, 911 in the US and Canada). Deaf or hard of hearing in France: 114 by text. <a href="about.html#emergency">All warning signs</a>',
    urg2: 'General information, not medical advice. The cards were written with an AI (Claude, by Anthropic) and <strong>have not yet been reviewed by health professionals</strong>. The atlas cannot tell you what you have. Original version in French. <a href="about.html">About</a>',
    show: 'Show:',
    filterSum: 'Filter the cards (area, moment)',
    where: 'Where it hurts',
    when: 'Moment or movement that triggers it',
    clearAll: 'Clear all',
    filterNote: 'This filter shows the cards that mention these clues. It does not tell you what you have: other causes, not in the atlas, can give the same pain.',
    vFace: 'Front', vSide: 'Side', vBack: 'Back', vIn: 'Inner side',
    loadSkel: 'Loading the skeleton…',
    recenter: 'Recentre',
    foot1: '<strong>General information, not medical advice</strong>: cards written with an AI (Claude, by Anthropic), not reviewed by health professionals. ' + EMERG + '. <a href="about.html">About · legal notice · privacy</a>. Content v0.3.0 of 12 November 2026, translated from French.',
    foot2: 'Whole-body figures: each figure comes from a published study, cited on the card (<span id="b-src"></span>). These studies do not all measure the same thing: people in pain at a given moment, new cases in a year, or a deformity that is often painless; the world population or a single country; all ages or certain age groups. That is why the pains are grouped by order of magnitude: within a group, the order is not meaningful. Shares taken from the GBD 2021 world totals are related to the 2020 world population (7.8 billion). Within each joint, the order of the pains is an estimate, without a published figure: it varies a lot with age and sport.',
    foot3: '3D anatomy adapted from <a href="https://github.com/Z-Anatomy/Models-of-human-anatomy">Z-Anatomy</a> (Gauthier Kervyn et al., <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>), itself derived from <a href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html">BodyParts3D</a> (© The Database Center for Life Science, <a href="https://creativecommons.org/licenses/by-sa/2.1/jp/">CC BY-SA 2.1 Japan</a>); models of a single individual, selected, simplified and modified: they do not replace imaging. A few structures are schematic outlines, labelled as such. Atlas texts and models under <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>, code under the MIT licence, on <a href="https://github.com/bobbuilds398/atlas-whole-body">GitHub</a>: <a href="https://github.com/bobbuilds398/atlas-whole-body/blob/main/CONTRIBUTING.md">corrections welcome</a>. Video links open a YouTube search, not checked: if a video does not match the written instructions, follow the written instructions.',
    gbtn: '<i></i>Glossary <kbd>G</kbd>',
    hipListH: 'Common pains',
    hipNote: 'From most to least common, an estimate without a published figure. The order varies a lot with age and sport.',
    hipChild: 'A child or teenager who limps, or has pain in the hip, thigh or knee without an obvious cause: see a doctor. Hip pain can be felt in the knee.',
    hipFilterSum: 'Filter the cards (word, area, moment)',
    searchLabel: 'Search for a word in the cards',
    hipFilterNote: 'This filter shows the cards that contain these words or clues. It does not tell you what you have: other causes, not in the atlas, can give the same pain.',
    glossary: 'Glossary',
    mvb: '<i></i>Movement and cross-section',
    r1: 'Flexion (knee towards the chest)<output id="o1">0°</output>',
    r2: 'Moving the leg out to the side<output id="o2">0°</output>',
    r3: 'Rotation (− outwards / + inwards)<output id="o3">0°</output>',
    r4: 'Cross-section from front to back<output id="o4">none</output>',
    bump: 'Add a bony bump on the neck (hip impingement)',
    mvr: 'Reset',
    hipHint: 'Tap or hover over a structure or a number to see the painful area; the card appears below.',
    hipFoot2: '3D anatomy adapted from <a href="https://github.com/Z-Anatomy/Models-of-human-anatomy">Z-Anatomy</a> (Gauthier Kervyn et al., <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>), itself derived from <a href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html">BodyParts3D</a> (© The Database Center for Life Science, <a href="https://creativecommons.org/licenses/by-sa/2.1/jp/">CC BY-SA 2.1 Japan</a>); model of a single individual, cut into areas: it does not replace imaging. Cartilage of the head and socket rebuilt from the bone; the sciatic nerve and a few landmarks are schematic outlines. If the model does not load, the page shows a schematic version. Video links open a YouTube search, not checked: if a video does not match the written instructions, follow the written instructions. Texts and models under <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>, code under the MIT licence, on <a href="https://github.com/bobbuilds398/atlas-whole-body">GitHub</a>.'
  };
  const ATTR_EN = {
    navZones: 'Body areas', urgLabel: 'Emergencies and disclaimer', layersLabel: 'Anatomical layers shown',
    listLabel: 'List of pains', cvLabel: '3D anatomical model. The same information is in the list and the card.',
    viewpoint: 'Viewpoint', card: 'Card', searchPh: 'E.g. stairs, groin, running…',
    hipCv: '3D model of the right hip. The same information is in the list and the card.'
  };
  function apply() {
    const sw = document.getElementById('g-lang');
    if (sw) {
      const other = lang === 'en' ? 'fr' : 'en';
      sw.href = '?lang=' + other + location.hash;
      sw.hreflang = other;
      sw.lang = other;
      sw.textContent = other === 'en' ? 'English' : 'Français';
      sw.addEventListener('click', e => {
        try { localStorage.setItem('atlas-lang', other); } catch (err) {}
        /* garder la vue ouverte (#genou/menisque) en changeant de langue */
        e.preventDefault();
        location.href = location.pathname + '?lang=' + other + location.hash;
      });
    }
    if (lang !== 'en') return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = HTML_EN[el.getAttribute('data-i18n')];
      if (v != null) el.innerHTML = v;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      el.getAttribute('data-i18n-attr').split(';').forEach(p => {
        const [a, k] = p.split(':');
        if (ATTR_EN[k] != null) el.setAttribute(a, ATTR_EN[k]);
      });
    });
    document.title = 'Body Atlas';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();

  /* textes produits par js/atlas.js */
  const FR = {
    site: 'Atlas du corps',
    newTab: ' (nouvel onglet)',
    rules: {
      standard: '<b>Jusqu’où aller ?</b> Pendant l’exercice, une gêne jusqu’à 3 sur 10 est acceptable (0 = aucune douleur, 10 = la pire imaginable) si elle est revenue à son niveau habituel le lendemain matin. À 4 ou 5, réduisez la charge ou l’amplitude. Arrêtez et demandez un avis en cas de fourmillements qui augmentent, de perte de force, de blocage ou de dérobement.',
      nerf: '<b>Repère pour les nerfs.</b> Le mouvement reste doux. Il ne doit ni réveiller ni augmenter les fourmillements, l’engourdissement ou la douleur qui descend dans le membre. Si c’est le cas, faites plus petit ou arrêtez.',
      avis: '<b>Avis médical d’abord.</b> Cette situation demande un examen avant tout exercice. Les conseils ci-dessous ne s’appliquent qu’avec l’accord du médecin ou du kinésithérapeute qui vous suit.'
    },
    urgent: /15 ou 112|urgences|en urgence/i,
    rapide: /le jour même|rapidement|sans attendre|24 à 48 heures|dans les jours|dans la semaine/i,
    urgLabel: { urgent: 'Signes d’urgence', rapide: 'Consulter rapidement si…', info: 'Quand consulter' },
    call: 'Urgence vitale : appelez le <b>15</b> (SAMU) ou le <b>112</b>.',
    fixQ: 'Une erreur, une précision, une meilleure vidéo ?',
    fixA: 'Proposer une correction pour cette fiche',
    fixNote: '(compte GitHub gratuit nécessaire)',
    freq: ['Très fréquente', 'Fréquente', 'Moins fréquente', 'Plus rare'],
    grp: {
      instant: ['Ont mal en ce moment', 'À un instant donné ou au cours du dernier mois'],
      annee: ['Nouveaux cas chaque année', 'Ne se compare pas avec le groupe du dessus'],
      deformation: ['Déformations fréquentes', 'Souvent sans douleur']
    },
    tiers: ['Plus de 3 sur 100', '1 à 3 sur 100', 'Moins de 1 sur 100'],
    per1000: n => 'Environ ' + n + ' sur 1 000',
    per100: n => 'Environ ' + n + ' sur 100',
    num: 'fr-FR',
    no3d: 'L’affichage 3D n’est pas disponible sur cet appareil. La liste des douleurs, les explications et les exercices restent accessibles.',
    skelFail: 'Le squelette n’a pas pu être chargé. Les repères numérotés et les fiches restent utilisables.',
    layers: { os: 'Os', cart: 'Cartilages, disques et ménisques', syn: 'Bourses et gaines', lig: 'Ligaments', ten: 'Tendons', mus: 'Muscles', nerf: 'Nerfs', peau: 'Peau' },
    discs: 'Disques intervertébraux', bone: 'Os',
    match: n => (n > 1 ? n + ' fiches mentionnent' : '1 fiche mentionne') + ' au moins un de ces repères. Elles restent dans l’ordre habituel de la liste. Ce n’est pas un diagnostic : seul un examen permet de trancher.',
    noMatch: 'Aucune fiche de cette liste ne mentionne ces repères. Si la douleur est forte, inhabituelle ou s’aggrave, consultez.',
    whole: 'Corps entier',
    shown: 'Fiche affichée : ',
    unavailable: '<h2>Vue indisponible</h2><p>Les structures de cette articulation n’ont pas pu être chargées. Vérifiez votre connexion, puis réessayez.</p>',
    retry: 'Réessayer',
    hip: 'Hanche',
    subHip: 'Hanche droite : les douleurs les plus fréquentes, leurs explications et des exercices.',
    subJoint: s => s + ' : les douleurs les plus fréquentes, leurs explications et des exercices.',
    subHome: 'Où avez-vous mal ? Choisissez une zone du corps pour voir les douleurs les plus fréquentes, des explications et des exercices.',
    nPains: n => n + ' douleurs fréquentes',
    mostCommon: 'Douleurs les plus fréquentes',
    noteJoint: 'Du plus courant au plus rare, selon une estimation sans chiffre publié. L’ordre varie beaucoup selon l’âge et le sport pratiqué.',
    noteHome: 'Regroupées par ordre de grandeur du nombre de personnes concernées. Les études ne mesurent pas toutes la même chose : à l’intérieur d’un groupe, l’ordre n’est pas significatif.',
    hintJointTouch: 'Touchez un numéro ou une ligne pour voir la zone et les exercices. Deux doigts pour tourner et zoomer.',
    hintJoint: 'Passez la souris sur une structure ou un numéro pour voir la zone douloureuse, cliquez pour afficher la fiche. Faites glisser pour tourner, molette pour zoomer.',
    hintHomeTouch: 'Touchez un numéro ou une ligne pour ouvrir l’articulation.',
    hintHome: 'Passez la souris sur un numéro ou une ligne pour voir la zone, cliquez pour ouvrir l’articulation.',
    figYear: 'nouveaux cas par an, selon l’étude citée',
    figDef: 'personnes ayant la déformation, avec ou sans douleur, selon l’étude citée',
    figInst: 'personnes concernées, selon l’étude citée',
    source: 'Source : ',
    marker: 'Repère ',
    no: 'N° ',
    hipHome: '<p>La hanche dispose de son atlas : 13 douleurs, les muscles, tendons et cartilages en 3D, et des exercices par phase.</p>',
    openHip: 'Ouvrir l’atlas de la hanche',
    feel: 'Ce que vous ressentez',
    goJoint: n => 'Voir ' + n.toLowerCase() + ' en détail',
    revBy: n => 'Fiche relue par ' + n,
    notRev: 'Fiche non relue par un professionnel de santé',
    updated: ' · mise à jour le ',
    what: 'Ce qui se passe',
    structs: 'Structures concernées, en couleur sur le modèle :',
    who: 'Qui est concerné',
    exH: 'Exercices souvent proposés',
    exNote: 'Exemples généraux, souvent proposés pour cette douleur. Ils ne remplacent pas un bilan par un médecin ou un kinésithérapeute, qui adapte les exercices à votre cas.',
    seeVideo: 'Voir la vidéo',
    findVideo: 'Chercher une vidéo',
    ytNewTab: ' (YouTube, nouvel onglet)',
    unverified: '· recherche non vérifiée, préférez les vidéos de kinésithérapeutes',
    rest: '<span class="tag" style="--c:var(--cool)"><i></i>Corps entier</span><h2 tabindex="-1">Où a-t-on mal le plus souvent ?</h2>',
    restIntro: n => '<p>' + n + ' douleurs fréquentes des articulations et du dos, regroupées par ordre de grandeur du nombre de personnes concernées. Chaque numéro sur le squelette correspond à une ligne de la liste.</p>',
    restSteps: '<ol class="steps"><li>Choisissez la zone qui fait mal, avec les boutons du haut, la liste ou le squelette.</li><li>Comparez avec les douleurs les plus fréquentes de cette zone.</li><li>Lisez les explications, les exercices et les signes qui doivent faire consulter.</li></ol><p class="warn-lite">Cet atlas informe, il ne pose pas de diagnostic et ne remplace pas un médecin ou un kinésithérapeute.</p>',
    restFigures: '<h3>Comment lire les chiffres</h3><p>Chaque chiffre vient d’une étude publiée, citée dans la fiche. Ces études ne mesurent pas toutes la même chose : personnes qui ont mal à un moment donné, nouveaux cas en un an, ou déformation souvent sans douleur ; population mondiale ou d’un seul pays ; tous âges ou certaines tranches d’âge. C’est pourquoi la liste montre des groupes et des ordres de grandeur, pas un classement exact.</p><p class="sm">Dans chaque articulation, l’ordre des douleurs est une estimation, sans chiffre publié.</p>',
    loadingJoint: '<h2>Chargement de l’articulation…</h2><p class="ns">Muscles, tendons et ligaments arrivent.</p>',
    noneInList: 'Aucune douleur de la liste',
    tipHome: 'Douleurs fréquentes · cliquez pour ouvrir',
    loadFail: '<h2>Chargement impossible</h2><p>Le contenu n’a pas pu être chargé. Vérifiez votre connexion, puis rechargez la page.</p>',
    reload: 'Recharger',
    date: { loc: 'fr-FR' }
  };
  const EN = {
    site: 'Body Atlas',
    newTab: ' (new tab)',
    rules: {
      standard: '<b>How far to go?</b> During the exercise, discomfort up to 3 out of 10 is acceptable (0 = no pain, 10 = the worst imaginable) if it is back to its usual level the next morning. At 4 or 5, reduce the load or the range. Stop and get advice if pins and needles increase, or with loss of strength, locking or giving way.',
      nerf: '<b>Guide for nerves.</b> Keep the movement gentle. It must not bring on or increase pins and needles, numbness or pain running down the limb. If it does, make it smaller or stop.',
      avis: '<b>Medical advice first.</b> This situation needs an examination before any exercise. The advice below only applies with the agreement of the doctor or physiotherapist looking after you.'
    },
    urgent: /\bemergency\b|urgent medical care/i,
    rapide: /same day|promptly|without delay|24 to 48 hours|within days|within the week/i,
    urgLabel: { urgent: 'Emergency signs', rapide: 'See a doctor promptly if…', info: 'When to see a doctor' },
    call: 'Life-threatening emergency: call <b>112</b> (Europe; <b>15</b> in France), <b>999</b> (UK), <b>911</b> (US, Canada) or your local emergency number.',
    fixQ: 'A mistake, a detail, a better video?',
    fixA: 'Suggest a correction for this card',
    fixNote: '(free GitHub account needed)',
    freq: ['Very common', 'Common', 'Less common', 'Rarer'],
    grp: {
      instant: ['In pain right now', 'At a given moment or in the past month'],
      annee: ['New cases each year', 'Not comparable with the group above'],
      deformation: ['Common deformities', 'Often painless']
    },
    tiers: ['More than 3 in 100', '1 to 3 in 100', 'Fewer than 1 in 100'],
    per1000: n => 'About ' + n + ' in 1,000',
    per100: n => 'About ' + n + ' in 100',
    num: 'en-GB',
    no3d: '3D display is not available on this device. The list of pains, the explanations and the exercises are still available.',
    skelFail: 'The skeleton could not be loaded. The numbered markers and the cards still work.',
    layers: { os: 'Bone', cart: 'Cartilage, discs and menisci', syn: 'Bursae and sheaths', lig: 'Ligaments', ten: 'Tendons', mus: 'Muscles', nerf: 'Nerves', peau: 'Skin' },
    discs: 'Intervertebral discs', bone: 'Bone',
    match: n => (n > 1 ? n + ' cards mention' : '1 card mentions') + ' at least one of these clues. They stay in the usual order of the list. This is not a diagnosis: only an examination can tell.',
    noMatch: 'No card in this list mentions these clues. If the pain is severe, unusual or getting worse, see a doctor.',
    whole: 'Whole body',
    shown: 'Card shown: ',
    unavailable: '<h2>View unavailable</h2><p>The structures of this joint could not be loaded. Check your connection, then try again.</p>',
    retry: 'Try again',
    hip: 'Hip',
    subHip: 'Right hip: the most common pains, what causes them, and exercises.',
    subJoint: s => s + ': the most common pains, what causes them, and exercises.',
    subHome: 'Where does it hurt? Choose an area of the body to see the most common pains, explanations and exercises.',
    nPains: n => n + ' common pains',
    mostCommon: 'Most common pains',
    noteJoint: 'From most to least common, an estimate without a published figure. The order varies a lot with age and sport.',
    noteHome: 'Grouped by order of magnitude of the number of people affected. The studies do not all measure the same thing: within a group, the order is not meaningful.',
    hintJointTouch: 'Tap a number or a line to see the area and the exercises. Two fingers to rotate and zoom.',
    hintJoint: 'Hover over a structure or a number to see the painful area, click to show the card. Drag to rotate, scroll to zoom.',
    hintHomeTouch: 'Tap a number or a line to open the joint.',
    hintHome: 'Hover over a number or a line to see the area, click to open the joint.',
    figYear: 'new cases per year, according to the cited study',
    figDef: 'people with the deformity, with or without pain, according to the cited study',
    figInst: 'people affected, according to the cited study',
    source: 'Source: ',
    marker: 'Marker ',
    no: 'No. ',
    hipHome: '<p>The hip has its own atlas: 13 pains, the muscles, tendons and cartilage in 3D, and exercises by stage.</p>',
    openHip: 'Open the hip atlas',
    feel: 'What you feel',
    goJoint: n => 'Explore the ' + n.toLowerCase(),
    revBy: n => 'Card reviewed by ' + n,
    notRev: 'Card not yet reviewed by a health professional',
    updated: ' · updated ',
    what: 'What happens',
    structs: 'Structures involved, coloured on the model:',
    who: 'Who is affected',
    exH: 'Exercises often suggested',
    exNote: 'General examples, often suggested for this pain. They do not replace an assessment by a doctor or physiotherapist, who adapts the exercises to you.',
    seeVideo: 'Watch the video',
    findVideo: 'Search for a video',
    ytNewTab: ' (YouTube, new tab)',
    unverified: '· unverified search, prefer videos by physiotherapists',
    rest: '<span class="tag" style="--c:var(--cool)"><i></i>Whole body</span><h2 tabindex="-1">Where do people hurt most often?</h2>',
    restIntro: n => '<p>' + n + ' common joint and back pains, grouped by order of magnitude of the number of people affected. Each number on the skeleton matches a line in the list.</p>',
    restSteps: '<ol class="steps"><li>Choose the area that hurts, using the buttons at the top, the list or the skeleton.</li><li>Compare with the most common pains in that area.</li><li>Read the explanations, the exercises and the signs that mean you should see a doctor.</li></ol><p class="warn-lite">This atlas informs; it does not diagnose and does not replace a doctor or a physiotherapist.</p>',
    restFigures: '<h3>How to read the figures</h3><p>Each figure comes from a published study, cited on the card. These studies do not all measure the same thing: people in pain at a given moment, new cases in a year, or a deformity that is often painless; the world population or a single country; all ages or certain age groups. That is why the list shows groups and orders of magnitude, not an exact ranking.</p><p class="sm">Within each joint, the order of the pains is an estimate, without a published figure. The texts were written in French and translated.</p>',
    loadingJoint: '<h2>Loading the joint…</h2><p class="ns">Muscles, tendons and ligaments are on their way.</p>',
    noneInList: 'No pain in the list',
    tipHome: 'Common pains · click to open',
    loadFail: '<h2>Loading failed</h2><p>The content could not be loaded. Check your connection, then reload the page.</p>',
    reload: 'Reload',
    date: { loc: 'en-GB' }
  };
  window.L10N = lang === 'en' ? EN : FR;
  /* fusion d'un fichier de contenu français avec son texte anglais (mêmes identifiants) */
  window.mergeContent = function (fr, en, kind) {
    if (!en) return fr;
    const pick = (dst, src, keys) => keys.forEach(k => { if (src && typeof src[k] === 'string' && src[k]) dst[k] = src[k]; });
    if (kind === 'corps') {
      Object.keys(fr.sources || {}).forEach(k => { if (en.sources && en.sources[k]) fr.sources[k].title = en.sources[k]; });
      Object.keys(fr.joints || {}).forEach(k => { if (en.joints && en.joints[k]) fr.joints[k].name = en.joints[k]; });
      (fr.pathologies || []).forEach(p => pick(p, (en.pathologies || {})[p.id], ['name', 'commonName', 'alias', 'display', 'basis', 'whatYouFeel']));
      return fr;
    }
    pick(fr.joint, en.joint, ['name', 'subtitle', 'notice']);
    (fr.pathologies || []).forEach(p => pick(p, (en.pathologies || {})[p.id], ['name', 'commonName', 'alias', 'whatYouFeel', 'whatHappens', 'whoIsAffected', 'warning']));
    Object.keys(fr.exercises || {}).forEach(k => pick(fr.exercises[k], (en.exercises || {})[k], ['name', 'how', 'videoSearch']));
    (fr.questions || []).forEach(q => { if (en.questions && en.questions[q.id]) q.text = en.questions[q.id]; });
    Object.keys(fr.structures || {}).forEach(k => { if (en.structures && en.structures[k]) fr.structures[k] = en.structures[k]; });
    return fr;
  };
})();
