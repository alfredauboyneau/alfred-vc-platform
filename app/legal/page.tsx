"use client";

import { useLanguage } from "@/lib/i18n";
import { LegalPageShell } from "@/components/legal-page-shell";

export default function LegalPage() {
  const { lang } = useLanguage();

  const copy =
    lang === "en"
      ? {
          eyebrow: "Legal",
          title: "Legal notice",
          intro:
            "This page provides the current publication status of the Alfred website and the minimum legal framing available at this stage of the product.",
          sections: [
            {
              title: "Website scope",
              paragraphs: [
                "Alfred is a software product focused on startup qualification, financial review and VC matching.",
                "The current public website presents the product, its methodology and the user journeys for startups and funds.",
              ],
            },
            {
              title: "Hosting and core infrastructure",
              paragraphs: [
                "The website is hosted on Vercel. Application data and authentication are managed through Supabase. Email delivery may rely on Resend, and AI-generated outputs rely on Anthropic services.",
              ],
            },
            {
              title: "Publication details",
              paragraphs: [
                "The formal publisher identity, corporate details and legal contact information should be completed before large-scale commercial distribution.",
                "At this stage, the page is intended to avoid an empty legal surface while keeping the published information accurate.",
              ],
            },
            {
              title: "Intellectual property and use",
              paragraphs: [
                "Unless stated otherwise, the product structure, text, interface and generated workflows presented on this site are part of the Alfred product environment.",
                "Any reuse beyond normal product evaluation or customer use should be expressly authorized.",
              ],
            },
          ],
        }
      : {
          eyebrow: "Mentions légales",
          title: "Mentions légales",
          intro:
            "Cette page présente l'état actuel de publication du site Alfred et le cadrage légal minimal disponible à ce stade du produit.",
          sections: [
            {
              title: "Périmètre du site",
              paragraphs: [
                "Alfred est un produit logiciel centré sur la qualification startup, la revue financière et le matching VC.",
                "Le site public actuel présente le produit, sa méthode et les parcours utilisateur pour les startups et les fonds.",
              ],
            },
            {
              title: "Hébergement et infrastructure cœur",
              paragraphs: [
                "Le site est hébergé sur Vercel. Les données applicatives et l'authentification sont gérées via Supabase. L'envoi email peut reposer sur Resend et les rendus IA sur les services d'Anthropic.",
              ],
            },
            {
              title: "Informations de publication",
              paragraphs: [
                "L'identité éditrice formelle, les informations sociétaires et le contact légal doivent être complétés avant une diffusion commerciale à plus grande échelle.",
                "À ce stade, cette page vise à éviter une surface légale vide tout en gardant uniquement des informations exactes.",
              ],
            },
            {
              title: "Propriété intellectuelle et usage",
              paragraphs: [
                "Sauf mention contraire, la structure du produit, les textes, l'interface et les workflows présentés sur ce site relèvent de l'environnement produit Alfred.",
                "Toute réutilisation au-delà d'une évaluation normale du produit ou d'un usage client doit être autorisée expressément.",
              ],
            },
          ],
        };

  return <LegalPageShell {...copy} />;
}
