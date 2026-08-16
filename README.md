# stsv.ca — site Astro

Refonte du site de la Société de transport de Salaberry-de-Valleyfield.
Migration de GoHighLevel vers GitHub + Vercel.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # sortie dans .vercel/output
```

## Structure

```
src/
  data/site.ts      → avis de service, lignes, tarifs, documents, coordonnées
  data/content.ts   → contenu éditorial des pages (FR · EN · ES)
  i18n/ui.ts        → libellés d'interface, slugs par langue, helper path()
  components/       → Header, Footer, PageHero, FareTable, DocList, Form, pages
  layouts/Base.astro→ head, hreflang, canonical, Open Graph
  pages/            → routes FR à la racine, EN sous /en, ES sous /es
  pages/api/        → endpoints des formulaires (fonctions Vercel)
  assets/images/    → images sources, optimisées en WebP au build
public/
  documents/        → 21 PDF + 2 fichiers XLS de réservation
  fonts/            → Poppins et JetBrains Mono auto-hébergées
  brand/            → logo et icônes
```

## Modifier le contenu

**Un avis de service** (bandeau noir ou cartes d'accueil) : `src/data/site.ts`, objets `banner` et `notices`.
Passer `active: false` pour retirer un avis sans le supprimer.

**Un tarif** : `src/data/site.ts` (`fares`) et `src/data/content.ts` (`adaptedFares`).

**Un horaire PDF** : remplacer le fichier dans `public/documents/`, garder le même nom.
Si le nom change, mettre à jour `documents` dans `src/data/site.ts`.

**Un texte de page** : `src/data/content.ts`, section correspondante. Toujours les trois langues.

Chaque modification = commit + push. Vercel déploie automatiquement.

## Langues

FR par défaut à la racine, EN sous `/en`, ES sous `/es`.
Les slugs sont traduits (`/services`, `/en/services`, `/es/servicios`) et définis dans `routes` (`src/i18n/ui.ts`).
`hreflang` et `canonical` sont générés automatiquement pour chaque page.

## Formulaires

`/contact` et `/infolettre` postent vers `/api/contact` et `/api/newsletter`,
qui relaient vers le webhook eNovoOs.

Chaque formulaire a son propre webhook. Variables à définir dans Vercel
(Settings → Environment Variables) — jamais dans le dépôt :

| Variable | Rôle |
|---|---|
| `STSV_WEBHOOK_CONTACT` | Webhook eNovoOs du formulaire « Nous joindre » |
| `STSV_WEBHOOK_NEWSLETTER` | Webhook eNovoOs de l'infolettre |
| `STSV_WEBHOOK_SECRET` | Optionnel — envoyé dans l'en-tête `X-STSV-Signature` |

`STSV_WEBHOOK_URL` reste accepté comme repli si une seule URL est configurée.
Les appels ont un délai d'attente de 10 secondes : si eNovoOs ne répond pas,
l'usager voit un message d'erreur avec le numéro de téléphone plutôt qu'une page figée.

Charge utile envoyée :

Le champ `subject` du formulaire de contact est une liste déroulante.
La valeur envoyée est une clé technique en anglais (`sales` ou `support`),
identique dans les trois langues, pour que le routage eNovoOs ne dépende
pas de la langue de l'usager. Seuls les libellés affichés sont traduits.
Les options se modifient dans `contactSubjects` (`src/data/site.ts`) ;
toute valeur hors liste est refusée côté serveur.

Convention du projet : toutes les clés techniques (identifiants d'avis,
catégories de documents, valeurs de formulaire) sont en anglais. Le français
et l'espagnol n'apparaissent que dans les libellés destinés aux usagers.

```json
{
  "kind": "contact",
  "locale": "fr",
  "name": "…",
  "email": "…",
  "phone": "…",
  "subject": "sales",
  "message": "…",
  "source": "stsv.ca",
  "receivedAt": "2026-08-14T14:00:00.000Z"
}
```

Protection anti-pourriel : champ appât (honeypot) `company`. Une soumission qui le remplit
reçoit un 200 sans être transmise.

## Déploiement

Vercel détecte Astro automatiquement. Rien à configurer côté build.
`vercel.json` contient les redirections 301 depuis les anciennes URL GoHighLevel,
les en-têtes de cache et les en-têtes de sécurité.

## Points à valider avec la STSV

- **Textes alternatifs des images** — rédigés à partir de ce qu'on voit sur les photos, à confirmer.
- **Versions EN** — les pages anglaises « à propos », « infos réservation », « tutoriels » et
  « carte ACCÈS » étaient vides sur l'ancien site. Le contenu a été rédigé à partir du français.
- **Vidéos des tutoriels** — l'ancien site servait 15 identifiants YouTube, soit 5 tutoriels × 3 langues.
  L'association langue ↔ vidéo a été déduite de l'ordre du code source. À vérifier une par une.
- **Doublons d'horaires** — deux versions distinctes des horaires généraux et de la ligne 338 étaient
  liées simultanément. Le site utilise `_v2`. Confirmer laquelle fait foi.
- **Coordonnées** — aucune adresse postale n'apparaissait sur l'ancien site. À ajouter si nécessaire.

## Aperçus hors ligne

Les fichiers `apercu-*.html` à la racine sont des copies autonomes (CSS intégré) pour revue rapide
sans lancer le serveur. Ils ne font pas partie du site : ils peuvent être supprimés.
