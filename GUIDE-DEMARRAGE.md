# 🚀 Guide de démarrage — DealFlow

## Ce que tu as entre les mains

Une plateforme complète de matching VC x Startup avec :
- Landing page moderne
- Formulaire startup multi-étapes (profil + finances)
- Analyse financière par Claude (IA)
- Matching IA avec scoring 0-100
- Dashboard startup (rapport + VCs matchés)
- Dashboard VC (deal flow filtrable + rapport IA sur chaque dossier)
- 35+ VCs français pré-référencés

---

## Étape 1 — Installer Node.js (si pas déjà fait)

1. Va sur https://nodejs.org
2. Télécharge la version **LTS** (Long Term Support)
3. Lance l'installateur et suis les étapes
4. Vérifie l'installation : ouvre le Terminal et tape `node --version`

---

## Étape 2 — Créer un compte Supabase (gratuit)

1. Va sur https://supabase.com
2. Clique **Start your project** → connecte-toi avec GitHub ou email
3. Crée un nouveau projet : **New Project**
   - Nom : `dealflow`
   - Région : `West EU (Ireland)` ou `Central EU (Frankfurt)`
   - Mot de passe DB : génère-en un fort et note-le
4. Attends ~2 minutes que le projet se configure

### Créer les tables

1. Dans le dashboard Supabase → **SQL Editor** (icône en forme de code)
2. Clique **New Query**
3. Copie-colle tout le contenu du fichier `supabase-schema.sql`
4. Clique **Run** (ou Ctrl+Enter)
5. Tu dois voir `Success. No rows returned.`

### Récupérer tes clés API

1. Dans Supabase → **Project Settings** (icône engrenage) → **API**
2. Note :
   - **Project URL** (ex: `https://abcdef.supabase.co`)
   - **anon public** key (la clé longue sous "Project API keys")

---

## Étape 3 — Créer un compte Anthropic (Claude API)

1. Va sur https://console.anthropic.com
2. Crée un compte ou connecte-toi
3. Va dans **API Keys** → **Create Key**
4. Donne-lui un nom (ex: "DealFlow") et copie la clé

⚠️ Tu as droit à $5 de crédit gratuit pour commencer.

---

## Étape 4 — Configurer les variables d'environnement

1. Dans le dossier du projet, trouve le fichier `.env.local.example`
2. **Duplique-le** et renomme la copie `.env.local`
3. Ouvre `.env.local` et remplis :

```
NEXT_PUBLIC_SUPABASE_URL=https://ton-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ta-cle-anon-supabase
ANTHROPIC_API_KEY=sk-ant-ta-cle-anthropic
```

---

## Étape 5 — Installer les dépendances et lancer le projet

Ouvre le **Terminal** dans le dossier du projet :

```bash
# Aller dans le dossier
cd "/Users/ton-nom/Desktop/Plateforme VC STARTUP"

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

Puis ouvre http://localhost:3000 dans ton navigateur.

---

## Étape 6 — Seeder les VCs français

Une fois le projet lancé, dans un **deuxième** Terminal :

```bash
cd "/Users/ton-nom/Desktop/Plateforme VC STARTUP"
npx tsx lib/seed-vcs.ts
```

Cela va insérer automatiquement les 35 VCs français dans ta base Supabase.

---

## Test de la plateforme

1. **Landing page** : http://localhost:3000
2. **Soumettre une startup** : http://localhost:3000/startup/submit
3. **Deal flow VC** : http://localhost:3000/vc/dashboard
4. **Référencer un VC** : http://localhost:3000/vc/register

---

## Déploiement sur Vercel (gratuit)

1. Crée un compte sur https://vercel.com (connecte-toi avec GitHub)
2. **Import Git Repository** → pousse ton code sur GitHub d'abord
3. Configure les **Environment Variables** dans Vercel (les mêmes que `.env.local`)
4. Clique **Deploy** → ton app sera en ligne en ~2 minutes

---

## Structure des fichiers (rappel)

```
app/
  page.tsx              → Landing page
  startup/
    submit/page.tsx     → Formulaire startup (3 étapes)
    dashboard/page.tsx  → Rapport IA + VCs matchés
  vc/
    register/page.tsx   → Inscription VC
    dashboard/page.tsx  → Deal flow filtrable
  api/
    analyze/route.ts    → Analyse financière Claude
    match/route.ts      → Matching VCs par Claude
    vcs/route.ts        → API VCs
    startups/route.ts   → API Startups

lib/
  supabase.ts           → Client DB + types
  claude.ts             → Client IA
  analyze.ts            → Prompt analyse financière
  matching.ts           → Prompt matching VCs
  seed-vcs.ts           → Script de seed des VCs français
```

---

## Questions fréquentes

**Q : L'analyse prend longtemps ?**
R : Normal, Claude prend ~10-30 secondes pour analyser. Un spinner s'affiche pendant ce temps.

**Q : Je peux ajouter d'autres VCs ?**
R : Oui, via le formulaire `/vc/register` ou en modifiant le fichier `lib/seed-vcs.ts`.

**Q : Comment relancer le matching pour une startup existante ?**
R : Appelle l'API : `POST /api/match` avec `{ "startup_id": "..." }`.
