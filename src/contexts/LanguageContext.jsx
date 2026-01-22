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
    dashboard: {
      title: "Today's Briefings",
      searchPlaceholder: 'Search by title, CVE, or tag...',
      all: 'All',
      noMatch: 'No briefings match your filters',
      noBriefings: 'No briefings for today yet',
    },
    threatPulse: {
      title: 'Threat Pulse',
      today: 'Today',
      selectDate: 'Select a date',
      clickToView: 'Click on a date to view briefings.',
      noBriefings: 'No briefings on this date.',
      noSeverityBriefings: 'No {severity} briefings.',
      critical: 'Critical',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      medLow: 'Med/Low',
    },
    archive: {
      title: 'Briefing Archive',
      subtitle: 'Browse all security briefings',
      searchPlaceholder: 'Search by title, tag, or CVE...',
      allSeverities: 'All Severities',
      showing: 'Showing',
      of: 'of',
      briefings: 'briefings',
      noMatch: 'No briefings match your filters.',
    },
    favorites: {
      title: 'Favorites',
      savedCount: 'You have {count} saved briefing',
      savedCountPlural: 'You have {count} saved briefings',
      saveHint: 'Save important briefings for quick access',
      clearAll: 'Clear All',
      clearConfirm: 'Are you sure you want to clear all favorites?',
      noFavorites: 'No favorites yet',
      addHint: 'Click the heart icon on any briefing to save it here for quick access later.',
    },
    common: {
      all: 'All',
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
    dashboard: {
      title: 'Päivän tiedotteet',
      searchPlaceholder: 'Hae otsikon, CVE:n tai tagin mukaan...',
      all: 'Kaikki',
      noMatch: 'Ei hakua vastaavia tiedotteita',
      noBriefings: 'Ei tiedotteita tänään',
    },
    threatPulse: {
      title: 'Uhkapulssi',
      today: 'Tänään',
      selectDate: 'Valitse päivä',
      clickToView: 'Klikkaa päivää nähdäksesi tiedotteet.',
      noBriefings: 'Ei tiedotteita tänä päivänä.',
      noSeverityBriefings: 'Ei {severity}-tason tiedotteita.',
      critical: 'Kriittinen',
      high: 'Korkea',
      medium: 'Keskitaso',
      low: 'Matala',
      medLow: 'Keski/Matala',
    },
    archive: {
      title: 'Tiedotearkisto',
      subtitle: 'Selaa kaikkia tietoturvatiedotteita',
      searchPlaceholder: 'Hae otsikon, tagin tai CVE:n mukaan...',
      allSeverities: 'Kaikki vakavuudet',
      showing: 'Näytetään',
      of: '/',
      briefings: 'tiedotetta',
      noMatch: 'Ei hakua vastaavia tiedotteita.',
    },
    favorites: {
      title: 'Suosikit',
      savedCount: 'Sinulla on {count} tallennettu tiedote',
      savedCountPlural: 'Sinulla on {count} tallennettua tiedotetta',
      saveHint: 'Tallenna tärkeät tiedotteet nopeaa pääsyä varten',
      clearAll: 'Tyhjennä kaikki',
      clearConfirm: 'Haluatko varmasti tyhjentää kaikki suosikit?',
      noFavorites: 'Ei suosikkeja vielä',
      addHint: 'Klikkaa sydänikonia missä tahansa tiedotteessa tallentaaksesi sen tähän.',
    },
    common: {
      all: 'Kaikki',
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
