import { Heart, Rss } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-6 px-6 border-t border-[var(--border-default)]">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--text-muted)]">
        <div className="flex items-center gap-1">
          <span>Made with</span>
          <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
          <span>for the security community</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/feed.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-orange-400 hover:text-orange-300 transition-colors"
            title="RSS Feed"
          >
            <Rss className="w-4 h-4" />
            <span>RSS</span>
          </a>
          <span className="hidden md:inline">|</span>
          <span>&copy; {currentYear} Intelleo</span>
          <span className="hidden md:inline">|</span>
          <span className="text-[var(--text-secondary)]">100% Free & Open</span>
        </div>
      </div>
    </footer>
  );
}
