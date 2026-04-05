import { useState } from 'react';
import { Target, ExternalLink } from 'lucide-react';
import CopyButton from '../ui/CopyButton';

// All 14 MITRE ATT&CK Enterprise tactics in kill chain order
const ALL_TACTICS = [
  'Reconnaissance',
  'Resource Development',
  'Initial Access',
  'Execution',
  'Persistence',
  'Privilege Escalation',
  'Defense Evasion',
  'Credential Access',
  'Discovery',
  'Lateral Movement',
  'Collection',
  'Command and Control',
  'Exfiltration',
  'Impact',
];

// Short labels for mobile
const SHORT_LABELS = {
  'Reconnaissance': 'Recon',
  'Resource Development': 'Res Dev',
  'Initial Access': 'Init Access',
  'Execution': 'Exec',
  'Persistence': 'Persist',
  'Privilege Escalation': 'Priv Esc',
  'Defense Evasion': 'Def Eva',
  'Credential Access': 'Cred Acc',
  'Discovery': 'Discov',
  'Lateral Movement': 'Lat Mov',
  'Collection': 'Collect',
  'Command and Control': 'C2',
  'Exfiltration': 'Exfil',
  'Impact': 'Impact',
};

const tacticGlowColors = {
  'Reconnaissance': { bg: 'bg-slate-500', glow: 'shadow-slate-500/50' },
  'Resource Development': { bg: 'bg-gray-500', glow: 'shadow-gray-500/50' },
  'Initial Access': { bg: 'bg-red-500', glow: 'shadow-red-500/50' },
  'Execution': { bg: 'bg-orange-500', glow: 'shadow-orange-500/50' },
  'Persistence': { bg: 'bg-yellow-500', glow: 'shadow-yellow-500/50' },
  'Privilege Escalation': { bg: 'bg-green-500', glow: 'shadow-green-500/50' },
  'Defense Evasion': { bg: 'bg-teal-500', glow: 'shadow-teal-500/50' },
  'Credential Access': { bg: 'bg-cyan-500', glow: 'shadow-cyan-500/50' },
  'Discovery': { bg: 'bg-blue-500', glow: 'shadow-blue-500/50' },
  'Lateral Movement': { bg: 'bg-indigo-500', glow: 'shadow-indigo-500/50' },
  'Collection': { bg: 'bg-purple-500', glow: 'shadow-purple-500/50' },
  'Command and Control': { bg: 'bg-violet-500', glow: 'shadow-violet-500/50' },
  'Exfiltration': { bg: 'bg-pink-500', glow: 'shadow-pink-500/50' },
  'Impact': { bg: 'bg-rose-500', glow: 'shadow-rose-500/50' },
};

const tacticCardColors = {
  'Reconnaissance': 'from-slate-500/20 to-slate-600/20 border-slate-500/30',
  'Resource Development': 'from-gray-500/20 to-gray-600/20 border-gray-500/30',
  'Initial Access': 'from-red-500/20 to-red-600/20 border-red-500/30',
  'Execution': 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
  'Persistence': 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30',
  'Privilege Escalation': 'from-green-500/20 to-green-600/20 border-green-500/30',
  'Defense Evasion': 'from-teal-500/20 to-teal-600/20 border-teal-500/30',
  'Credential Access': 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30',
  'Discovery': 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
  'Lateral Movement': 'from-indigo-500/20 to-indigo-600/20 border-indigo-500/30',
  'Collection': 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
  'Command and Control': 'from-violet-500/20 to-violet-600/20 border-violet-500/30',
  'Exfiltration': 'from-pink-500/20 to-pink-600/20 border-pink-500/30',
  'Impact': 'from-rose-500/20 to-rose-600/20 border-rose-500/30',
};

export default function MitreMapping({ mitre }) {
  const [hoveredTactic, setHoveredTactic] = useState(null);

  if (!mitre?.tactics || mitre.tactics.length === 0) return null;

  // Group techniques by tactic
  const tacticMap = {};
  mitre.tactics.forEach((t) => {
    if (!tacticMap[t.tactic]) tacticMap[t.tactic] = [];
    tacticMap[t.tactic].push(t);
  });

  const activeTactics = new Set(Object.keys(tacticMap));

  const allTechniquesText = mitre.tactics
    .map((t) => `${t.technique_id} - ${t.technique_name} (${t.tactic})`)
    .join('\n');

  // Get tooltip info for hovered tactic
  const hoveredInfo = hoveredTactic ? tacticMap[hoveredTactic] : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <Target className="w-5 h-5 text-pink-500" />
          MITRE ATT&CK Mapping
        </h2>
        <div className="flex items-center gap-3">
          <CopyButton text={allTechniquesText} label="Copy All" />
          <a
            href="https://attack.mitre.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--text-muted)] hover:text-pink-500 flex items-center gap-1"
          >
            View Framework <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Mini Navigator Grid */}
      <div className="glass-card p-4 overflow-x-auto">
        <div className="flex gap-1.5 min-w-[700px]">
          {ALL_TACTICS.map((tactic) => {
            const isActive = activeTactics.has(tactic);
            const colors = tacticGlowColors[tactic];
            const techniques = tacticMap[tactic] || [];

            return (
              <div
                key={tactic}
                className="flex-1 min-w-0 relative"
                onMouseEnter={() => isActive && setHoveredTactic(tactic)}
                onMouseLeave={() => setHoveredTactic(null)}
              >
                {/* Tactic column */}
                <div
                  className={`
                    rounded-lg p-2 text-center transition-all duration-300 cursor-default
                    ${isActive
                      ? `${colors.bg}/20 border border-current shadow-lg ${colors.glow} scale-[1.02]`
                      : 'bg-[var(--bg-secondary)] border border-transparent opacity-25'
                    }
                  `}
                >
                  <div className={`text-[9px] font-bold uppercase tracking-wider leading-tight mb-1.5 ${
                    isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
                  }`}>
                    {SHORT_LABELS[tactic]}
                  </div>

                  {/* Technique dots */}
                  <div className="flex justify-center gap-1 min-h-[8px]">
                    {isActive ? (
                      techniques.map((t, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${colors.bg} shadow-sm ${colors.glow}`}
                        />
                      ))
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-[var(--text-muted)]/20" />
                    )}
                  </div>
                </div>

                {/* Hover tooltip */}
                {hoveredTactic === tactic && techniques.length > 0 && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-20 w-56">
                    <div className="glass-card p-3 border border-[var(--glass-border)] shadow-xl text-xs">
                      <p className="font-semibold text-[var(--text-primary)] mb-1.5">{tactic}</p>
                      {techniques.map((t) => (
                        <div key={t.technique_id} className="flex items-center gap-1.5 mb-1 last:mb-0">
                          <span className={`w-1.5 h-1.5 rounded-full ${colors.bg} shrink-0`} />
                          <span className="font-mono text-cyan-400">{t.technique_id}</span>
                          <span className="text-[var(--text-secondary)] truncate">{t.technique_name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Kill chain flow indicator */}
        <div className="flex items-center justify-center mt-2 gap-1 text-[10px] text-[var(--text-muted)]">
          <span>Kill Chain Flow</span>
          <span>→</span>
        </div>
      </div>

      {/* Detailed technique cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {mitre.tactics.map((item) => (
          <div
            key={`${item.technique_id}-${item.tactic}`}
            className={`rounded-xl p-4 bg-gradient-to-br ${tacticCardColors[item.tactic] || 'from-zinc-500/20 to-zinc-600/20 border-zinc-500/30'} border`}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  {item.tactic}
                </span>
                <div className="flex items-center gap-2">
                  <CopyButton text={item.technique_id} />
                  <a
                    href={`https://attack.mitre.org/techniques/${item.technique_id.replace('.', '/')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300"
                  >
                    {item.technique_id}
                  </a>
                </div>
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
