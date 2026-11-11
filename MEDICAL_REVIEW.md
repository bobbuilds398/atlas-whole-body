# Relecture médicale / Medical review policy

L’Atlas du corps est un outil d’information générale. Ses fiches ont été écrites avec Claude, un modèle d’IA d’Anthropic, par un mainteneur qui n’est pas professionnel de santé. Cette politique explique comment les fiches sont relues, qui peut valider un changement médical, et comment les relecteurs sont crédités.

## 1. Statut de chaque fiche
Chaque fiche porte un champ `review.status`, affiché sur le site :
- `non-relu` — état par défaut. Affiché : « Fiche non relue par un professionnel de santé ».
- `relu` — au moins un relecteur qualifié (§2) a relu **toute la fiche dans sa version actuelle**. Affiché : « Relue par … le … ».
- `a-revoir` — un changement médical a eu lieu depuis la dernière relecture, ou un signalement de sécurité est ouvert. Affiché comme `non-relu`.

Tout changement médical sur une fiche `relu` la fait passer en `a-revoir`, sauf s’il est approuvé par un relecteur qualifié.

## 2. Qui peut relire
- **Relecteur qualifié** : professionnel de santé en exercice ou retraité dont le domaine couvre la fiche (masseur-kinésithérapeute, médecin — médecine générale, du sport, physique et de réadaptation, rhumatologie, chirurgie orthopédique —, podologue pour le pied, etc.).
- **Étudiant en santé** : relecture bienvenue et créditée comme telle, mais elle ne suffit pas pour passer une fiche en `relu`.
- La qualification est **déclarative**. Le relecteur peut, s’il le souhaite, indiquer en privé au mainteneur son numéro RPPS, vérifiable sur l’Annuaire santé ; ce numéro n’est jamais publié.
- Les relecteurs déclarent tout lien d’intérêt avec un produit, une méthode ou une vidéo cités dans la fiche.

## 3. Ce qui est un « changement médical »
Tout changement des champs `whatYouFeel`, `whatHappens`, `whoIsAffected`, `warning`, des exercices (consigne, dose, vidéo), de `frequency`, `per100`, `basis`, `answers`, et du placement 3D (structures, zones). Une faute d’orthographe ou une reformulation sans changement de sens n’en est pas un.

## 4. Règles de validation
| Changement | Exigence | Qui fusionne |
| --- | --- | --- |
| Forme, orthographe | aucune | mainteneur |
| Changement médical | **une source** (§5) | mainteneur ; la fiche passe en `a-revoir` sauf approbation d’un relecteur qualifié |
| Suppression ou atténuation d’un **signe d’alerte** | source **et** approbation d’un relecteur qualifié | mainteneur |
| Ajout d’un signe d’alerte, d’une précaution | une source, ou à défaut l’avis d’un relecteur | mainteneur (appliqué en priorité) |
| Passage en `relu` | approbation explicite d’un relecteur qualifié dans la PR ou l’issue (« Je valide la fiche X dans la version du JJ/MM/AAAA ») | mainteneur |

Approbation = une *review* GitHub « Approve » ou un commentaire explicite du relecteur.

## 5. Niveau de preuve des sources
Par ordre de préférence :
1. Recommandations de bonne pratique : HAS, NICE, OMS, sociétés savantes.
2. Revues systématiques et méta-analyses.
3. Essais contrôlés, grandes cohortes.
4. Manuels de référence, consensus d’experts.
Ne suffisent pas seuls : blogs, vidéos, sites commerciaux, avis personnels. Les chiffres doivent indiquer la population, la période et ce qui est mesuré. En cas de désaccord, la source la plus récente du niveau le plus élevé l’emporte ; si la question reste ouverte, la fiche le dit prudemment.

Ne copiez pas le texte d’une source : reformulez en langage courant et citez-la.

## 6. Signalements de sécurité
Un signalement « peut mettre quelqu’un en danger » est examiné sous 7 jours. Si la correction n’est pas possible dans ce délai, l’élément en cause (exercice, vidéo, phrase) est retiré temporairement.

## 7. Crédit des relecteurs
- Chaque relecteur figure dans [REVIEWERS.md](REVIEWERS.md) : nom ou pseudonyme, profession, fiches relues, date.
- Sur le site, la mention « Relue par Prénom N., profession, le JJ/MM/AAAA » n’apparaît **qu’avec l’accord écrit** du relecteur (commentaire dans l’issue ou la PR). Sans accord : « Relue par un(e) kinésithérapeute le … ».
- Pas de lien vers un cabinet, un site professionnel ou un réseau social : la mention n’est pas une publicité. Chaque professionnel vérifie qu’elle est compatible avec les règles de sa profession.
- Un relecteur peut retirer son nom à tout moment.

## 8. Portée et responsabilité
La relecture est bénévole et porte sur la version datée de la fiche. Elle ne transforme pas l’atlas en avis médical. L’éditeur du site reste responsable de ce qui est publié.

---

## English summary
Each card has a review status (`non-relu`, `relu`, `a-revoir`) shown on the site. Qualified reviewers are practising or retired health professionals in the relevant field; students are credited but cannot mark a card as reviewed. Every medical change needs a source (guidelines > systematic reviews > trials/cohorts > textbooks); removing or softening a warning sign also needs a qualified reviewer’s approval. Safety reports are handled within 7 days, or the item is temporarily removed. Reviewers are listed in REVIEWERS.md and named on cards only with written consent, with no links to their practice. Qualification is self-declared; an RPPS number may be shared privately, never published.
