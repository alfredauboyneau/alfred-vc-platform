# Context.md — Alfred : Contexte & Architecture

## Qu'est-ce qu'Alfred ?

Alfred est une plateforme de **mise en relation entre startups françaises et fonds de VC**, propulsée par l'IA (Claude d'Anthropic). Elle automatise l'analyse financière des startups et le matching avec les investisseurs les plus compatibles.

**Problème résolu :** Les startups perdent des semaines à envoyer des cold emails à des VCs qui ne correspondent pas à leur profil. Les VCs reçoivent des centaines de pitchs non qualifiés. Alfred centralise et qualifie les deux côtés en quelques minutes.

---

## Stack technique

| Composant | Technologie |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| UI | Tailwind CSS + shadcn/ui |
| Base de données | Supabase (PostgreSQL) |
| Authentification | Supabase Auth (email + password) |
| IA | Anthropic Claude API (claude-sonnet-4-6) |
| Emails | Resend |
| Déploiement | Vercel (auto-deploy depuis GitHub `main`) |
| i18n | Système maison (`lib/i18n.tsx`) — FR / EN |

---

## Structure des pages

```
/                          Landing page (pitch + CTAs)
/about                     Qui sommes-nous
/how-it-works              Comment ça marche (étapes + FAQ)
/signup                    Inscription (startup ou VC)
/login                     Connexion email + password
/auth/callback             Redirection après confirmation email
/startup/submit            Formulaire de soumission startup (2 étapes)
/startup/dashboard         Dashboard startup (Analyse / Matchs / Profil)
/vc/register               Inscription d'un fonds VC
/vc/dashboard              Dashboard VC (Deal Flow / Profil)
```

---

## Routes API

```
POST /api/match            Analyse financière + matching VC (séquentiel)
POST /api/analyze          Analyse financière seule (régénération)
POST /api/send-report      Envoi email rapport IA + top VCs (Resend)
GET  /api/startups         CRUD startups
GET  /api/vcs              CRUD VCs
```

---

## Schéma de base de données

### `startups`
| Colonne | Type | Description |
|---|---|---|
| id | UUID | Clé primaire |
| user_id | UUID | FK → auth.users |
| name | text | Nom de la startup |
| tagline | text | Accroche |
| sector | text | Secteur d'activité |
| stage | text | Pre-seed / Seed / Série A... |
| amount_sought | integer | Montant levée (€) |
| mrr / arr | integer | Revenus récurrents |
| burn_rate | integer | Burn mensuel (€) |
| runway_months | integer | Runway (mois) |
| cac / ltv | integer | Unit economics |
| gross_margin | float | Marge brute (%) |
| growth_mom | float | Croissance MoM (%) |
| active_customers | integer | Clients actifs |
| revenue_last_year | integer | CA N-1 (€) |
| problem / solution | text | Description business |
| market_size / traction | text | Marché et traction |
| pitch_deck_url | text | URL PDF Supabase Storage |
| financial_analysis | JSONB | Rapport IA Claude |
| contact_email | text | Email fondateur |
| created_at | timestamp | Date création |

### `venture_capitals`
| Colonne | Type | Description |
|---|---|---|
| id | UUID | Clé primaire |
| user_id | UUID | FK → auth.users |
| name | text | Nom du fonds |
| sectors | text[] | Secteurs investis |
| stages | text[] | Stades investis |
| ticket_min / ticket_max | integer | Fourchette ticket (€) |
| investment_thesis | text | Thèse d'investissement (texte long) |
| notable_investments | text | Investissements notables |
| website / contact_email | text | Coordonnées |

### `matches`
| Colonne | Type | Description |
|---|---|---|
| id | UUID | Clé primaire |
| startup_id | UUID | FK → startups |
| vc_id | UUID | FK → venture_capitals |
| score | integer | Score de compatibilité 0–100 |
| analysis | text | Explication Claude (2-3 phrases) |
| status | text | pending / contacted / in_discussion / closed / rejected |

---

## Authentification

Basée sur **Supabase Auth** (email + password).

### Flux startup
```
/signup (rôle: startup) → email de confirmation → /auth/callback → /startup/dashboard
```

### Flux VC
```
/signup (rôle: vc) → email de confirmation → /auth/callback → /vc/dashboard
```

### Rôle stocké dans `user_metadata.role`
- `"startup"` → redirige vers `/startup/dashboard`
- `"vc"` → redirige vers `/vc/dashboard`

### Protection des routes
Les pages `/startup/submit`, `/startup/dashboard`, `/vc/register`, `/vc/dashboard` redirigent vers `/login` si l'utilisateur n'est pas connecté (`useAuth()` hook via `lib/auth-context.tsx`).

---

## Internationalisation (i18n)

Système maison sans dépendance externe.

- **Fichier** : `lib/i18n.tsx`
- **Langues** : Français (défaut) + Anglais
- **Hook** : `useLanguage()` → expose `{ t, lang, setLang }`
- **Composant** : `<LanguageToggle />` — bouton FR/EN dans les navbars
- **Persistance** : `localStorage` (`alfred-lang`)

Les traductions couvrent toutes les pages et composants, y compris les prompts Claude (l'analyse et le matching sont générés dans la langue sélectionnée au moment de la soumission).

---

## VCs pré-référencés

**82 fonds français** sont seedés en base via `lib/seed-vcs.ts`, couvrant l'ensemble du marché VC français (Partech, Kima Ventures, Idinvest, Balderton, Sequoia France, etc.).

Le fichier `supabase-schema.sql` contient le schéma SQL complet à exécuter pour initialiser une nouvelle instance Supabase.

---

## Fichiers critiques

| Fichier | Rôle |
|---|---|
| `lib/i18n.tsx` | Toutes les traductions FR/EN |
| `lib/supabase.ts` | Client Supabase + types TypeScript |
| `lib/auth-context.tsx` | Contexte React d'authentification |
| `lib/analyze.ts` | Prompt analyse financière Claude |
| `lib/matching.ts` | Prompt matching VC Claude + pré-filtre |
| `lib/seed-vcs.ts` | 82 VCs français pré-référencés |
| `app/api/match/route.ts` | Route principale : analyse + matching |
| `app/api/send-report/route.ts` | Envoi email rapport |
| `supabase-schema.sql` | Schéma SQL complet |

---

## Déploiement

- **Hébergement** : Vercel (plan Hobby)
- **Repository** : GitHub `alfredauboyneau/alfred-vc-platform`
- **Auto-deploy** : Chaque push sur `main` déclenche un déploiement Vercel
- **URL production** : https://alfred-vc-platform.vercel.app
- **Stockage fichiers** : Supabase Storage (bucket `pitch-decks` pour les PDFs)
