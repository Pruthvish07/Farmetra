import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, TranslationSet } from "./translations";

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: <K extends keyof TranslationSet>(key: K) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<string>(() => {
    return localStorage.getItem("app_lang") || "en";
  });

  const setLanguage = (lang: string) => {
    if (translations[lang]) {
      setLanguageState(lang);
      localStorage.setItem("app_lang", lang);
    }
  };

  const t = <K extends keyof TranslationSet>(key: K): string => {
    const translationSet = translations[language] || translations.en;
    return translationSet[key] || translations.en[key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
