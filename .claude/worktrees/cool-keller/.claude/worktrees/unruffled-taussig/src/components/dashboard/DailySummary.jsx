import { useLanguage } from '../../contexts/LanguageContext';

export default function DailySummary({ date }) {
  const { language } = useLanguage();

  const formattedDate = new Date(date).toLocaleDateString(language === 'fi' ? 'fi-FI' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="text-center py-6">
      <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">
        {formattedDate}
      </h1>
      <p className="text-lg text-[var(--text-secondary)]">
        {language === 'fi' ? 'Päivittäiset pilviturvallisuustiedotteet' : 'Daily Cloud Security Briefings'}
      </p>
    </div>
  );
}
