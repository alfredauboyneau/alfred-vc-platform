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
          eyebrow: "Mentions legales",
          title: "Mentions legales",
          intro:
            "Cette page presente l'etat actuel de publication du site Alfred et le cadrage legal minimal disponible a ce stade du produit.",
          sections: [
            {
              title: "Perimetre du site",
              paragraphs: [
                "Alfred est un produit logiciel centre sur la qualification startup, la revue financiere et le matching VC.",
                "Le site public actuel presente le produit, sa methode et les parcours utilisateur pour les startups et les fonds.",
              ],
            },
            {
              title: "Hebergement et infrastructure coeur",
              paragraphs: [
                "Le site est heberge sur Vercel. Les donnees applicatives et l'authentification sont gerees via Supabase. L'envoi email peut reposer sur Resend et les rendus IA sur les services d'Anthropic.",
              ],
            },
            {
              title: "Informations de publication",
              paragraphs: [
                "L'identite editeur formelle, les informations societaires et le contact legal doivent etre completes avant une diffusion commerciale a plus grande echelle.",
                "A ce stade, cette page vise a eviter une surface legale vide tout en gardant uniquement des informations exactes.",
              ],
            },
            {
              title: "Propriete intellectuelle et usage",
              paragraphs: [
                "Sauf mention contraire, la structure du produit, les textes, l'interface et les workflows presentes sur ce site relevent de l'environnement produit Alfred.",
                "Toute reutilisation au-dela d'une evaluation normale du produit ou d'un usage client doit etre autorisee expressement.",
              ],
            },
          ],
        };

  return <LegalPageShell {...copy} />;
}
