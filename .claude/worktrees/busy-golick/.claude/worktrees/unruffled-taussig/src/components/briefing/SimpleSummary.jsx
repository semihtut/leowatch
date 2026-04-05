import { HelpCircle, Users, Crosshair, CheckCircle, AlertTriangle } from 'lucide-react';
import AttackFlow from './AttackFlow';

const sections = [
  { key: 'what_happened', title: 'What Happened?', icon: HelpCircle, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  { key: 'who_is_affected', title: 'Who Is Affected?', icon: Users, color: 'text-orange-400', bg: 'bg-orange-500/20' },
  { key: 'why_this_is_serious', title: 'Why This Is Serious', icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
];

export default function SimpleSummary({ summary }) {
  if (!summary) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-[var(--text-primary)]">Summary in Simple Terms</h2>

      <div className="grid gap-4">
        {sections.map((section, index) => (
          <div
            key={section.key}
            className="glass-card p-5"
          >
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${section.bg} ${section.color}`}>
                <section.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">{section.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">{summary[section.key]}</p>
              </div>
            </div>
          </div>
        ))}

        {/* What Attackers Do - Visual Attack Flow */}
        {summary.what_attackers_do && (
          <div className="glass-card p-5 border-red-500/20">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                <Crosshair className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <AttackFlow attackText={summary.what_attackers_do} />
              </div>
            </div>
          </div>
        )}

        {/* What You Should Do - Special Styling */}
        {summary.what_you_should_do && (
          <div className="glass-card p-5 border-green-500/30">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-3">What You Should Do</h3>
                <ul className="space-y-2">
                  {summary.what_you_should_do.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 text-green-400 text-xs flex items-center justify-center font-medium">
                        {i + 1}
                      </span>
                      <span className="text-[var(--text-secondary)]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
