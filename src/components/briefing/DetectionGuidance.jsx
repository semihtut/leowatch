import { Search, Database, Eye, AlertCircle } from 'lucide-react';
import SeverityBadge from './SeverityBadge';

export default function DetectionGuidance({ guidance }) {
  if (!guidance) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-[var(--text-primary)] flex items-center gap-2">
        <Search className="w-5 h-5 text-pink-500" />
        Detection Guidance
      </h2>

      {/* Summary */}
      {guidance.summary && (
        <div className="glass-card p-4 border-blue-500/20">
          <p className="text-[var(--text-secondary)]">{guidance.summary}</p>
        </div>
      )}

      {/* Log Sources */}
      {guidance.log_sources && guidance.log_sources.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-500" />
            Log Sources to Monitor
          </h3>
          <div className="grid gap-3">
            {guidance.log_sources.map((source) => (
              <div
                key={source.source}
                className="glass-card p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-[var(--text-primary)]">{source.source}</h4>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">{source.description}</p>
                  </div>
                  <SeverityBadge level={source.priority} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What to Look For */}
      {guidance.what_to_look_for && guidance.what_to_look_for.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-500" />
            What to Look For
          </h3>
          <div className="space-y-3">
            {guidance.what_to_look_for.map((item) => (
              <div
                key={item.indicator}
                className="glass-card p-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="font-medium text-[var(--text-primary)]">{item.indicator}</h4>
                    <SeverityBadge level={item.severity} size="sm" />
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">{item.description}</p>
                  {item.log_field && (
                    <code className="block text-xs bg-[var(--bg-secondary)] text-cyan-400 p-2 rounded font-mono overflow-x-auto">
                      {item.log_field}
                    </code>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Known Malicious IPs */}
      {guidance.known_malicious_ips && guidance.known_malicious_ips.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            Known Malicious IPs
          </h3>
          <div className="glass-card p-4">
            <div className="flex flex-wrap gap-2">
              {guidance.known_malicious_ips.map((ip) => (
                <code
                  key={ip}
                  className="px-2 py-1 text-sm bg-red-500/10 text-red-400 rounded font-mono"
                >
                  {ip}
                </code>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
