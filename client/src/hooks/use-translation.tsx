import { createContext, useContext, useState, ReactNode } from "react";
import enTranslations from "@/locales/en.json";
import frTranslations from "@/locales/fr.json";
import arTranslations from "@/locales/ar.json";

type Language = "en" | "fr" | "ar";

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LOCALE_STORAGE_KEY = "app_language";

const translations: Record<Language, any> = {
  en: enTranslations,
  fr: frTranslations,
  ar: arTranslations,
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    return (stored as Language) || "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LOCALE_STORAGE_KEY, lang);
    // Set HTML direction for RTL languages
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}
