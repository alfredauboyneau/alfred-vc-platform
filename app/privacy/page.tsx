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
          eyebrow: "Confidentialite",
          title: "Politique de confidentialite",
          intro:
            "Alfred est pense pour des workflows de levee impliquant des informations financieres et strategiques. Cette page resume la facon dont les donnees produit sont utilisees, stockees et partagees.",
          sections: [
            {
              title: "Donnees collectees",
              paragraphs: [
                "Alfred traite les informations de compte, les donnees de profil startup, le contexte de levee, certaines metriques financieres et, en option, des fichiers comme les pitch decks.",
                "Pour les profils VC, Alfred traite la these d'investissement, les secteurs, les stades et les tickets utilises pour produire les resultats de compatibilite.",
              ],
            },
            {
              title: "Finalites du traitement",
              paragraphs: [
                "Les donnees servent a authentifier les utilisateurs, stocker les profils, generer l'analyse financiere, classer les fonds compatibles et afficher les dashboards du produit.",
                "Quand l'envoi email est active, une synthese du rapport genere peut aussi etre envoyee a l'email de contact fourni par la startup.",
              ],
            },
            {
              title: "Infrastructure et sous-traitants",
              paragraphs: [
                "La stack actuelle utilise Supabase pour l'authentification et la base, Vercel pour l'hebergement, Anthropic pour la generation des rapports et Resend pour les emails transactionnels.",
                "Ces prestataires ne recoivent que les donnees necessaires a la fonction qu'ils assurent.",
              ],
            },
            {
              title: "Conservation et acces",
              paragraphs: [
                "Les donnees restent rattachees a l'espace et au compte qui les ont creees jusqu'a leur suppression ou a l'evolution de la politique du service.",
                "L'acces aux dashboards est reserve aux utilisateurs authentifies. Les informations financieres sensibles ont vocation a rester dans le contexte operatoire du produit.",
              ],
            },
            {
              title: "Securite et demandes",
              paragraphs: [
                "Alfred cherche a limiter l'exposition inutile des informations financieres et a produire un rendu lisible et verifiable plutot qu'une diffusion large des donnees.",
                "Avant un deploiement commercial plus large, cette page devra etre completee avec l'identite formelle du responsable de traitement, les durees de conservation et un contact operationnel.",
              ],
            },
          ],
        };

  return <LegalPageShell {...copy} />;
}
