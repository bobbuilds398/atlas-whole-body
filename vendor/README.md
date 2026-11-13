# vendor/ : code et polices tierces copiées dans le dépôt

Aucune de ces ressources n'est chargée depuis un CDN : tout est servi par le site (voir la CSP dans `index.html`).
Ce fichier permet de détecter une altération et de reproduire la vérification.

## three.js r128 (licence MIT)

| Fichier local | Source amont (paquet npm `three@0.128.0`) | SHA-256 |
|---|---|---|
| `three/three.min.js` | `package/build/three.min.js` | `9274bbcec8d96168626c732b5d31c775aa8cfb7eaa0599bec0c175908a2c1ce2` |
| `three/OrbitControls.js` | `package/examples/js/controls/OrbitControls.js` | `02bb4ade710f3e607329e37a21f098bc3ac70eb6e33daf8a65e79f4db785e7b2` |
| `three/LICENSE` | `package/LICENSE` | `7dddf7c5b8fd10ee654db8857d75d104b5557889aa5a91fc4ca545ea7c07062f` |

- `three.min.js` expose `REVISION = "128"`. `OrbitControls.js` est la version non-module (globale `THREE.OrbitControls`) de la même révision r128.
- Intégrité npm de l'archive : `sha512-i0ap/E+OaSfzw7bD1TtYnPo3VEplkl70WX5fZqZnfZsE3k3aSFudqrrC9ldFZfYFkn1zwDmBcdGfiIm/hnbyZA==` (shasum `884dacca6a330e45600a09ec5439283f50b76aa6`).
- Dépôt amont : https://github.com/mrdoob/three.js (tag `r128`) ; page npm : https://www.npmjs.com/package/three/v/0.128.0
- Les trois fichiers sont identiques octet pour octet à ceux de l'archive npm (vérifié le 2026-11-13).

### Vérifier l'absence d'altération

```sh
d=$(mktemp -d) && cd "$d" && npm pack three@0.128.0 && tar xzf three-0.128.0.tgz
sha256sum package/build/three.min.js package/examples/js/controls/OrbitControls.js package/LICENSE
# comparer avec le tableau ci-dessus, puis avec : sha256sum vendor/three/*
```

### Avis de sécurité connus

- CVE-2020-28496 / GHSA-fq6p-x6j3-cmmq (déni de service par expression régulière dans `Color.setStyle`) : corrigé dans three 0.125.0, donc r128 n'est pas concernée.
- Aucun autre avis publié affectant `three@0.128.0` n'a été identifié lors de la revue (CVE-2022-0177, XSS « iframe », est retirée/contestée ; le paquet malveillant `js-3ha3` n'a aucun rapport avec `three`).
- Le site n'utilise pas les chargeurs (`*Loader`) de three.js sur des données non maîtrisées : les modèles viennent de `models/*.b64.txt`, dans le dépôt.

### Mise à jour

r128 est ancienne (2021) mais figée volontairement : `OrbitControls.js` non-module (supprimé des `examples/js` à partir de r148) et `THREE` global. Passer à une version récente demande de migrer vers les modules ES (`import`), ce qui touche `index.html` et `js/*.js`. Après toute mise à jour : régénérer les hachages ci-dessus et vérifier que `three.min.js` et `OrbitControls.js` ont la même révision.

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

Contrôle : `cd vendor && sha256sum three/* fonts/*` et comparer avec les tableaux.

## Autres ressources tierces

Aucun autre code tiers n'est copié dans `vendor/`. Les modèles 3D (`models/`) dérivent de Z-Anatomy et BodyParts3D (CC-BY-SA), voir `REUSE.toml` et `CITATION.cff`.
