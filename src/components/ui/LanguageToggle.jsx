import { useLanguage } from '../../contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] hover:border-pink-500/50 transition-colors text-sm font-medium"
    >
      <span className={language === 'en' ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}>
        EN
      </span>
      <span className="text-[var(--text-muted)]">/</span>
      <span className={language === 'fi' ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}>
        FI
      </span>
    </button>
  );
}
