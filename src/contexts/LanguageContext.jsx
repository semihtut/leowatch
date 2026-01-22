import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    nav: {
      dashboard: 'Dashboard',
      threatPulse: 'Threat Pulse',
      favorites: 'Favorites',
      archive: 'Archive',
      buyMeCoffee: 'Buy me a coffee',
      about: 'About',
    },
    sidebar: {
      securityIntelligence: 'Security Intelligence',
      theme: 'Theme',
      language: 'Language',
    },
  },
  fi: {
    nav: {
      dashboard: 'Etusivu',
      threatPulse: 'Uhkapulssi',
      favorites: 'Suosikit',
      archive: 'Arkisto',
      buyMeCoffee: 'Osta kahvi',
      about: 'Tietoja',
    },
    sidebar: {
      securityIntelligence: 'Tietoturva',
      theme: 'Teema',
      language: 'Kieli',
    },
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fi' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
