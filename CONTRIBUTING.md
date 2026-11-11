# Contribuer à l'Atlas du corps

Merci de votre intérêt. Toutes les contributions sont bienvenues, et les plus utiles aujourd'hui sont les **relectures par des professionnels de santé**.

[English version below](#contributing-in-english).

## Trois façons de contribuer

### 1. Signaler, sans rien installer

Sur le site, chaque fiche se termine par un lien « Proposer une correction pour cette fiche ». Il ouvre un formulaire GitHub prérempli. Il faut un compte GitHub, gratuit.

Vous pouvez aussi choisir directement un formulaire : [corriger une fiche, proposer une fiche ou un exercice, proposer une vidéo, signaler un bug](https://github.com/bobbuilds398/atlas-whole-body/issues/new/choose).

### 2. Modifier un texte vous-même

Tous les textes sont dans le dossier [`content/`](content/), un fichier par articulation.

1. Ouvrez le fichier sur GitHub, par exemple [`content/genou.json`](content/genou.json).
2. Cliquez sur le crayon en haut à droite.
3. Modifiez le texte, entre les guillemets.
4. En bas, décrivez le changement et sa source, puis cliquez sur « Propose changes ».

GitHub crée alors une proposition (*pull request*) qui sera relue avant d'être intégrée.

### 3. Travailler sur le code

```bash
git clone https://github.com/bobbuilds398/atlas-whole-body.git
cd atlas-whole-body
python3 -m http.server 8000      # puis ouvrir http://localhost:8000
node tools/check-content.mjs     # vérifie la cohérence des contenus
```

Il n'y a pas d'étape de construction ni de dépendance à installer. three.js est chargé depuis un CDN.

## Le format des fiches

Extrait de `content/genou.json` :

```json
{
  "id": "rotulien",
  "name": "Tendinopathie rotulienne",
  "commonName": "Genou du sauteur",
  "frequency": 60,
  "whatYouFeel": "Douleur précise sous la pointe de la rotule, au saut, à la réception et dans les escaliers, sensible au doigt.",
  "whatHappens": "Le tendon rotulien relie la rotule au tibia et transmet la force du quadriceps. Son attache sous la rotule devient douloureuse quand les sauts s’accumulent.",
  "whoIsAffected": "Sports de saut et de course : volley, basket, athlétisme.",
  "exercises": ["isotend", "squatdec", "etquad"],
  "warning": "Douleur brutale avec impossibilité de tendre la jambe : consultez en urgence.",
  "answers": ["dessous", "avant", "course", "escalier"]
}
```

| Champ | Rôle |
| --- | --- |
| `id` | Identifiant. **Ne pas le changer** : il relie la fiche à son placement dans le modèle 3D. |
| `name` | Nom médical. |
| `commonName` | Nom courant, celui affiché en premier. |
| `alias` | Autre nom médical (facultatif). |
| `frequency` | Indice relatif de 0 à 100 dans l'articulation. Il fixe l'ordre de la liste. Estimation de l'ordre, sans chiffre publié. |
| `rule` | Repère de douleur pendant les exercices : `standard`, `nerf` (douleur d'origine nerveuse) ou `avis` (avis médical avant tout exercice). Facultatif, `standard` par défaut. |
| `updated` | Date de la dernière modification médicale, `AAAA-MM-JJ`. |
| `review` | `{"status": "non-relu" \| "relu" \| "a-revoir", "by": "…", "date": "AAAA-MM-JJ"}`. Voir [MEDICAL_REVIEW.md](MEDICAL_REVIEW.md). |
| `whatYouFeel` | « Ce que l'on ressent » : la description du point de vue du patient. |
| `whatHappens` | « Ce qui se passe » : l'explication anatomique, en deux phrases. |
| `whoIsAffected` | « Qui est concerné ». |
| `exercises` | Identifiants d'exercices, définis dans `exercises` du même fichier. |
| `warning` | Les signes qui doivent faire consulter. |
| `answers` | Identifiants des réponses (dans `questions`) qui correspondent à cette douleur. |

Dans le même fichier :

- `exercises` : pour chaque exercice, `name`, `how` (la consigne), `videoSearch` (les mots de la recherche YouTube) et `video`. **Si `video` contient l'adresse d'une vidéo précise, le site affiche « Voir la vidéo » au lieu d'une recherche.**
- `questions` : les réponses proposées sous « Où avez-vous mal ? » (`"group": "where"`) et « Quand et comment ? » (`"group": "when"`).
- `structures` : le nom affiché de chaque structure anatomique du modèle 3D.

[`content/corps.json`](content/corps.json) contient la vue d'ensemble : pour chaque douleur, `per100` (personnes concernées sur 100, ou nouveaux cas sur 100 par an), `display` (le chiffre affiché, en mots), `measure` (`instant` à un instant donné ou sur le dernier mois, `annee` nouveaux cas en un an, `deformation` souvent sans douleur), `allAges` (le chiffre vaut-il pour tous les âges), `basis` (ce que l'étude mesure, en clair) et `source`, définie dans `sources` avec un titre et une adresse (DOI de préférence). La liste est regroupée par `measure`, puis par ordre de grandeur.

La hanche fait exception : ses fiches sont encore dans [`js/hip.js`](js/hip.js) (tableaux `PATHO`, `SYMS`, `EXTRA` et `EXO` en tête de fichier).

## Règles pour les contenus médicaux

- **Une source pour chaque changement médical** : recommandation (HAS, NICE…), revue systématique, article ou manuel de référence.
- **Langage courant, phrases courtes.** Le lecteur est un patient. Le nom médical va dans `name`, pas dans les explications.
- **Pas de promesse ni de diagnostic.** L'atlas décrit des situations fréquentes, il ne dit pas au lecteur ce qu'il a.
- **Exercices prudents.** Des consignes précises (position, répétitions, durée), adaptées à une personne seule chez elle, sans matériel coûteux.
- **Signes d'alerte systématiques.** Chaque fiche dit quand consulter, et en urgence si nécessaire.
- **Chiffres** : uniquement des chiffres publiés, avec ce qu'ils mesurent (à un instant donné, sur une année, au cours de la vie, déformation), la population, les âges et le pays. Préférez la publication d'origine (DOI) à une page qui la reprend.
- **Signes d'alerte** : les retirer ou les atténuer demande l'accord d'un relecteur qualifié ([MEDICAL_REVIEW.md](MEDICAL_REVIEW.md)).
- **Vidéos** : une adresse `video` précise n'est acceptée qu'après avoir regardé la vidéo en entier ; elle doit correspondre à la consigne écrite et ne pas faire de publicité.
- **Pas de balise** : les textes s'affichent tels quels, les caractères `<` et `>` sont refusés par la vérification.

## Ajouter une fiche ou une articulation

Une nouvelle fiche demande deux choses : le texte dans `content/`, et un **placement dans le modèle 3D** (structures en cause, foyer de la douleur, zone ressentie), enregistré dans `models/`. Ce placement est calculé par des scripts à partir de Z-Anatomy ; ils sont conservés dans [`tools/models/`](tools/models/) pour référence, mais ne sont pas encore utilisables tels quels.

En pratique : [ouvrez une demande d'ajout](https://github.com/bobbuilds398/atlas-whole-body/issues/new?template=nouveau-contenu.yml) avec le texte et la structure anatomique concernée, et le placement sera fait à partir de là. Rendre ces scripts utilisables par tous est une contribution bienvenue.

## Code

- JavaScript sans framework, `js/atlas.js` pour le corps entier et les articulations, `js/hip.js` pour la hanche.
- Gardez le site statique et sans étape de construction.
- Testez sur ordinateur et à largeur de téléphone, et vérifiez la console du navigateur.
- Une proposition par sujet, avec une description de ce qui change et pourquoi.

## Licence de vos contributions

En contribuant, vous acceptez que votre contribution soit publiée sous la licence du dossier concerné : [MIT](LICENSE) pour le code, [CC BY-SA 4.0](LICENSE-CONTENT.md) pour les contenus et les modèles.

## Entre nous

Soyez bienveillants et précis. On discute des contenus, pas des personnes, et un désaccord médical se règle avec des sources. Le [code de conduite](CODE_OF_CONDUCT.md) s'applique partout dans le dépôt. **Les issues sont publiques : n'y décrivez pas votre propre situation médicale**, nous ne pouvons pas donner d'avis personnel.

---

## Contributing in English

Contributions are welcome, and **reviews by health professionals** are the most valuable ones right now. Issues and pull requests in English are fine.

- **Report something:** every card on the site ends with a "Proposer une correction" link that opens a pre-filled issue form. You can also [pick a form](https://github.com/bobbuilds398/atlas-whole-body/issues/new/choose): content correction, new condition or exercise, better video, bug.
- **Edit a text:** all texts are plain JSON under [`content/`](content/), one file per joint. On GitHub, open the file, click the pencil, edit, and propose the change. Keep the `id` fields unchanged: they link each card to its placement in the 3D model.
- **Work on the code:** the site is static with no build step. Run `python3 -m http.server 8000` and open the page; run `node tools/check-content.mjs` to validate the content files.

Field names are in English (`name`, `commonName`, `frequency`, `whatYouFeel`, `whatHappens`, `whoIsAffected`, `exercises`, `warning`, `answers`); the table above describes each one. Setting an exercise's `video` to a specific URL replaces the default YouTube search link; only do so after watching the whole video. Medical changes need a source, and removing or softening a warning sign needs a qualified reviewer's approval: see [MEDICAL_REVIEW.md](MEDICAL_REVIEW.md). Issues are public, so please do not describe your own health situation.

Rules for medical content: cite a source for every medical change, write in plain language for patients, make no diagnostic claims, keep exercises safe for someone alone at home, and always state when to see a professional.

Adding a new condition also needs a placement in the 3D model (`models/`), which is generated by scripts that are not yet usable as is. Open a "new content" issue with the text and the anatomical structure involved.

By contributing you agree to license your work under [MIT](LICENSE) for code and [CC BY-SA 4.0](LICENSE-CONTENT.md) for content and models.
