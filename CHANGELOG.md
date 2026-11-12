# Journal des modifications / Changelog

Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/). Toute modification d’un signe d’alerte, d’un exercice ou d’un chiffre est listée.

## [0.3.0] — 2026-11-12

### Ajouté
- **Version anglaise** de tout le site : interface, 96 fiches des articulations, 13 fiches de la hanche, vue corps entier, page « About ». La langue suit celle du navigateur ; un bouton permet de changer, et le choix est gardé dans le navigateur. Adresse directe : `?lang=en` ou `?lang=fr`.
- `content/en/*.json` (texte anglais, mêmes identifiants) et `js/hip-en.js` ; la vérification refuse une traduction incomplète.

### Corrigé
- Phrases en double dans 8 fiches et exercices (cou, coude, genou, bas du dos, cheville).
- Le message d'erreur de chargement n'utilise plus de script en ligne (bloqué par la politique de sécurité).

## [0.2.0] — 2026-11-11

Revue critique du projet par des relecteurs spécialisés (clinique, anatomie, épidémiologie, accessibilité, interface, performance, juridique), puis application des recommandations retenues.

### Ajouté
- Page « À propos » : usage prévu, urgences et signes d’alerte, rédaction et relecture, mentions légales, données personnelles, accessibilité, licences.
- Bandeau d’avertissement et numéros d’urgence (15, 112, 114) sur toutes les vues.
- Statut de relecture et date de modification sur chaque fiche ; politique de relecture médicale (`MEDICAL_REVIEW.md`, `REVIEWERS.md`).
- Signes d’alerte en tête de fiche, classés en « urgence », « consulter rapidement » ou « à surveiller ».
- Trois règles de douleur pendant les exercices : standard, douleur d’origine nerveuse, avis médical d’abord.
- Couche « Bourses et gaines » ; poulie A1 et kyste poplité (structures schématiques).
- Douleur projetée (sciatique, névralgie cervico-brachiale) affichée sur la peau du corps entier.
- Adresses par fiche (`#genou/menisque`, `#hanche/gtps`), retour arrière du navigateur, titre de page.
- Mode sans 3D quand WebGL est indisponible ; pause du rendu hors écran ; respect de « réduire les animations ».
- Page 404, icône, feuille d’impression.
- `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CITATION.cff`, `REUSE.toml`, `CODEOWNERS`, Dependabot.

### Modifié
- **Chiffres du corps entier** : syndrome fémoro-patellaire (22,7 → environ 3 sur 1 000 par an chez les 7–24 ans), entorse de cheville (3,5 → environ 6 sur 1 000 par an aux urgences), capsulite (3,5 → environ 2 sur 1 000 par an), arthrose de la main (2,4 → 2,2) et de la hanche (0,45 → 0,42). Sources remplacées par les publications d’origine (DOI).
- La liste du corps entier est regroupée par ce qui est mesuré (en ce moment, nouveaux cas par an, déformation) et par ordre de grandeur, sans barres de comparaison.
- Ordre des douleurs dans chaque articulation et dans la hanche revu (estimation sans chiffre publié, signalée comme telle).
- Les filtres « zone » et « moment » atténuent les fiches qui ne mentionnent pas ces repères, sans réordonner la liste.
- Exercices revus pour 6 fiches (scaphoïde, myélopathie, ligament croisé, Osgood-Schlatter, ostéochondrite, psoas) ; titre « Exercices souvent proposés ».
- Placement des douleurs corrigé pour une vingtaine de fiches ; vrai trapèze supérieur dans le cou.
- Signes d’alerte complétés pour la hanche (arthrose, fessiers, adducteurs, psoas, piriforme, ischio-jambiers, droit fémoral, sacro-iliaque, fracture de fatigue, nécrose).
- Noms courants en premier ; terminologie actualisée (fasciopathie plantaire, tendinopathie latérale du coude, douleur sous-acromiale).
- Textes plus grands, cibles tactiles de 44 px, repères 3D plus grands, vue téléphone plus compacte.
- `LICENSE` redevient le texte MIT pur ; la répartition des licences est décrite dans `REUSE.toml` et `LICENSE-CONTENT.md`.
- Formulaires d’issue : rappel « formulaire public, pas de situation personnelle », question « peut-il mettre quelqu’un en danger ? ».
- Vérification des contenus plus stricte (clés connues, adresses, règles, questions).

### Supprimé
- Chargement des polices depuis Google Fonts et de three.js depuis jsDelivr : tout est servi par le site.
- Les 28 liens vidéo directs de la hanche, choisis sans vérification : remplacés par des recherches YouTube signalées comme non vérifiées.

## [0.1.0] — 2026-11-10
### Ajouté
- Vue corps entier (14 douleurs chiffrées et sourcées), huit articulations détaillées (12 fiches chacune) et atlas de la hanche (13 fiches).
- Formulaires de signalement, guide de contribution, vérification automatique des contenus.
