# vendor/ : code et polices tierces copiées dans le dépôt

Aucune de ces ressources n'est chargée depuis un CDN : tout est servi par le site (voir la CSP dans `index.html`).
Ce fichier permet de détecter une altération et de reproduire la vérification.

## three.js r187 (licence MIT)

three.js n'existe plus en build global depuis r160 : `three/three.bundle.min.js` est un petit bundle **construit dans ce dépôt**
(esbuild, `tools/three-bundle/`) à partir du paquet npm `three@0.187.0` et de son `OrbitControls`. Il définit `window.THREE`
et ne contient que les classes utilisées par `js/*.js`.

| Fichier local | Origine | SHA-256 |
|---|---|---|
| `three/three.bundle.min.js` | construit par `cd tools/three-bundle && npm ci && npm run build` (`three@0.187.0`, `esbuild@0.28.2`) | `5b19a162c7b010a571b3872d75bc9e129d816c541674d4b03b30df0ed094275c` |
| `three/LICENSE` | `package/LICENSE` de `three@0.187.0` | `8b378ebe60e2fe500158cb0ac71cb5e8b7d92953c2abcc63a0eb90499653b5bc` |

- Paquet npm : https://www.npmjs.com/package/three/v/0.187.0 ; dépôt amont : https://github.com/mrdoob/three.js (tag `r187`). `three.bundle.min.js` expose `THREE.REVISION = "187"`.
- Intégrité npm de l'archive `three-0.187.0.tgz` : `sha512-Qiu7R+Cmh8CstZsY1uJOSWnVlfo7ZtNLV7mF8Jltk3LB3AtDu9cRZlcnRKkAk8Y4z6KKw35z7Y7Urd7jWY8etA==` (shasum `face29ee2de9bcc31a1b573a76f224e35e0b2894`) ; les hachages de `three` et d'`esbuild` sont dans `tools/three-bundle/package-lock.json`.
- Les réglages qui gardent l'apparence de l'ancienne r128 (couleurs, lumières, tri des transparents) sont décrits dans `tools/three-bundle/README.md`.
- Le fichier est minifié : l'en-tête de licence (« The MIT License, Copyright 2010-2026 three.js authors ») est dans `three/LICENSE`.

### Vérifier l'absence d'altération

```sh
cd tools/three-bundle && npm ci && npm run build
sha256sum ../../vendor/three/three.bundle.min.js ../../vendor/three/LICENSE
# doit être identique au tableau ci-dessus ; la construction est reproductible (mêmes versions, même fichier)
git status --short ../../vendor   # aucune modification attendue
diff node_modules/three/LICENSE ../../vendor/three/LICENSE
```

### Avis de sécurité connus

- Aucun avis publié affectant `three@0.187.0` n'a été identifié lors de la revue (à revérifier : https://github.com/mrdoob/three.js/security/advisories et https://www.npmjs.com/package/three). L'avis CVE-2020-28496 (`Color.setStyle`) est corrigé depuis 0.125.0.
- Le site n'utilise pas les chargeurs (`*Loader`) de three.js sur des données non maîtrisées : les modèles viennent de `models/*.b64.txt`, dans le dépôt, et le bundle n'inclut aucun chargeur.
- Le bundle n'utilise ni `eval` ni `new Function` : la CSP `script-src 'self'` reste inchangée.

### Mise à jour

Voir `tools/three-bundle/README.md` : changer la version exacte dans `package.json`, `npm install`, `npm run build`, vérifier le rendu, puis régénérer le SHA-256 ci-dessus. `.github/workflows/vendor-watch.yml` et Dependabot (`npm`, dossier `/tools/three-bundle`) signalent les nouvelles versions.

## Polices (`fonts/`, SIL Open Font License 1.1)

Les fichiers `.woff2` proviennent des paquets npm Fontsource (redistribution des polices Google Fonts) ; les textes de licence OFL sont dans `fonts/OFL-*.txt`.

| Fichier | Paquet npm (octet pour octet) | SHA-256 |
|---|---|---|
| `fonts/bricolage-grotesque.woff2` | `@fontsource-variable/bricolage-grotesque@5.2.5`, `files/bricolage-grotesque-latin-opsz-normal.woff2` | `922afb64cfc75d74678063d3f796e694c9bac74a443d93a58ded1e808c339bf3` |
| `fonts/public-sans-latin-400-normal.woff2` | `@fontsource/public-sans@5.3.0` | `36274b5787b4f03b27e65ae971d6c808a96838ccd60c9dabaee154889b6bba82` |
| `fonts/public-sans-latin-500-normal.woff2` | `@fontsource/public-sans@5.3.0` | `55e866a00caa197bc9fafa52c907f4dfe88e51bbb3f585c777931d03eb961e96` |
| `fonts/public-sans-latin-600-normal.woff2` | `@fontsource/public-sans@5.3.0` | `c7842f97346df1b3b470e9d71acde90f132dd858508ec5ae6606401e5d0938f7` |
| `fonts/ibm-plex-mono-latin-400-normal.woff2` | `@fontsource/ibm-plex-mono@5.2.6` (identique de 5.0.14 à 5.2.6) | `3c5a451f9ec27a354b0c2bcca636c6ec17a651281aabf29f8427e210a1d31e85` |
| `fonts/ibm-plex-mono-latin-500-normal.woff2` | `@fontsource/ibm-plex-mono@5.2.6` | `756026ff72eb76fd971ac4b7504cec55eef62109d2684c2cad8da32170b80b37` |

Licences : `fonts/OFL-bricolage-grotesque.txt` (https://github.com/ateliertriay/bricolage), `fonts/OFL-public-sans.txt` (https://github.com/uswds/public-sans), `fonts/OFL-ibm-plex-mono.txt` (IBM Corp.).

Contrôle : `cd vendor && sha256sum three/* fonts/*` et comparer avec les tableaux (le bundle `three/three.bundle.min.js` se reconstruit, voir ci-dessus).

## Autres ressources tierces

Aucun autre code tiers n'est copié dans `vendor/`. Les modèles 3D (`models/`) dérivent de Z-Anatomy et BodyParts3D (CC-BY-SA), voir `REUSE.toml` et `CITATION.cff`.
