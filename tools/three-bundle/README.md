# tools/three-bundle : construction de `vendor/three/three.bundle.min.js`

Le site est statique et sa politique de sécurité (CSP) impose `script-src 'self'` : pas de CDN, pas d'import map,
pas de script en ligne. Les versions récentes de three.js n'existent plus qu'en modules ES, sans fichier global
`THREE`. Ce petit dossier produit donc, avec [esbuild](https://esbuild.github.io/), un fichier unique chargé par
`index.html` avec `<script src="vendor/three/three.bundle.min.js">` et qui définit `window.THREE`.

- Versions épinglées (exactes) dans `package.json`, hachages dans `package-lock.json` :
  [`three`](https://www.npmjs.com/package/three) 0.187.0 (r187) et [`esbuild`](https://www.npmjs.com/package/esbuild) 0.28.2.
- `entry.js` n'importe que les symboles utilisés par `js/atlas.js` et `js/hip.js`, plus `OrbitControls`
  (`three/examples/jsm/controls/OrbitControls.js`). **Si un script du site utilise un nouveau symbole `THREE.X`,
  l'ajouter à `entry.js`** (sinon `T.X` est `undefined` au chargement).

## Reconstruire

```sh
cd tools/three-bundle
npm ci            # installe les versions du lockfile dans node_modules/ (ignoré par git)
npm run build     # écrit ../../vendor/three/three.bundle.min.js
sha256sum ../../vendor/three/three.bundle.min.js   # comparer avec vendor/README.md
```

Node 18 ou plus. La construction est reproductible : mêmes versions, même fichier, même SHA-256.
Commiter le fichier généré et mettre à jour le SHA-256 dans `vendor/README.md`.

## Mettre à jour three.js

1. Changer la version de `three` dans `package.json` (version exacte, sans `^`), puis `npm install`.
2. `npm run build`, copier `node_modules/three/LICENSE` dans `vendor/three/LICENSE` s'il a changé.
3. Relire le [guide de migration](https://github.com/mrdoob/three.js/wiki/Migration-Guide) et les notes de version.
4. Vérifier le rendu (voir ci-dessous), mettre à jour `vendor/README.md` et `CHANGELOG.md`.

## Comment le rendu reste identique à celui de three.js r128

Le site a été conçu avec r128 (2021). Depuis, three.js a changé plusieurs comportements par défaut ; les
réglages suivants gardent l'apparence d'origine. Ils sont dans `entry.js` et aux deux endroits où
`js/atlas.js` et `js/hip.js` créent le rendu.

| Changement depuis r128 | Réglage |
|---|---|
| Gestion des couleurs activée par défaut (r152) : les couleurs hex/hsl étaient converties sRGB vers linéaire | `THREE.ColorManagement.enabled = false` (dans `entry.js`, avant toute création de `Color`) |
| Sortie sRGB par défaut (r152) | `renderer.outputColorSpace = THREE.LinearSRGBColorSpace` (r128 écrivait la valeur linéaire telle quelle) |
| Intensités des lumières physiques (r155) : r128 multipliait l'éclairement par π | intensité de chaque lumière × π |
| `MeshStandardMaterial` conserve l'énergie (diffus × (1 − Fresnel), multi-diffusion), ce qui assombrit d'environ 4 % | intensité × 1,04 en plus (`THREE.ATLAS_LIGHT_SCALE = π × 1,04`, calibré en comparant r128 et r187 sur une scène test : écart moyen de ~1,6/255 ramené à ~0,2/255) |
| Tri des objets transparents (r15x) : profondeur du centre de la sphère englobante, au lieu de l'origine de l'objet (r128). Les modèles du site ont tous le même repère : r128 les dessinait dans l'ordre de création, et l'apparence (nerfs vus à travers les muscles) en dépend | `renderer.setTransparentSort(THREE.legacyTransparentSort(camera))` |
| Matériau transparent à double face dessiné en deux passes (faces arrière puis avant) depuis r130 | `material.forceSinglePass = true` (sous-classes de `MeshBasicMaterial`, `MeshStandardMaterial` et `ShaderMaterial` dans `entry.js`) |

Autres différences connues, sans effet visible : la molette de la souris fait varier le zoom de `OrbitControls`
selon `deltaY` (r128 : un pas fixe par cran) ; `OrbitControls` gère les touchers par « pointer events » et force
`touch-action: none` à la création (le site remet `pan-y` ensuite) ; le rendu d'arêtes est légèrement différent
(anticrénelage de la carte graphique).

## Vérifier le rendu après une mise à jour

Servir le dépôt (`python3 -m http.server`) et comparer des captures d'écran de l'ancienne et de la nouvelle
version (corps entier, une articulation avec une douleur sélectionnée, la hanche) avec un navigateur sans tête
(`--use-gl=swiftshader`, fenêtre 1280×800, `prefers-reduced-motion: reduce` pour figer les animations). La
différence moyenne absolue doit rester sous 1/255, avec moins de 1 % des pixels différant de plus de 8/255.
