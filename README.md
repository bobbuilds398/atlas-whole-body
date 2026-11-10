# Atlas du corps

**Un atlas 3D interactif des douleurs articulaires et du dos les plus fréquentes.**
Où a-t-on mal, quelle structure est en cause, et quels exercices peuvent aider.

**[Ouvrir l'atlas](https://bobbuilds398.github.io/atlas-whole-body/)** · [Proposer une correction](https://github.com/bobbuilds398/atlas-whole-body/issues/new/choose) · [Contribuer](CONTRIBUTING.md) · [English summary](#english-summary)

![Vue du corps entier : squelette en 3D et classement des douleurs les plus fréquentes](docs/corps-entier.jpg)

## Ce que fait l'atlas

- **Corps entier.** Un squelette en 3D et les douleurs les plus fréquentes, classées par nombre de personnes concernées. Chaque chiffre vient d'une étude publiée, citée dans la fiche.
- **Huit articulations détaillées** : cou, épaule, coude, poignet et main, bas du dos, hanche, genou, cheville et pied. Pour chacune, les 12 douleurs les plus fréquentes (13 pour la hanche).
- **Anatomie réelle.** Os, cartilages, ligaments, tendons, muscles et nerfs issus de [Z-Anatomy](https://github.com/Z-Anatomy/Models-of-human-anatomy), avec une couche par type de structure.
- **Zone douloureuse.** La structure en cause est mise en évidence, et la zone où l'on ressent la douleur est peinte sur la peau.
- **Questions en langage courant.** « Où avez-vous mal ? », « Quand et comment ? » : la liste se réordonne selon les réponses.
- **Exercices.** Pour chaque douleur, quelques exercices avec leurs consignes, un repère de douleur acceptable et les signes qui doivent faire consulter.

| Genou | Épaule | Bas du dos |
| --- | --- | --- |
| ![Genou : tendinopathie rotulienne](docs/genou.jpg) | ![Épaule : tendinopathie de la coiffe des rotateurs](docs/epaule.jpg) | ![Bas du dos : sciatique](docs/bas-du-dos.jpg) |

## État du projet, et où l'aide est la plus utile

Ce projet est jeune. Ses limites sont connues, et ce sont autant de façons d'aider.

- **Les fiches n'ont pas été relues par des professionnels de santé.** Textes, exercices et signes d'alerte ont été rédigés avec l'aide d'une IA à partir de connaissances générales. **Relecteurs recherchés** : kinésithérapeutes, médecins du sport, rhumatologues, étudiants en santé.
- **Le classement dans chaque articulation est indicatif.** Seul le classement du corps entier repose sur des chiffres publiés. Des données d'épidémiologie par articulation seraient précieuses.
- **Les vidéos sont des recherches YouTube.** Chaque exercice mériterait un lien vers une vidéo précise et fiable.
- **L'anatomie est celle d'un seul individu**, en position debout. Quelques structures sont schématiques : bourse de l'olécrâne, nerf grand occipital, et les éléments « lorsqu'ils existent » (hernie discale, kyste synovial, névrome de Morton, dépôt calcaire).
- **La hanche utilise un moteur à part**, plus ancien, avec ses propres réglages (mouvement, coupe, exercices par phase).
- **Le site est en français uniquement.**

L'atlas est un outil d'information. Il ne remplace pas l'avis d'un médecin ou d'un kinésithérapeute.

## Contribuer

Vous n'avez pas besoin de savoir programmer.

- **Une erreur dans une fiche ?** Chaque fiche du site a un lien « Proposer une correction », qui ouvre un formulaire prérempli. Vous pouvez aussi [choisir un formulaire ici](https://github.com/bobbuilds398/atlas-whole-body/issues/new/choose).
- **Envie de corriger vous-même ?** Les textes sont dans des fichiers lisibles, un par articulation : [`content/genou.json`](content/genou.json), [`content/epaule.json`](content/epaule.json)… Sur GitHub, le crayon en haut du fichier permet de le modifier et de proposer le changement.
- **Développeur ?** Le site est statique, sans étape de construction : HTML, CSS, JavaScript et three.js.

Le guide complet est dans [CONTRIBUTING.md](CONTRIBUTING.md).

## Lancer le site en local

```bash
git clone https://github.com/bobbuilds398/atlas-whole-body.git
cd atlas-whole-body
python3 -m http.server 8000
```

Puis ouvrez <http://localhost:8000>. La page doit être servie par un serveur web : ouverte directement comme fichier, elle ne peut pas charger ses données.

## Organisation du dépôt

| Dossier | Contenu |
| --- | --- |
| `index.html`, `css/`, `js/` | La page, ses styles, et les deux scripts : `js/atlas.js` (corps entier et articulations) et `js/hip.js` (hanche). |
| `content/` | Les textes : fiches, exercices, questions, chiffres et sources. Un fichier JSON par articulation, plus `corps.json` pour la vue d'ensemble. |
| `models/` | Les modèles 3D et le placement des douleurs, un fichier par articulation. |
| `tools/` | `check-content.mjs` vérifie la cohérence des contenus. `models/` garde, pour référence, les scripts qui ont produit les modèles. |
| `docs/` | Images de ce README. |

## Licences et crédits

- **Code** (`index.html`, `css/`, `js/`, `tools/`) : [licence MIT](LICENSE).
- **Contenus et modèles 3D** (`content/`, `models/`, `docs/`) : [CC BY-SA 4.0](LICENSE-CONTENT.md).
- Les modèles 3D sont dérivés de **Z-Anatomy** — The libre 3D atlas of anatomy — CC BY-SA 4.0 (Gauthier Kervyn et al.), lui-même dérivé de **BodyParts3D** — © The Database Center for Life Science — CC BY-SA 2.1 Japan.
- Rendu 3D : [three.js](https://threejs.org/) (MIT).

## English summary

**Atlas du corps** is an interactive 3D atlas of the most common joint and back pain, in French. A whole-body view ranks conditions by number of people affected (published figures, cited on each card). Eight detailed views (neck, shoulder, elbow, wrist and hand, lower back, hip, knee, ankle and foot) each show their 12 most common conditions with real anatomy from Z-Anatomy, the structure involved, the area where pain is felt, and a few exercises with warning signs.

**Help wanted.** The medical content has not been reviewed by health professionals yet, the per-joint rankings are indicative, and exercise videos are plain YouTube searches. Reviews from physiotherapists and physicians are the most valuable contribution. An English translation would also be welcome: all texts live in plain JSON files under `content/`.

You can open an issue in English with one of the [issue forms](https://github.com/bobbuilds398/atlas-whole-body/issues/new/choose), or read [CONTRIBUTING.md](CONTRIBUTING.md) (it has an English section). The site is static, with no build step: clone it, run `python3 -m http.server`, and open the page.

Code is MIT-licensed; content and 3D data are CC BY-SA 4.0. This is an information tool, not medical advice.
