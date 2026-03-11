"use client";

import type { Lang } from "@/lib/i18n";

export type LocalizedOption = {
  value: string;
  fr: string;
  en: string;
};

export const SECTOR_OPTIONS: LocalizedOption[] = [
  { value: "SaaS / Logiciel", fr: "SaaS / Logiciel", en: "SaaS / Software" },
  { value: "FinTech", fr: "FinTech", en: "FinTech" },
  { value: "HealthTech / MedTech", fr: "HealthTech / MedTech", en: "HealthTech / MedTech" },
  { value: "DeepTech / IA", fr: "DeepTech / IA", en: "DeepTech / AI" },
  { value: "GreenTech / CleanTech", fr: "GreenTech / CleanTech", en: "GreenTech / CleanTech" },
  { value: "Cybersécurité", fr: "Cybersécurité", en: "Cybersecurity" },
  { value: "Marketplace", fr: "Marketplace", en: "Marketplace" },
  { value: "EdTech", fr: "EdTech", en: "EdTech" },
  { value: "InsurTech / Assurance", fr: "InsurTech / Assurance", en: "InsurTech / Insurance" },
  { value: "LegalTech / RegTech", fr: "LegalTech / RegTech", en: "LegalTech / RegTech" },
  { value: "RH / Recrutement", fr: "RH / Recrutement", en: "HR / Recruiting" },
  { value: "E-commerce / Retail", fr: "E-commerce / Retail", en: "E-commerce / Retail" },
  { value: "Mode / Luxe", fr: "Mode / Luxe", en: "Fashion / Luxury" },
  { value: "Cosmétique / Beauté", fr: "Cosmétique / Beauté", en: "Cosmetics / Beauty" },
  { value: "Sport & Lifestyle", fr: "Sport & Lifestyle", en: "Sport & Lifestyle" },
  { value: "Médias / Divertissement", fr: "Médias / Divertissement", en: "Media / Entertainment" },
  { value: "Gaming / Jeux Vidéo", fr: "Gaming / Jeux Vidéo", en: "Gaming / Video Games" },
  { value: "Restauration / FoodService", fr: "Restauration / FoodService", en: "Restaurant / FoodService" },
  { value: "FoodTech / AgriTech", fr: "FoodTech / AgriTech", en: "FoodTech / AgriTech" },
  { value: "PropTech / Immobilier", fr: "PropTech / Immobilier", en: "PropTech / Real Estate" },
  { value: "Mobilité / Transport", fr: "Mobilité / Transport", en: "Mobility / Transport" },
  { value: "BTP / Construction", fr: "BTP / Construction", en: "Construction / Building" },
  { value: "Tourisme / Hôtellerie", fr: "Tourisme / Hôtellerie", en: "Tourism / Hospitality" },
  { value: "Services B2B", fr: "Services B2B", en: "B2B Services" },
  { value: "Industrie / Manufacturing", fr: "Industrie / Manufacturing", en: "Industry / Manufacturing" },
  { value: "Énergie", fr: "Énergie", en: "Energy" },
  { value: "Autre", fr: "Autre", en: "Other" },
  { value: "Tous secteurs", fr: "Tous secteurs", en: "All sectors" },
];

export const STAGE_OPTIONS: LocalizedOption[] = [
  { value: "Pre-seed", fr: "Pre-seed", en: "Pre-seed" },
  { value: "Seed", fr: "Seed", en: "Seed" },
  { value: "Série A", fr: "Série A", en: "Series A" },
  { value: "Série B", fr: "Série B", en: "Series B" },
  { value: "Série B+", fr: "Série B+", en: "Series B+" },
];

export function getLocalizedOptions(options: LocalizedOption[], lang: Lang) {
  return options.map((option) => ({
    value: option.value,
    label: lang === "en" ? option.en : option.fr,
  }));
}

function localizeOption(value: string | null | undefined, options: LocalizedOption[], lang: Lang) {
  if (!value) return value ?? "";
  const option = options.find((item) => item.value === value);
  if (!option) return value;
  return lang === "en" ? option.en : option.fr;
}

export function localizeSector(value: string | null | undefined, lang: Lang) {
  return localizeOption(value, SECTOR_OPTIONS, lang);
}

export function localizeStage(value: string | null | undefined, lang: Lang) {
  return localizeOption(value, STAGE_OPTIONS, lang);
}

export function getNumberLocale(lang: Lang) {
  return lang === "en" ? "en-US" : "fr-FR";
}
