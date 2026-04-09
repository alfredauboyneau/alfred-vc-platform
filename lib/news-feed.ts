export type FundingNewsArticle = {
  id: string;
  source: string;
  sourceUrl: string;
  articleUrl: string;
  publishedAt: string;
  title: string;
  excerpt: string;
  sourceLang: "fr" | "en";
  automated: boolean;
};

export type FundingNewsSource = {
  name: string;
  url: string;
  focusFr: string;
  focusEn: string;
};

export type FundingNewsFeedSource = {
  name: string;
  siteUrl: string;
  feedUrl: string;
  sourceLang: "fr" | "en";
  priority: number;
};

export const FUNDING_NEWS_FALLBACK_UPDATED_AT = "2026-04-09T08:00:00.000Z";

export const fundingNewsFeedSources: FundingNewsFeedSource[] = [
  {
    name: "Financial Times",
    siteUrl: "https://www.ft.com/",
    feedUrl: "https://www.ft.com/rss/home",
    sourceLang: "en",
    priority: 100,
  },
  {
    name: "TechCrunch",
    siteUrl: "https://techcrunch.com/",
    feedUrl: "https://techcrunch.com/feed/",
    sourceLang: "en",
    priority: 92,
  },
  {
    name: "Tech.eu",
    siteUrl: "https://tech.eu/",
    feedUrl: "https://tech.eu/feed/",
    sourceLang: "en",
    priority: 88,
  },
  {
    name: "Maddyness",
    siteUrl: "https://www.maddyness.com/",
    feedUrl: "https://www.maddyness.com/feed/",
    sourceLang: "fr",
    priority: 84,
  },
  {
    name: "FrenchWeb",
    siteUrl: "https://www.frenchweb.fr/",
    feedUrl: "https://www.frenchweb.fr/feed/",
    sourceLang: "fr",
    priority: 80,
  },
];

export const fundingNewsFallbackArticles: FundingNewsArticle[] = [
  {
    id: "maddyness-alan-2026-03-11",
    source: "Maddyness",
    sourceUrl: "https://www.maddyness.com/",
    articleUrl:
      "https://www.maddyness.com/2026/03/11/alan-leve-100-millions-deuros-et-devient-rentable-en-france/",
    publishedAt: "2026-03-11T09:00:00.000Z",
    title: "Alan lève 100 millions d'euros et devient rentable en France",
    excerpt:
      "Un tour important relayé par Maddyness, intéressant à la fois pour son montant et pour le signal de maturité opérationnelle envoyé au marché.",
    sourceLang: "fr",
    automated: false,
  },
  {
    id: "maddyness-waiv-2026-03-12",
    source: "Maddyness",
    sourceUrl: "https://www.maddyness.com/",
    articleUrl:
      "https://www.maddyness.com/2026/03/12/waiv-nouveau-spin-out-dowkin-leve-33-millions-de-dollars/",
    publishedAt: "2026-03-12T09:00:00.000Z",
    title: "Waiv, nouveau spin-out d'Owkin, lève 33 millions de dollars",
    excerpt:
      "Une levée deeptech relayée par Maddyness, avec un angle IA et infrastructure de calcul particulièrement lisible pour une veille French Tech.",
    sourceLang: "fr",
    automated: false,
  },
  {
    id: "frenchweb-scorp-io-2026-03-31",
    source: "FrenchWeb",
    sourceUrl: "https://www.frenchweb.fr/",
    articleUrl:
      "https://www.frenchweb.fr/scorp-io-leve-5-millions-deuros-pour-industrialiser-la-decarbonation-des-batiments-intermediaires/461083",
    publishedAt: "2026-03-31T09:00:00.000Z",
    title: "SCorp-io lève 5 millions d'euros pour industrialiser la décarbonation des bâtiments intermédiaires",
    excerpt:
      "FrenchWeb couvre une levée climat avec un cas d'usage très concret, utile pour garder un oeil sur les dossiers industriels et infrastructure.",
    sourceLang: "fr",
    automated: false,
  },
  {
    id: "frenchweb-another-earth-2026-03-12",
    source: "FrenchWeb",
    sourceUrl: "https://www.frenchweb.fr/",
    articleUrl:
      "https://www.frenchweb.fr/another-earth-leve-35-millions-deuros-pour-faire-des-sols-une-brique-strategique-de-la-transition-climatique/453993",
    publishedAt: "2026-03-12T09:00:00.000Z",
    title: "ANOTHER EARTH lève 3,5 millions d'euros pour faire des sols une brique stratégique de la transition climatique",
    excerpt:
      "Un article FrenchWeb utile pour suivre les levées climat très verticales, avec un angle net sur la donnée et l'impact.",
    sourceLang: "fr",
    automated: false,
  },
  {
    id: "techcrunch-ami-2026-03-09",
    source: "TechCrunch",
    sourceUrl: "https://techcrunch.com/",
    articleUrl:
      "https://techcrunch.com/2026/03/09/yann-lecuns-ami-labs-raises-1-03-billion-to-build-world-models/",
    publishedAt: "2026-03-09T09:00:00.000Z",
    title: "Yann LeCun's AMI Labs raises $1.03 billion to build world models",
    excerpt:
      "A major TechCrunch story on an outsized French AI round, useful as a reference point for current market appetite around frontier AI.",
    sourceLang: "en",
    automated: false,
  },
];

export const fundingNewsSources: FundingNewsSource[] = [
  {
    name: "Financial Times",
    url: "https://www.ft.com/",
    focusFr: "Référence business internationale utile pour les tours majeurs, les mouvements de marché et les signaux macro VC.",
    focusEn: "A strong international business source for major rounds, market moves and macro VC signals.",
  },
  {
    name: "Les Echos Start",
    url: "https://start.lesechos.fr/",
    focusFr: "Très bon point d'entrée pour une lecture plus business, corporate et écosystème sur la scène française.",
    focusEn: "A strong business-oriented source for broader French startup and corporate ecosystem coverage.",
  },
  {
    name: "TechCrunch",
    url: "https://techcrunch.com/",
    focusFr: "Source internationale reconnue pour les levées tech, en particulier quand un dossier français a une portée globale.",
    focusEn: "A widely known outlet for tech funding rounds, especially when a French company has global relevance.",
  },
  {
    name: "Tech.eu",
    url: "https://tech.eu/",
    focusFr: "Très utile pour suivre les levées européennes et les mouvements transfrontaliers.",
    focusEn: "Very useful for European rounds and cross-border ecosystem moves.",
  },
  {
    name: "Maddyness",
    url: "https://www.maddyness.com/actu/",
    focusFr: "Référence startup française pour les levées, baromètres mensuels et veille French Tech.",
    focusEn: "A French startup reference for funding rounds, monthly barometers and French Tech monitoring.",
  },
  {
    name: "FrenchWeb",
    url: "https://www.frenchweb.fr/",
    focusFr: "Média solide pour suivre les levées early-stage, B2B et les profils fondateurs.",
    focusEn: "A solid source for early-stage, B2B and founder-focused funding coverage.",
  },
];
