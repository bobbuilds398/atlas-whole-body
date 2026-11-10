// Vérifie la cohérence des fichiers content/*.json avec les modèles 3D.
// Usage : node tools/check-content.mjs   (aucune dépendance)
import { readFileSync, readdirSync } from 'node:fs';

const errors = [];
const err = (file, msg) => errors.push(`${file} : ${msg}`);
const read = (f) => { try { return JSON.parse(readFileSync(f, 'utf8')); } catch (e) { err(f, 'JSON invalide — ' + e.message); return null; } };
const text = (v) => typeof v === 'string' && v.trim().length > 0;
const header = (f) => { const b = Buffer.from(readFileSync(f, 'utf8'), 'base64'); return JSON.parse(b.subarray(4, 4 + b.readUInt32LE(0)).toString('utf8')); };

// ---- corps entier ----
const corps = read('content/corps.json');
if (corps) {
  const f = 'content/corps.json', ids = new Set();
  for (const [k, s] of Object.entries(corps.sources || {})) {
    if (!text(s.title)) err(f, `source "${k}" sans titre`);
    if (!/^https:\/\//.test(s.url || '')) err(f, `source "${k}" : url absente ou non https`);
  }
  for (const p of corps.pathologies || []) {
    const w = `fiche "${p.id}"`;
    if (!text(p.id)) err(f, 'fiche sans id'); else if (ids.has(p.id)) err(f, `${w} en double`); ids.add(p.id);
    for (const k of ['name', 'commonName', 'basis']) if (!text(p[k])) err(f, `${w} : champ "${k}" manquant`);
    if (!(corps.joints || {})[p.joint]) err(f, `${w} : articulation inconnue "${p.joint}"`);
    if (!(corps.sources || {})[p.source]) err(f, `${w} : source inconnue "${p.source}"`);
    if (!(corps.anchors || {})[p.anchor]) err(f, `${w} : repère inconnu "${p.anchor}"`);
    if (!(typeof p.per100 === 'number' && p.per100 > 0 && p.per100 <= 100)) err(f, `${w} : per100 doit être un nombre entre 0 et 100`);
  }
}

// ---- articulations ----
for (const file of readdirSync('content').filter((x) => x.endsWith('.json') && x !== 'corps.json')) {
  const f = 'content/' + file, c = read(f);
  if (!c) continue;
  const key = file.replace('.json', '');
  if (!c.joint || c.joint.key !== key) err(f, `joint.key doit valoir "${key}"`);
  if (corps && !(corps.joints || {})[key]) err(f, `articulation "${key}" absente de content/corps.json`);
  let model;
  try { model = header(`models/${key}.b64.txt`); } catch (e) { err(f, `modèle models/${key}.b64.txt illisible`); continue; }
  const placed = new Set(model.p.map((p) => p.id)), structs = new Set(model.s.map((s) => s.id));
  const ex = c.exercises || {}, q = new Set((c.questions || []).map((x) => x.id)), ids = new Set(), usedEx = new Set();
  for (const x of c.questions || []) {
    if (!text(x.text)) err(f, `question "${x.id}" sans texte`);
    if (!['where', 'when'].includes(x.group)) err(f, `question "${x.id}" : group doit être "where" ou "when"`);
  }
  for (const [k, e] of Object.entries(ex)) {
    for (const fld of ['name', 'how']) if (!text(e[fld])) err(f, `exercice "${k}" : champ "${fld}" manquant`);
    if (e.video && !/^https:\/\//.test(e.video)) err(f, `exercice "${k}" : video doit être une adresse https`);
  }
  for (const p of c.pathologies || []) {
    const w = `fiche "${p.id}"`;
    if (!text(p.id)) { err(f, 'fiche sans id'); continue; }
    if (ids.has(p.id)) err(f, `${w} en double`); ids.add(p.id);
    if (!placed.has(p.id)) err(f, `${w} : pas de placement dans le modèle 3D (une nouvelle fiche demande aussi une mise à jour du modèle, ouvrez une issue)`);
    for (const k of ['name', 'commonName', 'whatYouFeel', 'whatHappens', 'whoIsAffected', 'warning']) if (!text(p[k])) err(f, `${w} : champ "${k}" manquant`);
    if (!(typeof p.frequency === 'number' && p.frequency >= 0 && p.frequency <= 100)) err(f, `${w} : frequency doit être un nombre entre 0 et 100`);
    if (!Array.isArray(p.exercises) || !p.exercises.length) err(f, `${w} : au moins un exercice`);
    for (const k of p.exercises || []) { usedEx.add(k); if (!ex[k]) err(f, `${w} : exercice inconnu "${k}"`); }
    for (const k of p.answers || []) if (!q.has(k)) err(f, `${w} : réponse inconnue "${k}"`);
  }
  for (const id of placed) if (!ids.has(id)) err(f, `fiche "${id}" présente dans le modèle mais absente du contenu`);
  for (const k of Object.keys(ex)) if (!usedEx.has(k)) err(f, `exercice "${k}" défini mais utilisé par aucune fiche`);
  for (const k of Object.keys(c.structures || {})) if (!structs.has(k)) err(f, `structure inconnue "${k}"`);
  for (const k of structs) if (!text((c.structures || {})[k])) err(f, `structure "${k}" sans nom`);
}

if (errors.length) { console.error(errors.join('\n')); console.error(`\n${errors.length} problème(s).`); process.exit(1); }
console.log('Contenus cohérents.');
