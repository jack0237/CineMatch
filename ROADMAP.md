# CineMatch — Roadmap & Ordre de priorité

Coche une issue (`[x]`) dès qu'elle est terminée.
Chaque issue est liée à son ticket GitHub : `#N`.

---

## Bloc 1 — Fondations `Semaine 1`

> Tout le reste dépend de ce bloc. A faire en premier, dans l'ordre.

- [x] [#3](https://github.com/jack0237/CineMatch/issues/3) — Variables d'environnement (`.env` + `.env.example`)
- [x] [#1](https://github.com/jack0237/CineMatch/issues/1) — Restructurer l'architecture du projet (`services/`, `utils/`, `hooks/`)
- [x] [#31](https://github.com/jack0237/CineMatch/issues/31) — Design system dark/cinématique dans `theme.ts`
- [x] [#2](https://github.com/jack0237/CineMatch/issues/2) — Configurer Supabase (tables `profiles` + `swipe_history` + RLS)

---

## Bloc 2 — Authentification `Semaine 1`

> Socle obligatoire selon l'éval. Faire dès que Supabase est prêt.

- [x] [#4](https://github.com/jack0237/CineMatch/issues/4) — Écran Register (inscription email/mot de passe)
- [x] [#5](https://github.com/jack0237/CineMatch/issues/5) — Écran Login (connexion)
- [x] [#35](https://github.com/jack0237/CineMatch/issues/35) — Lien "Mot de passe oublié" sur Login
- [x] [#6](https://github.com/jack0237/CineMatch/issues/6) — AuthContext + protection des routes (auth guard)

---

## Bloc 3 — API & Navigation `Semaine 2`

> Parallélisable une fois l'auth en place.

- [x] [#7](https://github.com/jack0237/CineMatch/issues/7) — Service TMDB (`src/services/tmdb.ts`) — tous les endpoints
- [x] [#8](https://github.com/jack0237/CineMatch/issues/8) — Navigation par onglets (4 tabs : Swipe, Matches, Recherche, Profile)
- [x] [#32](https://github.com/jack0237/CineMatch/issues/32) — Écran Profile (4ème onglet + stats + déconnexion)
- [x] [#9](https://github.com/jack0237/CineMatch/issues/9) — Navigation Stack pour la fiche film (`movie/[id]`)

---

## Bloc 4 — Écran Swipe `Semaines 3-4`

> Feature principale de l'app — la plus technique.

- [x] [#10](https://github.com/jack0237/CineMatch/issues/10) — SwipeCard UI (poster, titre, année, note)
- [x] [#11](https://github.com/jack0237/CineMatch/issues/11) — Gestes swipe gauche/droite (Gesture Handler + Reanimated)
- [x] [#34](https://github.com/jack0237/CineMatch/issues/34) — SwipeCard fidélité maquette (boutons ✗/❤️, overlays, chips genres)
- [x] [#12](https://github.com/jack0237/CineMatch/issues/12) — Sauvegarder les swipes dans Supabase
- [x] [#13](https://github.com/jack0237/CineMatch/issues/13) — Pagination TMDB (charger plus de films)

---

## Bloc 5 — Écrans Matches, Recherche, Historique `Semaines 3-4`

- [x] [#14](https://github.com/jack0237/CineMatch/issues/14) — Matches screen (liste films likés depuis Supabase)
- [x] [#38](https://github.com/jack0237/CineMatch/issues/38) — Matches Vault (grille 2 colonnes + tri note/date)
- [x] [#18](https://github.com/jack0237/CineMatch/issues/18) — Recherche avec debounce
- [ ] [#19](https://github.com/jack0237/CineMatch/issues/19) — Historique (tous les films swipés)

---

## Bloc 6 — Fiche Film `Semaines 3-4`

- [x] [#15](https://github.com/jack0237/CineMatch/issues/15) — Données film (synopsis, durée, genres, note)
- [x] [#36](https://github.com/jack0237/CineMatch/issues/36) — Header cinématique (poster hero + gradient + Watch Trailer + Share)
- [x] [#16](https://github.com/jack0237/CineMatch/issues/16) — Casting des 5 premiers acteurs
- [x] [#17](https://github.com/jack0237/CineMatch/issues/17) — Lien bande-annonce YouTube

---

## Bloc 7 — UX Polish `Semaines 5-6`

- [ ] [#37](https://github.com/jack0237/CineMatch/issues/37) — Skeleton loading (remplace ActivityIndicator par des shimmer)
- [ ] [#20](https://github.com/jack0237/CineMatch/issues/20) — Loading states ActivityIndicator (fallback si pas de skeleton)
- [ ] [#21](https://github.com/jack0237/CineMatch/issues/21) — Gestion erreurs réseau (messages lisibles, pas de crash silencieux)
- [ ] [#22](https://github.com/jack0237/CineMatch/issues/22) — Empty states sur toutes les listes
- [ ] [#23](https://github.com/jack0237/CineMatch/issues/23) — Validation responsive (pas d'overflow, pas de texte coupé)
- [ ] [#24](https://github.com/jack0237/CineMatch/issues/24) — Tests sur device réel iOS et Android (Expo Go)

---

## Bloc 8 — Bonus `Semaine 7` _(+1pt chacun, max +2)_

- [x] [#25](https://github.com/jack0237/CineMatch/issues/25) — Filtres par genre avant de swiper
- [x] [#33](https://github.com/jack0237/CineMatch/issues/33) — Filter Bottom Sheet complète (slider score + Era + Reset/Apply)
- [ ] [#26](https://github.com/jack0237/CineMatch/issues/26) — Animation rotation carte pendant le swipe (Reanimated)

---

## Bloc 9 — Livraison `Semaine 8`

- [ ] [#27](https://github.com/jack0237/CineMatch/issues/27) — README.md complet (instructions, .env.example, librairies)
- [ ] [#28](https://github.com/jack0237/CineMatch/issues/28) — Audit sécurité (aucune clé hardcodée dans le code)
- [ ] [#29](https://github.com/jack0237/CineMatch/issues/29) — Publier sur Expo Go (QR Code pour le README)
- [ ] [#30](https://github.com/jack0237/CineMatch/issues/30) — Préparer la soutenance (scénario demo 15 min)

---

## Progression

| Bloc          | Issues | Faites | Restantes |
| ------------- | ------ | ------ | --------- |
| Fondations    | 4      | 4      | 0         |
| Auth          | 4      | 4      | 0         |
| API/Nav       | 4      | 4      | 0         |
| Swipe         | 5      | 5      | 0         |
| Matches/Search| 4      | 3      | 1         |
| Fiche film    | 4      | 4      | 0         |
| UX Polish     | 6      | 0      | 6         |
| Bonus         | 3      | 2      | 1         |
| Livraison     | 4      | 0      | 4         |
| **Total**     | **38** | **26** | **12**    |
