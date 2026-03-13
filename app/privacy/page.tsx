"use client";

import { useLanguage } from "@/lib/i18n";
import { LegalPageShell } from "@/components/legal-page-shell";

export default function PrivacyPage() {
  const { lang } = useLanguage();

  const copy =
    lang === "en"
      ? {
          eyebrow: "Privacy",
          title: "Privacy policy",
          intro:
            "Alfred is built for startup fundraising workflows involving financial and strategic information. This page summarizes how product data is used, stored and shared.",
          sections: [
            {
              title: "Data collected",
              paragraphs: [
                "Alfred processes account information, startup profile data, fundraising context, selected financial metrics, and optional files such as pitch decks.",
                "For VC profiles, Alfred processes thesis information, sectors, stages and ticket ranges used to produce compatibility results.",
              ],
            },
            {
              title: "Purpose of processing",
              paragraphs: [
                "Data is used to authenticate users, store profiles, generate financial analysis, rank compatible funds and display dashboards inside the product.",
                "When reporting by email is enabled, a summary of the generated report can also be sent to the contact email provided by the startup.",
              ],
            },
            {
              title: "Infrastructure and subprocessors",
              paragraphs: [
                "The current product stack uses Supabase for authentication and database storage, Vercel for hosting, Anthropic for report generation, and Resend for transactional emails.",
                "These providers only receive the data required for the specific function they support.",
              ],
            },
            {
              title: "Retention and access",
              paragraphs: [
                "Data remains associated with the workspace and account that created it until it is deleted or the service policy changes.",
                "Access to dashboards is restricted to authenticated users. Sensitive financial information is intended to stay within the operating context of the product.",
              ],
            },
            {
              title: "Security and requests",
              paragraphs: [
                "Alfred aims to minimize unnecessary exposure of financial information and to keep the output readable and auditable rather than widely redistributed.",
                "Before wider commercial rollout, this page should be completed with formal controller details, retention windows and operational contact information.",
              ],
            },
          ],
        }
      : {
          eyebrow: "Confidentialité",
          title: "Politique de confidentialité",
          intro:
            "Alfred est pensé pour des workflows de levée impliquant des informations financières et stratégiques. Cette page résume la façon dont les données produit sont utilisées, stockées et partagées.",
          sections: [
            {
              title: "Données collectées",
              paragraphs: [
                "Alfred traite les informations de compte, les données de profil startup, le contexte de levée, certaines métriques financières et, en option, des fichiers comme les pitch decks.",
                "Pour les profils VC, Alfred traite la thèse d'investissement, les secteurs, les stades et les tickets utilisés pour produire les résultats de compatibilité.",
              ],
            },
            {
              title: "Finalités du traitement",
              paragraphs: [
                "Les données servent à authentifier les utilisateurs, stocker les profils, générer l'analyse financière, classer les fonds compatibles et afficher les tableaux de bord du produit.",
                "Quand l'envoi email est activé, une synthèse du rapport généré peut aussi être envoyée à l'email de contact fourni par la startup.",
              ],
            },
            {
              title: "Infrastructure et sous-traitants",
              paragraphs: [
                "La stack actuelle utilise Supabase pour l'authentification et la base, Vercel pour l'hébergement, Anthropic pour la génération des rapports et Resend pour les emails transactionnels.",
                "Ces prestataires ne reçoivent que les données nécessaires à la fonction qu'ils assurent.",
              ],
            },
            {
              title: "Conservation et accès",
              paragraphs: [
                "Les données restent rattachées à l'espace et au compte qui les ont créées jusqu'à leur suppression ou à l'évolution de la politique du service.",
                "L'accès aux tableaux de bord est réservé aux utilisateurs authentifiés. Les informations financières sensibles ont vocation à rester dans le contexte opératoire du produit.",
              ],
            },
            {
              title: "Sécurité et demandes",
              paragraphs: [
                "Alfred cherche à limiter l'exposition inutile des informations financières et à produire un rendu lisible et vérifiable plutôt qu'une diffusion large des données.",
                "Avant un déploiement commercial plus large, cette page devra être complétée avec l'identité formelle du responsable de traitement, les durées de conservation et un contact opérationnel.",
              ],
            },
          ],
        };

  return <LegalPageShell {...copy} />;
}
