import { BookOpen, ExternalLink, Calendar } from 'lucide-react';

const typeColors = {
  Research: 'bg-purple-500/20 text-purple-400',
  'Vendor Advisory': 'bg-blue-500/20 text-blue-400',
  Government: 'bg-red-500/20 text-red-400',
  News: 'bg-green-500/20 text-green-400',
};

export default function SourceList({ sources, total }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-pink-500" />
          Sources
        </h2>
        {total && (
          <span className="text-sm text-[var(--text-muted)]">
            {total} sources analyzed
          </span>
        )}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--bg-secondary)]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  Source
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  Link
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-default)]">
              {sources.map((source, index) => (
                <tr
                  key={index}
                  className="hover:bg-[var(--bg-card-hover)] transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-[var(--text-primary)]">{source.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${typeColors[source.type] || 'bg-zinc-500/20 text-zinc-400'}`}
                    >
                      {source.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-[var(--text-muted)]">
                      <Calendar className="w-3 h-3" />
                      {new Date(source.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-pink-500 hover:text-pink-400 text-sm"
                    >
                      Visit <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
