import { Search, Filter, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function SearchFilters({
  searchQuery,
  setSearchQuery,
  selectedSeverity,
  setSelectedSeverity,
  selectedVendor,
  setSelectedVendor,
  vendors = [],
}) {
  const { language } = useLanguage();

  const severityOptions = [
    { value: '', label: language === 'fi' ? 'Kaikki vakavuudet' : 'All Severities' },
    { value: 'Critical', label: language === 'fi' ? 'Kriittinen' : 'Critical' },
    { value: 'High', label: language === 'fi' ? 'Korkea' : 'High' },
    { value: 'Medium', label: language === 'fi' ? 'Keskitaso' : 'Medium' },
    { value: 'Low', label: language === 'fi' ? 'Matala' : 'Low' },
  ];

  return (
    <div className="glass-card p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder={language === 'fi' ? 'Hae CVE:llä, otsikolla tai tagilla...' : 'Search by CVE, title, or tag...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Severity Filter */}
        <div className="relative min-w-[180px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-pink-500/50 transition-colors appearance-none cursor-pointer"
          >
            {severityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Vendor Filter */}
        {vendors.length > 0 && (
          <div className="relative min-w-[180px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <select
              value={selectedVendor}
              onChange={(e) => setSelectedVendor(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-pink-500/50 transition-colors appearance-none cursor-pointer"
            >
              <option value="">{language === 'fi' ? 'Kaikki toimittajat' : 'All Vendors'}</option>
              {vendors.map((vendor) => (
                <option key={vendor} value={vendor}>
                  {vendor}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
