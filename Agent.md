# Agent.md — Alfred IA : Architecture & Comportement

## Vue d'ensemble

Alfred utilise **Claude (claude-sonnet-4-6)** comme moteur IA pour deux tâches distinctes et séquentielles :

1. **Analyse financière** — évaluation de la santé d'une startup
2. **Matching VC** — score de compatibilité entre la startup et chaque fonds

---

## Flux d'exécution

```
Startup soumet formulaire
        │
        ▼
POST /api/match
        │
        ├─► [Si pas d'analyse existante]
        │         POST analyzeStartupFinancials()
        │         → Claude génère rapport JSON
        │         → Sauvegardé dans startups.financial_analysis
        │
        ├─► Récupération de tous les VCs en DB
        │
        ├─► matchStartupWithVCs()
        │         → Claude évalue chaque VC
        │         → Retourne scores + analyses
        │
        ├─► Sauvegarde des matches en DB
        │
        └─► POST /api/send-report (non-bloquant)
                  → Email HTML envoyé via Resend
```

---

## 1. Analyse financière (`lib/analyze.ts`)

### Entrée
Données de la startup : MRR, ARR, burn rate, runway, CAC, LTV, marge brute, clients actifs, CA N-1, problème/solution/marché/traction.

### Prompt
Le prompt est bilingue. La langue est sélectionnée via le paramètre `lang` (`"fr"` par défaut, `"en"` si l'utilisateur est en mode anglais au moment de la soumission).

### Sortie JSON
```json
{
  "financial_health_score": 78,
  "growth_trajectory": "strong",
  "unit_economics": {
    "ltv_cac_ratio": 3.2,
    "assessment": "Sain (3-5)",
    "comment": "Le ratio LTV/CAC est sain..."
  },
  "burn_efficiency": "La startup consomme...",
  "key_strengths": ["Croissance MoM +25%", "Marge brute 72%"],
  "key_risks": ["Runway 8 mois", "CAC élevé"],
  "investment_readiness": "ready",
  "summary": "Résumé narratif 3-4 phrases..."
}
```

### Valeurs possibles
| Champ | Valeurs |
|---|---|
| `growth_trajectory` | `weak` / `moderate` / `strong` / `exceptional` |
| `investment_readiness` | `not_ready` / `soon` / `ready` |
| `financial_health_score` | 0 – 100 |

---

## 2. Matching VC (`lib/matching.ts`)

### Pré-filtrage
Avant d'appeler Claude, un algorithme de scoring léger (`preFilterVCs`) sélectionne les **35 VCs les plus pertinents** parmi ceux en base, selon :
- Correspondance mots-clés secteur (×4 pts)
- Correspondance stade d'investissement (×5 pts)
- Adéquation ticket (×2–5 pts)

Cela évite les prompts trop longs et les erreurs de token.

### Prompt
Bilingue (FR/EN selon `lang`). Claude reçoit :
- Le profil complet de la startup
- Le rapport d'analyse financière (généré à l'étape 1)
- La liste des 35 VCs pré-sélectionnés (nom, secteurs, stades, ticket, thèse)

### Pondération du score
| Critère | Poids |
|---|---|
| Adéquation secteur / thèse | 50% |
| Stade + ticket | 30% |
| Attractivité financière | 20% |

### Sortie JSON
```json
[
  {
    "vc_id": "uuid-du-vc",
    "score": 87,
    "analysis": "2-3 phrases expliquant la compatibilité..."
  }
]
```

Les résultats sont triés par score décroissant avant sauvegarde.

---

## 3. Support multilingue

Le paramètre `lang` est transmis depuis le formulaire de soumission (`/startup/submit`) jusqu'aux prompts Claude :

```
submit/page.tsx  →  { startup_id, lang }  →  POST /api/match
                                                    │
                                          analyzeStartupFinancials(startup, lang)
                                          matchStartupWithVCs(startup, vcs, fa, lang)
```

**Important :** L'analyse est générée **une seule fois** et stockée en base. Si la langue est changée après soumission, le contenu textuel (summary, key_strengths, etc.) reste dans la langue d'origine. Seuls les labels UI basculent.

---

## 4. Route `/api/analyze` (standalone)

Permet de régénérer l'analyse financière d'une startup sans relancer le matching complet.

```
POST /api/analyze
Body: { startup_id: string, lang?: "fr" | "en" }
```

---

## 5. Email de rapport (`/api/send-report`)

Déclenché automatiquement après chaque matching (non-bloquant). Envoie un email HTML via **Resend** contenant :
- Le rapport financier IA (score, forces, risques, résumé)
- Les top 5 VCs matchés avec leurs scores et analyses

Variables d'environnement requises :
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` (ex: `alfred@votredomaine.com`)

---

## Variables d'environnement

| Variable | Usage |
|---|---|
| `ANTHROPIC_API_KEY` | Accès à Claude (analyse + matching) |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique Supabase |
| `RESEND_API_KEY` | Envoi d'emails |
| `RESEND_FROM_EMAIL` | Adresse expéditeur |
| `NEXT_PUBLIC_APP_URL` | URL de base (ex: https://alfred-vc-platform.vercel.app) |
