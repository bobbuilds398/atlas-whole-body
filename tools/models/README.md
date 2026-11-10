# Scripts de génération des modèles (référence)

Ces scripts ont produit les fichiers de `models/` à partir du modèle Z-Anatomy.
**Ils ne sont pas utilisables tels quels** : ils dépendent de téléchargements locaux (le fichier
`Startup.blend` de Z-Anatomy, les maillages de BodyParts3D pour la peau), de chemins propres à la
machine d'origine, et d'une étape intermédiaire qui n'est pas dans ce dépôt. Ils sont conservés pour
documenter la méthode.

- `zaexport.py` : exporte chaque objet de `Startup.blend` en tableaux de sommets et de faces (module Python `bpy`).
- `zalib.py` : outils communs — chargement et lissage des maillages, séparation des tendons et des
  cartilages d'après les matériaux du modèle, repères anatomiques, écriture du format binaire.
- `zapack.py` : squelette et peau allégés de la vue corps entier.
- `joints/*.py` : une articulation par fichier — structures retenues, foyers de douleur et zones ressenties.

Les textes des fiches ne viennent plus de ces scripts : ils sont dans `content/*.json`.

## Format d'un fichier `models/<articulation>.b64.txt`

Le fichier est encodé en base64. Une fois décodé :

1. 4 octets : longueur `n` de l'en-tête (entier non signé, petit-boutiste) ;
2. `n` octets : en-tête JSON, complété par des espaces jusqu'à un multiple de 4 ;
3. le reste : sommets (entiers 16 bits quantifiés) et indices de triangles (entiers 16 bits non signés).

L'en-tête contient :

- `j` : caméra de l'articulation ;
- `s` : structures (`id`, couche `layer` parmi `os`, `cart`, `lig`, `ten`, `mus`, `nerf`, `peau`, couleur et opacité éventuelles) ;
- `m` : maillages (`id` de structure, position `o` dans les données, nombres de sommets `nv` et d'indices `ni`, origine `b` et pas `s` de quantification) ;
- `p` : placement de chaque fiche (`id`, structures en cause `zones`, foyers `foc` et zones ressenties `skin` sous la forme `[x, y, z, rayon]` en millimètres, vue conseillée `view`).

Repère : x vers la gauche du sujet, y vers l'arrière, z vers le haut, en millimètres.

Rendre cette chaîne reproductible (téléchargement automatique, chemins relatifs, lecture des fiches
depuis `content/`) est une contribution bienvenue.
