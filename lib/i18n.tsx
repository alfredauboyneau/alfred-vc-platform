"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Lang = "fr" | "en";

// ─────────────────────────────────────────────
// TOUTES LES TRADUCTIONS
// ─────────────────────────────────────────────
export const translations = {
  fr: {
    nav: {
      isVC: "Je suis un VC",
      raiseFunds: "Lever des fonds",
      editThesis: "Modifier ma thèse",
      dealflow: "Alfred · Deal flow",
      submitNav: "Alfred · Soumission startup",
      dashboardStartup: "Alfred · Dashboard startup",
      vcRegister: "Alfred · Inscription VC",
      about: "Qui sommes-nous",
      howItWorks: "Comment ça marche",
    },
    landing: {
      badge: "Plateforme IA de matching VC x Startup",
      titlePart1: "Trouvez les bons",
      titleHighlight: "investisseurs",
      titlePart2: "en quelques minutes",
      subtitle: "Alfred analyse votre startup, évalue votre santé financière et vous connecte avec les fonds de VC français dont la thèse d'investissement correspond exactement à votre profil.",
      ctaStartup: "Analyser ma startup",
      ctaVC: "Accéder au deal flow",
      stats: {
        vcs: "VCs référencés",
        time: "Pour être analysé",
        ai: "Analyse financière",
        matching: "Matching ciblé",
      },
      howTitle: "Comment ça marche",
      howSubtitle: "De la soumission de votre profil au contact avec les investisseurs, tout est automatisé et piloté par l'IA.",
      steps: [
        {
          title: "Soumettez votre profil",
          desc: "Renseignez les informations de votre startup et vos données financières (MRR, burn rate, traction…).",
        },
        {
          title: "L'IA analyse votre dossier",
          desc: "Claude génère un rapport de santé financière complet : score, forces, risques, unit economics, investment readiness.",
        },
        {
          title: "Matching avec les VCs",
          desc: "Vos top correspondances sont identifiées selon la thèse d'investissement de chaque fonds. Score de 0 à 100.",
        },
      ],
      vcSectionBadge: "Pour les fonds de VC",
      vcSectionTitle: "Un deal flow qualifié,",
      vcSectionTitle2: "pré-analysé par l'IA",
      vcSectionDesc: "Chaque startup est livrée avec un rapport financier complet généré par IA. Vous voyez directement le score de santé, les forces, les risques et l'adéquation avec votre thèse. Plus besoin de trier des centaines de pitchs.",
      vcSectionCta: "Accéder au deal flow",
      vcFeatures: [
        "Rapport financier IA sur chaque dossier",
        "Score de compatibilité avec votre thèse",
        "Filtrage par secteur, stade, ticket",
        "Accès direct aux coordonnées des fondateurs",
        "Mise à jour en temps réel du deal flow",
      ],
      ctaTitle: "Prêt à lever ?",
      ctaDesc: "Soumettez votre startup en 5 minutes et recevez votre analyse financière + vos VCs matchés immédiatement.",
      ctaBtn: "Analyser ma startup gratuitement",
      footerStartups: "Startups",
      footerInvestors: "Investisseurs",
      footerCopyright: "© 2025 Alfred · Plateforme de mise en relation VC x Startup · France",
      footerAbout: "À propos",
    },
    howItWorks: {
      navTitle: "Alfred · Comment ça marche",
      badge: "Le processus",
      title: "Comment ça marche",
      subtitle: "De la soumission de votre profil au contact avec les investisseurs, Alfred automatise chaque étape de votre levée de fonds.",
      steps: [
        {
          number: "01",
          icon: "BarChart3",
          title: "Soumettez votre profil",
          duration: "2 à 5 minutes",
          tagline: "Simple, rapide, sans engagement",
          desc: "Commencez par renseigner les informations de base de votre startup : nom, secteur d'activité, stade de développement, montant recherché et une description de votre projet.",
          details: [
            "Informations générales : nom, secteur, stade, montant recherché",
            "Description du problème résolu et de votre solution",
            "Données financières optionnelles : MRR, ARR, burn rate, runway",
            "Unit economics si disponibles : LTV, CAC, clients actifs",
            "L'IA s'adapte aux données disponibles — même sans revenus",
          ],
          tip: "Plus vous renseignez de données financières, plus l'analyse sera précise et pertinente.",
        },
        {
          number: "02",
          icon: "Brain",
          title: "L'IA analyse votre dossier",
          duration: "30 secondes",
          tagline: "Rapport financier complet, généré automatiquement",
          desc: "Claude, le modèle d'IA d'Anthropic, analyse en profondeur vos données et génère un rapport de santé financière complet. Pas de template générique — chaque rapport est contextualisé selon votre secteur et votre stade.",
          details: [
            "Score de santé financière global de 0 à 100",
            "Analyse des forces et risques spécifiques à votre profil",
            "Évaluation des unit economics : ratio LTV/CAC, burn efficiency",
            "Investment readiness : prêt à lever, bientôt prêt, ou pas encore",
            "Recommandations actionnables pour améliorer votre dossier",
          ],
          tip: "Le rapport est pensé pour être directement partagé avec des investisseurs lors de vos rendez-vous.",
        },
        {
          number: "03",
          icon: "Target",
          title: "Matching avec les VCs",
          duration: "Instantané",
          tagline: "Chaque fonds évalué selon sa thèse d'investissement",
          desc: "Alfred compare votre profil avec la thèse d'investissement de chaque fonds référencé dans la base. Un score de compatibilité de 0 à 100 est calculé pour chaque VC, en tenant compte de tous les critères pertinents.",
          details: [
            "Comparaison avec 98+ fonds de VC français référencés",
            "Score de compatibilité 0-100 par fonds, avec justification",
            "Critères analysés : secteur, stade, ticket, géographie, modèle économique",
            "Top matches classés par pertinence décroissante",
            "Accès aux coordonnées et à la thèse détaillée de chaque VC",
          ],
          tip: "Les VCs sont référencés avec leur thèse d'investissement complète — le matching va bien au-delà des simples critères secteur/stade.",
        },
        {
          number: "04",
          icon: "CheckCircle2",
          title: "Accédez à votre dashboard",
          duration: "Accès immédiat",
          tagline: "Tout au même endroit, prêt à l'action",
          desc: "Votre dashboard personnalisé centralise votre rapport financier IA, vos VCs matchés avec leurs scores et leurs coordonnées. Vous pouvez l'utiliser comme base de prospection pour vos démarches de levée.",
          details: [
            "Rapport financier complet consultable à tout moment",
            "Liste des VCs matchés avec score et justification",
            "Accès direct aux coordonnées des fonds (email, site web)",
            "Indicateurs clés affichés : score santé, LTV/CAC, burn efficiency",
            "Dashboard partageable avec votre équipe ou vos advisors",
          ],
          tip: "Utilisez votre rapport Alfred comme executive summary lors de vos premiers contacts avec les investisseurs.",
        },
      ],
      ctaTitle: "Prêt à commencer ?",
      ctaDesc: "Soumettez votre startup en 5 minutes et recevez votre analyse complète + vos VCs matchés.",
      ctaBtn: "Analyser ma startup gratuitement",
      faqTitle: "Questions fréquentes",
      faq: [
        {
          q: "Combien de temps prend l'analyse ?",
          a: "L'analyse complète (rapport financier + matching VC) prend entre 30 secondes et 2 minutes selon la quantité de données renseignées.",
        },
        {
          q: "Mes données sont-elles sécurisées ?",
          a: "Oui. Vos données financières sont utilisées uniquement pour générer votre rapport et ne sont jamais partagées avec des tiers sans votre accord.",
        },
        {
          q: "Est-ce que je dois avoir des revenus pour être analysé ?",
          a: "Non. L'IA s'adapte aux données disponibles. Même sans revenus, vous obtiendrez une analyse pertinente basée sur votre stade et vos métriques de traction.",
        },
        {
          q: "Comment sont sélectionnés les VCs référencés ?",
          a: "Nous avons pré-référencé 98+ fonds de VC français actifs, avec leur thèse d'investissement complète. Les VCs peuvent également s'inscrire directement sur la plateforme.",
        },
      ],
    },
    about: {
      navTitle: "Alfred · Qui sommes-nous",
      badge: "Notre histoire",
      title: "Fondé par un entrepreneur,",
      titleHighlight: "pour les entrepreneurs",
      subtitle: "Alfred est né d'une frustration réelle : trop de startups prometteuses échouent à lever, non pas par manque de qualité, mais par manque de visibilité auprès des bons investisseurs.",
      founderName: "Alfred Auboyneau",
      founderRole: "Fondateur & CEO",
      storyTitle: "L'origine d'Alfred",
      storyP1: "En accompagnant des startups dans leur recherche de financement, j'ai constaté un paradoxe frappant : d'un côté, des fonds de VC reçoivent des centaines de dossiers non qualifiés par semaine. De l'autre, des startups prometteuses passent des mois à identifier les bons investisseurs et à envoyer des cold emails qui restent sans réponse.",
      storyP2: "Le problème n'est pas un manque d'argent ni de projets de qualité — c'est un problème d'information et d'adéquation. Les startups ne savent pas quels fonds correspondent à leur profil. Les VCs passent trop de temps à trier des dossiers hors-cible. Alfred résout ça avec l'IA.",
      problemTitle: "Le problème",
      problems: [
        "Des centaines de cold emails envoyés dans le vide par les fondateurs",
        "Des semaines perdues à identifier les bons VCs",
        "Des dossiers rejetés non par manque de qualité, mais d'adéquation",
        "Pas d'analyse financière structurée avant de pitcher",
      ],
      solutionTitle: "La solution Alfred",
      solutions: [
        "Une analyse IA de la santé financière de votre startup",
        "Un matching intelligent avec les fonds dont la thèse correspond",
        "Un score de compatibilité de 0 à 100 par fonds",
        "Un rapport structuré, prêt à partager avec les investisseurs",
      ],
      missionTitle: "Notre mission",
      missionDesc: "Démocratiser l'accès au financement VC en France en mettant l'intelligence artificielle au service des fondateurs.",
      ctaStartup: "Analyser ma startup",
      ctaVC: "Accéder au deal flow",
    },
    submit: {
      step1Label: "Profil",
      step2Label: "Finances",
      step3Label: "Analyse IA",
      step1Title: "Profil de votre startup",
      step1Desc: "Décrivez votre projet et ce que vous cherchez.",
      step2Title: "Données financières",
      step2Desc: "Ces données permettent à l'IA de générer votre rapport de santé financière. Renseignez ce que vous avez — les champs sont optionnels.",
      step3Title: "Prêt pour l'analyse",
      step3Desc: "Voici ce que l'IA va faire avec vos données.",
      fields: {
        name: "Nom de la startup *",
        email: "Email de contact *",
        tagline: "Tagline *",
        website: "Site web",
        sector: "Secteur *",
        stage: "Stade *",
        amount: "Montant recherché (€) *",
        founded: "Année de création",
        team: "Taille de l'équipe",
        problem: "Problème résolu *",
        solution: "Solution *",
        market: "Taille de marché",
        traction: "Traction",
        mrr: "MRR — Revenu mensuel récurrent (€)",
        arr: "ARR — Revenu annuel récurrent (€)",
        growth: "Croissance MoM (%)",
        revenue: "CA année précédente (€)",
        burn: "Burn rate mensuel (€)",
        runway: "Runway (mois)",
        margin: "Marge brute (%)",
        cac: "CAC — Coût d'acquisition client (€)",
        ltv: "LTV — Valeur vie client (€)",
        customers: "Clients actifs",
      },
      placeholders: {
        name: "ex: Klark",
        email: "founder@startup.fr",
        tagline: "ex: Le CRM IA pour les PME françaises",
        website: "https://...",
        sector: "Sélectionner",
        stage: "Sélectionner",
        problem: "Quel problème votre startup résout-elle ?",
        solution: "Comment votre produit/service résout ce problème ?",
        market: "ex: Marché français des PME, ~50Md€",
        traction: "Chiffres clés, contrats signés, pilotes en cours...",
      },
      badges: {
        revenue: "Revenus",
        cash: "Cash & Rentabilité",
        unitEco: "Unit Economics",
      },
      aiSteps: [
        "Analyse de la santé financière (score, forces, risques)",
        "Évaluation des unit economics (LTV/CAC, burn efficiency)",
        "Scoring de compatibilité avec chaque VC référencé",
        "Génération de votre rapport personnalisé",
      ],
      btnNext: "Données financières",
      btnLaunch: "Lancer l'analyse",
      btnBack: "Retour",
      btnAnalyze: "Lancer l'analyse IA",
      btnAnalyzing: "Analyse en cours...",
      toastSuccess: "Analyse terminée !",
      toastSuccessDesc: "Vos VCs matchés sont prêts à consulter.",
      toastError: "Erreur",
      toastErrorDesc: "Une erreur est survenue. Vérifiez votre connexion.",
      searchingText: "Recherche (€)",
    },
    dashboard: {
      loading: "Chargement de votre analyse...",
      notFound: "Startup introuvable.",
      notFoundCta: "Soumettre ma startup",
      aiReport: "Rapport financier IA",
      healthScore: "Score de santé financière",
      unitEco: "Unit Economics — LTV/CAC",
      burnEff: "Efficacité du burn",
      strengths: "Forces",
      risks: "Risques",
      matchedVCs: "Vos VCs matchés",
      noMatch: "Aucun match disponible pour le moment.",
      topMatch: "Top match",
      unknown: "VC inconnu",
      ticket: "Ticket",
      site: "Site",
      contact: "Contacter",
      readyLabel: "Prêt à lever",
      soonLabel: "Bientôt prêt",
      notReadyLabel: "Pas encore prêt",
      insufficientData: "Données insuffisantes",
      ratio: "Ratio",
      sought: "recherchés",
    },
    vcRegister: {
      navTitle: "Alfred · Inscription VC",
      title: "Référencez votre fonds",
      subtitle: "Renseignez votre thèse d'investissement — c'est la base sur laquelle l'IA matche les startups avec votre fonds.",
      generalInfo: "Informations générales",
      thesis: "Thèse d'investissement",
      thesisDesc: "C'est le cœur du matching IA — soyez précis sur ce que vous cherchez.",
      fields: {
        name: "Nom du fonds *",
        email: "Email de contact *",
        desc: "Description courte",
        website: "Site web",
        notable: "Investissements notables",
        sectors: "Secteurs d'investissement *",
        stages: "Stades d'investissement *",
        ticketMin: "Ticket minimum (€) *",
        ticketMax: "Ticket maximum (€) *",
        thesisDetail: "Thèse d'investissement détaillée *",
      },
      placeholders: {
        name: "ex: Partech Partners",
        email: "deal@fonds.vc",
        desc: "Présentation du fonds en 2-3 phrases...",
        website: "https://...",
        notable: "ex: Doctolib, Contentsquare, Mirakl...",
        thesisDetail: "Décrivez précisément vos critères : types de marchés, profils de fondateurs, métriques minimales attendues, géographie, technologie, modèle économique préféré...",
        ticketMin: "100000",
        ticketMax: "5000000",
      },
      thesisHint: "Plus votre thèse est détaillée, plus le matching sera précis.",
      submitBtn: "Référencer mon fonds",
      submitting: "Enregistrement...",
      toastSuccess: "Fonds référencé !",
      toastSuccessDesc: "Votre fonds est maintenant visible dans notre base.",
      toastError: "Erreur",
      toastErrorDesc: "Une erreur est survenue.",
      allSectors: "Tous secteurs",
    },
    vcDashboard: {
      loading: "Chargement du deal flow...",
      title: "Deal flow",
      dossiers: "dossiers",
      stats: {
        received: "Dossiers reçus",
        avgScore: "Score moyen",
        ready: "Prêts à lever",
        score75: "Score 75+",
      },
      filters: {
        title: "Filtres",
        stage: "Stade",
        sector: "Secteur",
        readiness: "Investment readiness",
        all: "Tous",
        ready: "Prête à lever",
        soon: "Bientôt prête",
        notReady: "Pas encore",
      },
      noResults: "Aucun dossier ne correspond aux filtres sélectionnés.",
      aiReport: "Rapport IA",
      reduce: "Réduire",
      healthScore: "Score santé",
      unitEco: "Unit Economics",
      strengths: "Forces",
      risks: "Risques",
      insufficientData: "Données insuffisantes",
      site: "Site",
      contact: "Contacter",
      readyLabel: "Prête à lever",
      soonLabel: "Bientôt prête",
      notReadyLabel: "Pas encore prête",
    },
  },

  en: {
    nav: {
      isVC: "I'm a VC",
      raiseFunds: "Raise funds",
      editThesis: "Edit my thesis",
      dealflow: "Alfred · Deal flow",
      submitNav: "Alfred · Startup submission",
      dashboardStartup: "Alfred · Startup dashboard",
      vcRegister: "Alfred · VC registration",
      about: "About",
      howItWorks: "How it works",
    },
    landing: {
      badge: "AI-powered VC x Startup matching platform",
      titlePart1: "Find the right",
      titleHighlight: "investors",
      titlePart2: "in minutes",
      subtitle: "Alfred analyzes your startup, evaluates your financial health, and connects you with French VC funds whose investment thesis perfectly matches your profile.",
      ctaStartup: "Analyze my startup",
      ctaVC: "Access deal flow",
      stats: {
        vcs: "Indexed VCs",
        time: "To be analyzed",
        ai: "Financial analysis",
        matching: "Targeted matching",
      },
      howTitle: "How it works",
      howSubtitle: "From submitting your profile to contacting investors, everything is automated and AI-driven.",
      steps: [
        {
          title: "Submit your profile",
          desc: "Fill in your startup information and financial data (MRR, burn rate, traction…).",
        },
        {
          title: "AI analyzes your file",
          desc: "Claude generates a complete financial health report: score, strengths, risks, unit economics, investment readiness.",
        },
        {
          title: "Matching with VCs",
          desc: "Your top matches are identified based on each fund's investment thesis. Score from 0 to 100.",
        },
      ],
      vcSectionBadge: "For VC funds",
      vcSectionTitle: "A qualified deal flow,",
      vcSectionTitle2: "pre-analyzed by AI",
      vcSectionDesc: "Each startup comes with a complete AI-generated financial report. You see the health score, strengths, risks, and fit with your thesis at a glance. No more sorting through hundreds of pitches.",
      vcSectionCta: "Access deal flow",
      vcFeatures: [
        "AI financial report on each file",
        "Compatibility score with your thesis",
        "Filter by sector, stage, ticket",
        "Direct access to founders' contact details",
        "Real-time deal flow updates",
      ],
      ctaTitle: "Ready to raise?",
      ctaDesc: "Submit your startup in 5 minutes and instantly receive your financial analysis + matched VCs.",
      ctaBtn: "Analyze my startup for free",
      footerStartups: "Startups",
      footerInvestors: "Investors",
      footerCopyright: "© 2025 Alfred · VC x Startup matchmaking platform · France",
      footerAbout: "About",
    },
    howItWorks: {
      navTitle: "Alfred · How it works",
      badge: "The process",
      title: "How it works",
      subtitle: "From submitting your profile to contacting investors, Alfred automates every step of your fundraising journey.",
      steps: [
        {
          number: "01",
          icon: "BarChart3",
          title: "Submit your profile",
          duration: "2 to 5 minutes",
          tagline: "Simple, fast, no commitment",
          desc: "Start by filling in your startup's basic information: name, sector, development stage, funding amount sought, and a description of your project.",
          details: [
            "General info: name, sector, stage, funding sought",
            "Problem and solution description",
            "Optional financial data: MRR, ARR, burn rate, runway",
            "Unit economics if available: LTV, CAC, active customers",
            "AI adapts to available data — even without revenue",
          ],
          tip: "The more financial data you provide, the more precise and relevant your analysis will be.",
        },
        {
          number: "02",
          icon: "Brain",
          title: "AI analyzes your file",
          duration: "30 seconds",
          tagline: "Complete financial report, generated automatically",
          desc: "Claude, Anthropic's AI model, deeply analyzes your data and generates a comprehensive financial health report. No generic template — every report is contextualized to your sector and stage.",
          details: [
            "Global financial health score from 0 to 100",
            "Analysis of strengths and risks specific to your profile",
            "Unit economics evaluation: LTV/CAC ratio, burn efficiency",
            "Investment readiness: ready to raise, almost ready, or not yet",
            "Actionable recommendations to improve your file",
          ],
          tip: "The report is designed to be shared directly with investors during your meetings.",
        },
        {
          number: "03",
          icon: "Target",
          title: "Matching with VCs",
          duration: "Instant",
          tagline: "Each fund evaluated against its investment thesis",
          desc: "Alfred compares your profile with the investment thesis of every indexed fund in the database. A compatibility score from 0 to 100 is calculated for each VC, taking all relevant criteria into account.",
          details: [
            "Comparison with 98+ indexed French VC funds",
            "Compatibility score 0-100 per fund, with justification",
            "Criteria analyzed: sector, stage, ticket, geography, business model",
            "Top matches ranked by relevance",
            "Access to each VC's contact details and detailed thesis",
          ],
          tip: "VCs are indexed with their full investment thesis — matching goes far beyond simple sector/stage criteria.",
        },
        {
          number: "04",
          icon: "CheckCircle2",
          title: "Access your dashboard",
          duration: "Immediate access",
          tagline: "Everything in one place, ready to act",
          desc: "Your personalized dashboard centralizes your AI financial report, matched VCs with their scores and contact details. Use it as a prospecting base for your fundraising outreach.",
          details: [
            "Full financial report accessible at any time",
            "List of matched VCs with score and justification",
            "Direct access to fund contacts (email, website)",
            "Key indicators displayed: health score, LTV/CAC, burn efficiency",
            "Dashboard shareable with your team or advisors",
          ],
          tip: "Use your Alfred report as an executive summary in your first contacts with investors.",
        },
      ],
      ctaTitle: "Ready to start?",
      ctaDesc: "Submit your startup in 5 minutes and get your full analysis + matched VCs.",
      ctaBtn: "Analyze my startup for free",
      faqTitle: "Frequently asked questions",
      faq: [
        {
          q: "How long does the analysis take?",
          a: "The full analysis (financial report + VC matching) takes between 30 seconds and 2 minutes depending on the amount of data provided.",
        },
        {
          q: "Is my data secure?",
          a: "Yes. Your financial data is used solely to generate your report and is never shared with third parties without your consent.",
        },
        {
          q: "Do I need revenue to be analyzed?",
          a: "No. The AI adapts to available data. Even without revenue, you'll get a relevant analysis based on your stage and traction metrics.",
        },
        {
          q: "How are the indexed VCs selected?",
          a: "We have pre-indexed 98+ active French VC funds with their full investment thesis. VCs can also register directly on the platform.",
        },
      ],
    },
    about: {
      navTitle: "Alfred · About",
      badge: "Our story",
      title: "Built by an entrepreneur,",
      titleHighlight: "for entrepreneurs",
      subtitle: "Alfred was born from a real frustration: too many promising startups fail to raise — not because of lack of quality, but lack of visibility to the right investors.",
      founderName: "Alfred Auboyneau",
      founderRole: "Founder & CEO",
      storyTitle: "The origin of Alfred",
      storyP1: "While supporting startups in their fundraising journey, I noticed a striking paradox: on one side, VC funds receive hundreds of unqualified files per week. On the other, promising startups spend months identifying the right investors and sending cold emails that go unanswered.",
      storyP2: "The problem isn't a lack of money or quality projects — it's an information and fit problem. Startups don't know which funds match their profile. VCs spend too much time sorting through off-target files. Alfred solves this with AI.",
      problemTitle: "The problem",
      problems: [
        "Hundreds of cold emails sent into the void by founders",
        "Weeks wasted identifying the right VCs",
        "Files rejected not due to lack of quality, but lack of fit",
        "No structured financial analysis before pitching",
      ],
      solutionTitle: "The Alfred solution",
      solutions: [
        "AI analysis of your startup's financial health",
        "Smart matching with funds whose thesis fits",
        "A compatibility score from 0 to 100 per fund",
        "A structured report, ready to share with investors",
      ],
      missionTitle: "Our mission",
      missionDesc: "Democratize access to VC funding in France by putting artificial intelligence in the service of founders.",
      ctaStartup: "Analyze my startup",
      ctaVC: "Access deal flow",
    },
    submit: {
      step1Label: "Profile",
      step2Label: "Finances",
      step3Label: "AI Analysis",
      step1Title: "Your startup profile",
      step1Desc: "Describe your project and what you're looking for.",
      step2Title: "Financial data",
      step2Desc: "This data allows the AI to generate your financial health report. Fill in what you have — all fields are optional.",
      step3Title: "Ready for analysis",
      step3Desc: "Here's what the AI will do with your data.",
      fields: {
        name: "Startup name *",
        email: "Contact email *",
        tagline: "Tagline *",
        website: "Website",
        sector: "Sector *",
        stage: "Stage *",
        amount: "Amount sought (€) *",
        founded: "Founded year",
        team: "Team size",
        problem: "Problem solved *",
        solution: "Solution *",
        market: "Market size",
        traction: "Traction",
        mrr: "MRR — Monthly Recurring Revenue (€)",
        arr: "ARR — Annual Recurring Revenue (€)",
        growth: "MoM Growth (%)",
        revenue: "Previous year revenue (€)",
        burn: "Monthly burn rate (€)",
        runway: "Runway (months)",
        margin: "Gross margin (%)",
        cac: "CAC — Customer Acquisition Cost (€)",
        ltv: "LTV — Customer Lifetime Value (€)",
        customers: "Active customers",
      },
      placeholders: {
        name: "e.g. Klark",
        email: "founder@startup.com",
        tagline: "e.g. The AI CRM for French SMBs",
        website: "https://...",
        sector: "Select",
        stage: "Select",
        problem: "What problem does your startup solve?",
        solution: "How does your product/service solve it?",
        market: "e.g. French SMB market, ~€50B",
        traction: "Key figures, signed contracts, ongoing pilots...",
      },
      badges: {
        revenue: "Revenue",
        cash: "Cash & Profitability",
        unitEco: "Unit Economics",
      },
      aiSteps: [
        "Financial health analysis (score, strengths, risks)",
        "Unit economics evaluation (LTV/CAC, burn efficiency)",
        "Compatibility scoring with each indexed VC",
        "Generation of your personalized report",
      ],
      btnNext: "Financial data",
      btnLaunch: "Launch analysis",
      btnBack: "Back",
      btnAnalyze: "Launch AI analysis",
      btnAnalyzing: "Analyzing...",
      toastSuccess: "Analysis complete!",
      toastSuccessDesc: "Your matched VCs are ready to view.",
      toastError: "Error",
      toastErrorDesc: "An error occurred. Please check your connection.",
      searchingText: "Seeking (€)",
    },
    dashboard: {
      loading: "Loading your analysis...",
      notFound: "Startup not found.",
      notFoundCta: "Submit my startup",
      aiReport: "AI Financial Report",
      healthScore: "Financial health score",
      unitEco: "Unit Economics — LTV/CAC",
      burnEff: "Burn efficiency",
      strengths: "Strengths",
      risks: "Risks",
      matchedVCs: "Your matched VCs",
      noMatch: "No matches available yet.",
      topMatch: "Top match",
      unknown: "Unknown VC",
      ticket: "Ticket",
      site: "Website",
      contact: "Contact",
      readyLabel: "Ready to raise",
      soonLabel: "Almost ready",
      notReadyLabel: "Not yet ready",
      insufficientData: "Insufficient data",
      ratio: "Ratio",
      sought: "sought",
    },
    vcRegister: {
      navTitle: "Alfred · VC Registration",
      title: "Register your fund",
      subtitle: "Fill in your investment thesis — this is the basis on which AI matches startups with your fund.",
      generalInfo: "General information",
      thesis: "Investment thesis",
      thesisDesc: "This is the core of the AI matching — be precise about what you're looking for.",
      fields: {
        name: "Fund name *",
        email: "Contact email *",
        desc: "Short description",
        website: "Website",
        notable: "Notable investments",
        sectors: "Investment sectors *",
        stages: "Investment stages *",
        ticketMin: "Minimum ticket (€) *",
        ticketMax: "Maximum ticket (€) *",
        thesisDetail: "Detailed investment thesis *",
      },
      placeholders: {
        name: "e.g. Partech Partners",
        email: "deal@fund.vc",
        desc: "Fund overview in 2-3 sentences...",
        website: "https://...",
        notable: "e.g. Doctolib, Contentsquare, Mirakl...",
        thesisDetail: "Describe your criteria precisely: market types, founder profiles, minimum expected metrics, geography, technology, preferred business model...",
        ticketMin: "100000",
        ticketMax: "5000000",
      },
      thesisHint: "The more detailed your thesis, the more precise the matching.",
      submitBtn: "Register my fund",
      submitting: "Saving...",
      toastSuccess: "Fund registered!",
      toastSuccessDesc: "Your fund is now visible in our database.",
      toastError: "Error",
      toastErrorDesc: "An error occurred.",
      allSectors: "All sectors",
    },
    vcDashboard: {
      loading: "Loading deal flow...",
      title: "Deal flow",
      dossiers: "files",
      stats: {
        received: "Files received",
        avgScore: "Average score",
        ready: "Ready to raise",
        score75: "Score 75+",
      },
      filters: {
        title: "Filters",
        stage: "Stage",
        sector: "Sector",
        readiness: "Investment readiness",
        all: "All",
        ready: "Ready to raise",
        soon: "Almost ready",
        notReady: "Not yet",
      },
      noResults: "No files match the selected filters.",
      aiReport: "AI Report",
      reduce: "Collapse",
      healthScore: "Health score",
      unitEco: "Unit Economics",
      strengths: "Strengths",
      risks: "Risks",
      insufficientData: "Insufficient data",
      site: "Website",
      contact: "Contact",
      readyLabel: "Ready to raise",
      soonLabel: "Almost ready",
      notReadyLabel: "Not yet ready",
    },
  },
};

// ─────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────
const LanguageContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: typeof translations.fr;
}>({
  lang: "fr",
  setLang: () => {},
  t: translations.fr,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const saved = localStorage.getItem("alfred-lang") as Lang | null;
    if (saved === "en" || saved === "fr") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("alfred-lang", l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ─────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────
export function useLanguage() {
  return useContext(LanguageContext);
}

// ─────────────────────────────────────────────
// BOUTON DE BASCULE FR / EN
// ─────────────────────────────────────────────
export function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-full p-0.5">
      <button
        onClick={() => setLang("fr")}
        className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
          lang === "fr"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        🇫🇷 FR
      </button>
      <button
        onClick={() => setLang("en")}
        className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
          lang === "en"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        🇬🇧 EN
      </button>
    </div>
  );
}
