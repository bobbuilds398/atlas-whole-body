// Vérifie la cohérence des fichiers content/*.json avec les modèles 3D.
// Usage : node tools/check-content.mjs   (aucune dépendance, Node 18 ou plus)
import { readFileSync, readdirSync } from 'node:fs';

const errors = [], warnings = [];
const err = (file, msg) => errors.push(`${file} : ${msg}`);
const warn = (file, msg) => warnings.push(`${file} : ${msg}`);
const read = (f) => { try { return JSON.parse(readFileSync(f, 'utf8')); } catch (e) { err(f, 'JSON invalide — ' + e.message); return null; } };
const text = (v) => typeof v === 'string' && v.trim().length > 0;
const header = (f) => { const b = Buffer.from(readFileSync(f, 'utf8'), 'base64'); return JSON.parse(b.subarray(4, 4 + b.readUInt32LE(0)).toString('utf8')); };
// adresse https sans caractère qui pourrait sortir d'un attribut HTML
const okUrl = (u) => { try { const x = new URL(u); return x.protocol === 'https:' && !/["'<>\s`]/.test(u); } catch { return false; } };
const VIDEO_HOSTS = new Set(['www.youtube.com', 'youtube.com', 'youtu.be', 'm.youtube.com']);
const RULES = new Set(['standard', 'nerf', 'avis']);
const REVIEW = new Set(['non-relu', 'relu', 'a-revoir']);
const MEASURES = new Set(['instant', 'annee', 'deformation']);
// un signe d'alerte doit dire quoi faire
const CONSULT = /consult|urgence|médecin|medecin|avis|15 ou 112|kinésithérapeute|bilan/i;

// clés connues : une faute de frappe dans un nom de champ ne doit pas passer inaperçue
const KEYS = {
  card: new Set(['id', 'name', 'commonName', 'alias', 'frequency', 'whatYouFeel', 'whatHappens', 'whoIsAffected', 'warning', 'exercises', 'answers', 'rule', 'updated', 'review', 'sources']),
  exercise: new Set(['name', 'how', 'video', 'videoSearch']),
  joint: new Set(['key', 'name', 'subtitle', 'notice']),
  question: new Set(['id', 'group', 'text']),
  file: new Set(['_comment', 'joint', 'pathologies', 'exercises', 'questions', 'structures', 'sources']),
  home: new Set(['id', 'joint', 'name', 'commonName', 'alias', 'per100', 'display', 'measure', 'allAges', 'basis', 'source', 'whatYouFeel', 'anchor', 'bones', 'radius', 'hipId']),
  review: new Set(['status', 'by', 'date']),
};
const unknown = (f, where, obj, set) => { for (const k of Object.keys(obj || {})) if (!set.has(k)) err(f, `${where} : champ inconnu "${k}"`); };

// aucun texte ne doit contenir de balise : les fiches sont affichées comme du texte
function noMarkup(f, v, path = '') {
  if (typeof v === 'string') { if (/[<>]/.test(v)) err(f, `${path || 'texte'} : les caractères < et > sont interdits`); }
  else if (Array.isArray(v)) v.forEach((x, i) => noMarkup(f, x, `${path}[${i}]`));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) noMarkup(f, x, path ? `${path}.${k}` : k);
}
const isDate = (d) => /^\d{4}-\d\d-\d\d$/.test(d) && !isNaN(new Date(d));
function checkReview(f, w, p) {
  if (p.updated !== undefined && !isDate(p.updated)) err(f, `${w} : updated doit être une date AAAA-MM-JJ`);
  if (p.updated === undefined) warn(f, `${w} : date "updated" absente`);
  if (p.review !== undefined) {
    unknown(f, `${w} review`, p.review, KEYS.review);
    if (!REVIEW.has(p.review.status)) err(f, `${w} : review.status doit valoir non-relu, relu ou a-revoir`);
    if (p.review.status === 'relu' && !text(p.review.by) && !(Array.isArray(p.review.by) && p.review.by.length)) err(f, `${w} : une fiche relue doit indiquer review.by`);
  } else warn(f, `${w} : statut "review" absent`);
}

// ---- corps entier ----
const corps = read('content/corps.json');
const homeIds = [];
if (corps) {
  const f = 'content/corps.json', ids = new Set();
  noMarkup(f, corps);
  for (const [k, s] of Object.entries(corps.sources || {})) {
    if (!text(s.title)) err(f, `source "${k}" sans titre`);
    if (!okUrl(s.url || '')) err(f, `source "${k}" : url absente, non https ou invalide`);
  }
  const usedSrc = new Set();
  for (const p of corps.pathologies || []) {
    const w = `fiche "${p.id}"`;
    unknown(f, w, p, KEYS.home);
    if (!text(p.id)) err(f, 'fiche sans id'); else if (ids.has(p.id)) err(f, `${w} en double`); ids.add(p.id);
    for (const k of ['name', 'commonName', 'basis']) if (!text(p[k])) err(f, `${w} : champ "${k}" manquant`);
    if (!(corps.joints || {})[p.joint]) err(f, `${w} : articulation inconnue "${p.joint}"`);
    if (!(corps.sources || {})[p.source]) err(f, `${w} : source inconnue "${p.source}"`);
    usedSrc.add(p.source);
    if (!(corps.anchors || {})[p.anchor]) err(f, `${w} : repère inconnu "${p.anchor}"`);
    if (!(typeof p.per100 === 'number' && p.per100 > 0 && p.per100 <= 100)) err(f, `${w} : per100 doit être un nombre entre 0 et 100`);
    if (p.measure !== undefined && !MEASURES.has(p.measure)) err(f, `${w} : measure doit valoir instant, annee ou deformation`);
    if (p.measure === undefined) warn(f, `${w} : "measure" absent (instant par défaut)`);
    if (p.allAges !== undefined && typeof p.allAges !== 'boolean') err(f, `${w} : allAges doit être true ou false`);
    if (p.joint !== 'hanche') homeIds.push([p.joint, p.id]);
  }
  for (const k of Object.keys(corps.sources || {})) if (!usedSrc.has(k)) err(f, `source "${k}" citée par aucune fiche`);
  for (const [k, j] of Object.entries(corps.joints || {})) if (!text(j.name)) err(f, `articulation "${k}" sans nom`);
}

// ---- articulations ----
const seenJoints = new Set();
for (const file of readdirSync('content').filter((x) => x.endsWith('.json') && x !== 'corps.json')) {
  const f = 'content/' + file, c = read(f);
  if (!c) continue;
  noMarkup(f, c);
  unknown(f, 'fichier', c, KEYS.file);
  const key = file.replace('.json', '');
  seenJoints.add(key);
  if (!c.joint || c.joint.key !== key) err(f, `joint.key doit valoir "${key}"`);
  unknown(f, 'joint', c.joint, KEYS.joint);
  for (const k of ['name', 'subtitle']) if (!text((c.joint || {})[k])) err(f, `joint.${k} manquant`);
  if (corps && !(corps.joints || {})[key]) err(f, `articulation "${key}" absente de content/corps.json`);
  let model;
  try { model = header(`models/${key}.b64.txt`); } catch (e) { err(f, `modèle models/${key}.b64.txt illisible`); continue; }
  const placed = new Set(model.p.map((p) => p.id)), structs = new Set(model.s.map((s) => s.id));
  const ex = c.exercises || {}, qids = new Set(), ids = new Set(), usedEx = new Set(), usedQ = new Set();
  for (const x of c.questions || []) {
    unknown(f, `question "${x.id}"`, x, KEYS.question);
    if (!text(x.id)) err(f, 'question sans id'); else if (qids.has(x.id)) err(f, `question "${x.id}" en double`);
    qids.add(x.id);
    if (!text(x.text)) err(f, `question "${x.id}" sans texte`);
    if (!['where', 'when'].includes(x.group)) err(f, `question "${x.id}" : group doit être "where" ou "when"`);
  }
  for (const [k, e] of Object.entries(ex)) {
    unknown(f, `exercice "${k}"`, e, KEYS.exercise);
    for (const fld of ['name', 'how']) if (!text(e[fld])) err(f, `exercice "${k}" : champ "${fld}" manquant`);
    if (e.video) {
      if (!okUrl(e.video)) err(f, `exercice "${k}" : video doit être une adresse https valide`);
      else if (!VIDEO_HOSTS.has(new URL(e.video).hostname)) err(f, `exercice "${k}" : video doit pointer vers YouTube (ou ajoutez l'hôte à VIDEO_HOSTS après discussion)`);
    }
    if (!e.video && !text(e.videoSearch)) warn(f, `exercice "${k}" : ni vidéo ni recherche`);
  }
  for (const p of c.pathologies || []) {
    const w = `fiche "${p.id}"`;
    if (!text(p.id)) { err(f, 'fiche sans id'); continue; }
    unknown(f, w, p, KEYS.card);
    if (ids.has(p.id)) err(f, `${w} en double`); ids.add(p.id);
    if (!placed.has(p.id)) err(f, `${w} : pas de placement dans le modèle 3D (une nouvelle fiche demande aussi une mise à jour du modèle, ouvrez une issue)`);
    for (const k of ['name', 'commonName', 'whatYouFeel', 'whatHappens', 'whoIsAffected', 'warning']) if (!text(p[k])) err(f, `${w} : champ "${k}" manquant`);
    if (text(p.warning) && !CONSULT.test(p.warning)) err(f, `${w} : le signe d'alerte doit dire quoi faire (consulter, urgences 15 ou 112…)`);
    if (!(typeof p.frequency === 'number' && p.frequency >= 0 && p.frequency <= 100)) err(f, `${w} : frequency doit être un nombre entre 0 et 100`);
    if (p.rule !== undefined && !RULES.has(p.rule)) err(f, `${w} : rule doit valoir standard, nerf ou avis`);
    if (!Array.isArray(p.exercises) || !p.exercises.length) err(f, `${w} : au moins un exercice`);
    for (const k of p.exercises || []) { usedEx.add(k); if (!ex[k]) err(f, `${w} : exercice inconnu "${k}"`); }
    for (const k of p.answers || []) { usedQ.add(k); if (!qids.has(k)) err(f, `${w} : réponse inconnue "${k}"`); }
    checkReview(f, w, p);
  }
  for (const id of placed) if (!ids.has(id)) err(f, `fiche "${id}" présente dans le modèle mais absente du contenu`);
  for (const k of Object.keys(ex)) if (!usedEx.has(k)) err(f, `exercice "${k}" défini mais utilisé par aucune fiche`);
  for (const k of qids) if (!usedQ.has(k)) err(f, `question "${k}" utilisée par aucune fiche`);
  for (const k of Object.keys(c.structures || {})) if (!structs.has(k)) err(f, `structure inconnue "${k}"`);
  for (const k of structs) if (!text((c.structures || {})[k])) err(f, `structure "${k}" sans nom`);
  for (const p of model.p) for (const z of p.zones || []) if (!structs.has(z)) err(f, `fiche "${p.id}" : zone "${z}" absente du modèle`);
}
// chaque douleur du corps entier doit exister dans son articulation
for (const [j, id] of homeIds) {
  if (!seenJoints.has(j)) continue;
  const c = read(`content/${j}.json`);
  if (c && !(c.pathologies || []).some((p) => p.id === id)) err('content/corps.json', `fiche "${id}" absente de content/${j}.json`);
}

if (warnings.length) console.warn(warnings.map((w) => 'avertissement · ' + w).join('\n'));
if (errors.length) { console.error(errors.join('\n')); console.error(`\n${errors.length} problème(s).`); process.exit(1); }
console.log('Contenus cohérents.');
