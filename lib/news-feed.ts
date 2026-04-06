export type FundingNewsArticle = {
  company: string;
  amountFr: string;
  amountEn: string;
  source: string;
  articleUrl: string;
  publishedAt: string;
  topicFr: string;
  topicEn: string;
  headlineFr: string;
  headlineEn: string;
  summaryFr: string;
  summaryEn: string;
};

export type FundingNewsSource = {
  name: string;
  url: string;
  focusFr: string;
  focusEn: string;
};

export const FUNDING_NEWS_UPDATED_AT = "2026-04-06";

export const fundingNewsArticles: FundingNewsArticle[] = [
  {
    company: "SCorp-io",
    amountFr: "5 M€",
    amountEn: "EUR5m",
    source: "FrenchWeb",
    articleUrl:
      "https://www.frenchweb.fr/scorp-io-leve-5-millions-deuros-pour-industrialiser-la-decarbonation-des-batiments-intermediaires/461083",
    publishedAt: "2026-03-31",
    topicFr: "Climat / Industrie",
    topicEn: "Climate / Industry",
    headlineFr: "SCorp-io lève 5 M€ pour industrialiser la décarbonation des bâtiments",
    headlineEn: "SCorp-io raises EUR5m to industrialize building decarbonization",
    summaryFr:
      "FrenchWeb relaie un tour destiné à industrialiser une solution de décarbonation pour les bâtiments intermédiaires, avec un positionnement climat très concret.",
    summaryEn:
      "FrenchWeb reports on a round aimed at scaling a decarbonization solution for mid-sized buildings, with a concrete climate angle.",
  },
  {
    company: "Waiv",
    amountFr: "33 M$",
    amountEn: "USD33m",
    source: "Maddyness",
    articleUrl:
      "https://www.maddyness.com/2026/03/12/waiv-nouveau-spin-out-dowkin-leve-33-millions-de-dollars/",
    publishedAt: "2026-03-12",
    topicFr: "DeepTech / IA",
    topicEn: "DeepTech / AI",
    headlineFr: "Waiv lève 33 M$ pour accélérer le computer design",
    headlineEn: "Waiv raises USD33m to accelerate computer design",
    summaryFr:
      "Maddyness couvre une levée deeptech franco-suisse positionnée sur l'IA appliquée à la conception de systèmes complexes.",
    summaryEn:
      "Maddyness covers a French-Swiss deeptech round focused on AI applied to complex system design.",
  },
  {
    company: "ANOTHER EARTH",
    amountFr: "3,5 M€",
    amountEn: "EUR3.5m",
    source: "FrenchWeb",
    articleUrl:
      "https://www.frenchweb.fr/another-earth-leve-35-millions-deuros-pour-faire-des-sols-une-brique-strategique-de-la-transition-climatique/453993",
    publishedAt: "2026-03-12",
    topicFr: "Climat",
    topicEn: "Climate",
    headlineFr: "ANOTHER EARTH lève 3,5 M€ autour de la santé des sols",
    headlineEn: "ANOTHER EARTH raises EUR3.5m around soil health",
    summaryFr:
      "FrenchWeb met en avant une levée orientée climat, avec un positionnement très vertical sur la donnée et la valorisation des sols.",
    summaryEn:
      "FrenchWeb highlights a climate round with a strongly vertical positioning around soil data and soil value creation.",
  },
  {
    company: "Alan",
    amountFr: "100 M€",
    amountEn: "EUR100m",
    source: "Maddyness",
    articleUrl:
      "https://www.maddyness.com/2026/03/11/alan-leve-100-millions-deuros-et-devient-rentable-en-france/",
    publishedAt: "2026-03-11",
    topicFr: "FinTech / AssurTech",
    topicEn: "FinTech / InsurTech",
    headlineFr: "Alan lève 100 M€ et annonce sa rentabilité en France",
    headlineEn: "Alan raises EUR100m and says it is profitable in France",
    summaryFr:
      "Un tour majeur relayé par Maddyness, intéressant à la fois pour la taille du financement et pour le signal de maturité opérationnelle.",
    summaryEn:
      "A major round covered by Maddyness, notable both for the size of the financing and for the operating maturity signal.",
  },
  {
    company: "AMI",
    amountFr: "1,03 Md$",
    amountEn: "USD1.03bn",
    source: "TechCrunch",
    articleUrl:
      "https://techcrunch.com/2026/03/09/yann-lecuns-ami-labs-raises-1-03-billion-to-build-world-models/",
    publishedAt: "2026-03-09",
    topicFr: "IA / Robotique",
    topicEn: "AI / Robotics",
    headlineFr: "AMI signe une seed hors norme de 1,03 Md$ dans la robotique",
    headlineEn: "AMI lands an outsized USD1.03b seed round in robotics",
    summaryFr:
      "TechCrunch signale un tour exceptionnel pour une startup française qui entraîne des modèles fondamentaux appliqués à la robotique.",
    summaryEn:
      "TechCrunch reports an exceptional round for a French startup training foundation models for robotics.",
  },
  {
    company: "French Tech",
    amountFr: "407 M€",
    amountEn: "EUR407m",
    source: "Maddyness",
    articleUrl:
      "https://www.maddyness.com/2026/03/02/french-tech-un-mois-de-fevrier-encourageant-avec-407-millions-deuros-leves/",
    publishedAt: "2026-03-02",
    topicFr: "Baromètre marché",
    topicEn: "Market pulse",
    headlineFr: "La French Tech a levé 407 M€ en février 2026",
    headlineEn: "French Tech raised EUR407m in February 2026",
    summaryFr:
      "Le baromètre mensuel de Maddyness offre une vue marché utile pour suivre le volume global, les secteurs actifs et la dynamique des tours récents.",
    summaryEn:
      "Maddyness' monthly barometer is useful to track overall volume, active sectors and the pace of recent rounds.",
  },
];

export const fundingNewsSources: FundingNewsSource[] = [
  {
    name: "Maddyness",
    url: "https://www.maddyness.com/actu/",
    focusFr: "Référence française pour les levées, baromètres mensuels et actualité startup.",
    focusEn: "French reference for funding rounds, monthly barometers and startup coverage.",
  },
  {
    name: "FrenchWeb",
    url: "https://www.frenchweb.fr/",
    focusFr: "Média utile pour suivre les tours early-stage, les profils fondateurs et les sujets B2B.",
    focusEn: "Useful outlet for early-stage rounds, founder profiles and B2B stories.",
  },
  {
    name: "Sifted",
    url: "https://sifted.eu/articles/",
    focusFr: "Lecture européenne plus analytique sur les scale-ups, les tours tardifs et les tendances VC.",
    focusEn: "A more analytical European read on scale-ups, later-stage rounds and VC trends.",
  },
  {
    name: "Tech.eu",
    url: "https://tech.eu/category/news/",
    focusFr: "Couverture Europe tech pour repérer les tours transfrontaliers et les mouvements d'écosystème.",
    focusEn: "Europe-wide coverage to spot cross-border rounds and ecosystem moves.",
  },
  {
    name: "Les Echos Start",
    url: "https://start.lesechos.fr/",
    focusFr: "Bon point d'entrée pour les dossiers plus généralistes, business et corporate.",
    focusEn: "A good entry point for broader business, corporate and ecosystem stories.",
  },
  {
    name: "La Tribune",
    url: "https://www.latribune.fr/entreprises-finance/start-up/",
    focusFr: "À suivre pour les tours français, les régions et les sujets industriels.",
    focusEn: "Worth following for French rounds, regional ecosystems and industrial stories.",
  },
];
