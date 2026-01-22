import {
  Send,
  UserCheck,
  Download,
  UserPlus,
  Network,
  Key,
  Shield,
  Server,
  Terminal,
  Eye,
  Lock,
  Unlock,
  Database,
  Zap,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

// Icon mapping based on keywords in step content
const getStepIcon = (stepText) => {
  const text = stepText.toLowerCase();

  if (text.includes('send') || text.includes('request') || text.includes('message')) return Send;
  if (text.includes('login') || text.includes('auth') || text.includes('thinks') || text.includes('admin')) return UserCheck;
  if (text.includes('download') || text.includes('steal') || text.includes('exfiltrate')) return Download;
  if (text.includes('create') && (text.includes('account') || text.includes('user'))) return UserPlus;
  if (text.includes('network') || text.includes('control') || text.includes('access')) return Network;
  if (text.includes('password') || text.includes('credential') || text.includes('key')) return Key;
  if (text.includes('bypass') || text.includes('evade')) return Shield;
  if (text.includes('server') || text.includes('system')) return Server;
  if (text.includes('command') || text.includes('execute') || text.includes('run')) return Terminal;
  if (text.includes('monitor') || text.includes('watch') || text.includes('observe')) return Eye;
  if (text.includes('encrypt') || text.includes('lock')) return Lock;
  if (text.includes('unlock') || text.includes('decrypt')) return Unlock;
  if (text.includes('data') || text.includes('database') || text.includes('config')) return Database;
  if (text.includes('exploit') || text.includes('attack')) return Zap;

  return AlertTriangle;
};

// Color progression for attack steps (escalating threat)
const getStepColors = (index, total) => {
  const progress = index / (total - 1);

  if (progress < 0.33) {
    return {
      bg: 'bg-blue-500/20',
      border: 'border-blue-500/50',
      icon: 'text-blue-400',
      line: 'bg-gradient-to-b from-blue-500 to-orange-500',
      glow: 'shadow-blue-500/20'
    };
  } else if (progress < 0.66) {
    return {
      bg: 'bg-orange-500/20',
      border: 'border-orange-500/50',
      icon: 'text-orange-400',
      line: 'bg-gradient-to-b from-orange-500 to-red-500',
      glow: 'shadow-orange-500/20'
    };
  } else {
    return {
      bg: 'bg-red-500/20',
      border: 'border-red-500/50',
      icon: 'text-red-400',
      line: 'bg-red-500',
      glow: 'shadow-red-500/20'
    };
  }
};

// Parse steps from text
const parseSteps = (text) => {
  if (!text) return [];

  // Try to match "Step X:" pattern
  const stepPattern = /Step\s*(\d+)\s*:\s*([^.]+(?:\.[^S]|[^.])*)/gi;
  const matches = [...text.matchAll(stepPattern)];

  if (matches.length > 0) {
    return matches.map((match) => ({
      number: parseInt(match[1]),
      text: match[2].trim()
    }));
  }

  // Fallback: split by sentences if no "Step X:" pattern
  const sentences = text.split(/\.\s+/).filter(s => s.trim().length > 0);
  return sentences.map((sentence, index) => ({
    number: index + 1,
    text: sentence.trim().replace(/\.$/, '')
  }));
};

export default function AttackFlow({ attackText }) {
  const steps = parseSteps(attackText);

  if (steps.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
        <span className="text-red-400">Attack Flow</span>
        <span className="text-xs text-[var(--text-muted)] font-normal">({steps.length} steps)</span>
      </h3>

      <div className="relative">
        {/* Steps */}
        <div className="space-y-0">
          {steps.map((step, index) => {
            const Icon = getStepIcon(step.text);
            const colors = getStepColors(index, steps.length);
            const isLast = index === steps.length - 1;

            return (
              <div key={index} className="relative">
                {/* Connecting line */}
                {!isLast && (
                  <div className="absolute left-[23px] top-[48px] w-0.5 h-[calc(100%-24px)] bg-gradient-to-b from-[var(--border-default)] to-[var(--border-default)]">
                    <div className={`absolute inset-0 ${colors.line} opacity-60`}></div>
                  </div>
                )}

                <div className="flex gap-4 py-3 group">
                  {/* Step indicator */}
                  <div className="relative flex-shrink-0">
                    <div className={`
                      w-12 h-12 rounded-xl ${colors.bg} ${colors.border} border
                      flex items-center justify-center
                      transition-all duration-300
                      group-hover:scale-110 group-hover:shadow-lg ${colors.glow}
                    `}>
                      <Icon className={`w-5 h-5 ${colors.icon}`} />
                    </div>
                    {/* Step number badge */}
                    <div className={`
                      absolute -top-1 -right-1 w-5 h-5 rounded-full
                      ${colors.bg} ${colors.border} border
                      flex items-center justify-center
                      text-xs font-bold ${colors.icon}
                    `}>
                      {step.number}
                    </div>
                  </div>

                  {/* Step content */}
                  <div className="flex-1 min-w-0 pt-2">
                    <p className="text-[var(--text-secondary)] leading-relaxed group-hover:text-[var(--text-primary)] transition-colors">
                      {step.text}
                    </p>
                  </div>

                  {/* Arrow indicator for non-last items */}
                  {!isLast && (
                    <div className="flex-shrink-0 pt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className={`w-4 h-4 ${colors.icon} rotate-90`} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Impact indicator at the end */}
        <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">Full Compromise Achieved</span>
          </div>
        </div>
      </div>
    </div>
  );
}
