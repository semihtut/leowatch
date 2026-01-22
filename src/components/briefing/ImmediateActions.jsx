import { Zap, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function ImmediateActions({ actions }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!actions || actions.length === 0) return null;

  const copyToClipboard = async (text, index) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const priorityColors = {
    1: 'bg-red-500/20 text-red-400 border-red-500/50',
    2: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    3: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    4: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    5: 'bg-green-500/20 text-green-400 border-green-500/50',
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-[var(--text-primary)] flex items-center gap-2">
        <Zap className="w-5 h-5 text-pink-500" />
        Immediate Actions
      </h2>

      <div className="space-y-4">
        {actions.map((action, index) => (
          <div
            key={action.priority}
            className="glass-card p-5"
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border ${priorityColors[action.priority] || priorityColors[5]}`}
              >
                {action.priority}
              </div>
              <div className="flex-1 space-y-2">
                <h4 className="font-semibold text-[var(--text-primary)]">{action.action}</h4>
                <p className="text-sm text-[var(--text-secondary)]">{action.description}</p>
                {action.command && (
                  <div className="relative mt-3">
                    <pre className="bg-[var(--bg-secondary)] p-3 rounded-lg text-sm font-mono text-cyan-400 overflow-x-auto">
                      {action.command}
                    </pre>
                    <button
                      onClick={() => copyToClipboard(action.command, index)}
                      className="absolute top-2 right-2 p-1.5 rounded bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
