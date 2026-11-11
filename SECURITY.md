# Sécurité / Security

## Signaler une faille
Utilisez le **signalement privé de GitHub** : onglet *Security* → *Report a vulnerability*
(https://github.com/bobbuilds398/atlas-whole-body/security/advisories/new). Ne créez pas d’issue publique.
Réponse sous 7 jours, à titre bénévole.

## Ce qui compte comme faille
Le site est statique (GitHub Pages), sans compte ni donnée enregistrée. Sont concernés :
- injection de code ou de HTML à partir des fichiers `content/*.json` ;
- lien d’une fiche (source, vidéo) détourné vers un site frauduleux ou malveillant ;
- dépendance chargée depuis un tiers compromise ou modifiée ;
- fuite involontaire de données de visiteurs.

## Ce qui n’est pas une faille
Une erreur médicale, un exercice inadapté ou un signe d’alerte manquant : c’est **urgent**, mais signalez-le avec le formulaire
[« Corriger une fiche »](https://github.com/bobbuilds398/atlas-whole-body/issues/new?template=correction.yml) en répondant « Oui » à « peut-il mettre quelqu’un en danger ? ».
Ces signalements sont traités en priorité ; l’élément peut être retiré le temps de la correction.

---
**English.** Report vulnerabilities privately via GitHub’s *Report a vulnerability* (Security tab), not in public issues. In scope: HTML/JS injection via content files, hijacked links, compromised third-party assets, visitor data leaks. Unsafe medical content is not a security bug but is handled with priority via the correction form.
