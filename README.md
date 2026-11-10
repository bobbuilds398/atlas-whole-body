# Atlas du corps

Atlas 3D interactif des douleurs articulaires les plus fréquentes.

- **Corps entier** : squelette complet, douleurs classées par nombre de personnes concernées (chiffres publiés, sources citées dans la page).
- **Articulations** : cou, épaule, coude, poignet et main, bas du dos, hanche, genou, cheville et pied. Pour chacune, 12 douleurs fréquentes (13 pour la hanche), les os, cartilages, ligaments, tendons, muscles et nerfs en 3D, la zone douloureuse peinte sur les structures en cause, et des exercices.

Contenu informatif : il ne remplace pas l'avis d'un médecin ou d'un kinésithérapeute. Les textes médicaux n'ont pas été relus par un professionnel de santé. Dans chaque articulation, le classement des douleurs est indicatif.

## Utilisation

Site statique : ouvrir `index.html` via un serveur web (les fichiers `*.b64.txt` sont chargés à la demande), par exemple GitHub Pages ou `python3 -m http.server`.

## Contenu du dépôt

- `index.html` : la page (interface, données des fiches, moteur 3D).
- `body.b64.txt` : squelette et peau allégés du corps entier.
- `j-*.b64.txt` : structures détaillées et fiches de chaque articulation.
- `hip.b64.txt` : modèle détaillé de la hanche.
- `build/` : scripts de construction (export de Z-Anatomy, génération des fichiers d'articulation, assemblage de la page). Ils supposent le modèle Z-Anatomy et BodyParts3D téléchargés localement et ne sont fournis qu'à titre de référence.

## Licence et attributions

Les modèles 3D sont dérivés de :

- **Z-Anatomy** — The libre 3D atlas of anatomy — CC BY-SA 4.0 (Gauthier Kervyn et al.), https://github.com/Z-Anatomy/Models-of-human-anatomy
- **BodyParts3D** — © The Database Center for Life Science — CC BY-SA 2.1 Japan

Les fichiers de données 3D de ce dépôt (`*.b64.txt`) sont des œuvres dérivées et sont diffusés sous licence **CC BY-SA 4.0**.

Bibliothèque : three.js (MIT), chargée depuis un CDN.
