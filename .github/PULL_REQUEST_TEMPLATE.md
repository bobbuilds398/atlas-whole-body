## Ce que change cette proposition

<!-- Une ou deux phrases. -->

## Type

- [ ] Contenu d'une fiche (`content/*.json`)
- [ ] Code ou mise en page (`js/`, `css/`, `index.html`)
- [ ] Modèles 3D (`models/`)
- [ ] Documentation

## Pour un changement médical

- Source :
- [ ] Je suis professionnel(le) de santé (facultatif, précisez la profession si vous le souhaitez)
- [ ] Ce changement touche un signe d’alerte, un exercice, une zone ou un chiffre → source indiquée, `updated` mis à jour, `review.status` passé à `a-revoir` si la fiche était relue (voir [MEDICAL_REVIEW.md](../MEDICAL_REVIEW.md))

## Vérifications

- [ ] J’ai le droit de proposer ce contenu : je l’ai écrit ou reformulé moi-même, sans copier un livre, un site ou une recommandation (je cite la source à la place).
- [ ] `node tools/check-content.mjs` passe
- [ ] J'ai ouvert la page en local et regardé la fiche ou la vue modifiée
