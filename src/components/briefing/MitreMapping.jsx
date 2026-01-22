import { Target, ExternalLink } from 'lucide-react';

const tacticColors = {
  'Initial Access': 'from-red-500/20 to-red-600/20 border-red-500/30',
  'Execution': 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
  'Persistence': 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30',
  'Privilege Escalation': 'from-green-500/20 to-green-600/20 border-green-500/30',
  'Defense Evasion': 'from-teal-500/20 to-teal-600/20 border-teal-500/30',
  'Credential Access': 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30',
  'Discovery': 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
  'Lateral Movement': 'from-indigo-500/20 to-indigo-600/20 border-indigo-500/30',
  'Collection': 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
  'Exfiltration': 'from-pink-500/20 to-pink-600/20 border-pink-500/30',
  'Impact': 'from-rose-500/20 to-rose-600/20 border-rose-500/30',
};

export default function MitreMapping({ mitre }) {
  if (!mitre?.tactics || mitre.tactics.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <Target className="w-5 h-5 text-pink-500" />
          MITRE ATT&CK Mapping
        </h2>
        <a
          href="https://attack.mitre.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[var(--text-muted)] hover:text-pink-500 flex items-center gap-1"
        >
          View Framework <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {mitre.tactics.map((item) => (
          <div
            key={item.technique_id}
            className={`rounded-xl p-4 bg-gradient-to-br ${tacticColors[item.tactic] || 'from-zinc-500/20 to-zinc-600/20 border-zinc-500/30'} border`}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  {item.tactic}
                </span>
                <a
                  href={`https://attack.mitre.org/techniques/${item.technique_id.replace('.', '/')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300"
                >
                  {item.technique_id}
                </a>
              </div>
              <h4 className="font-medium text-[var(--text-primary)]">{item.technique_name}</h4>
              <p className="text-sm text-[var(--text-secondary)]">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
