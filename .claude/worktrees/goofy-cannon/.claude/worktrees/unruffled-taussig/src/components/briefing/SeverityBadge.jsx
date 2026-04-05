export default function SeverityBadge({ level, size = 'md' }) {
  const levelLower = level?.toLowerCase() || 'low';

  const colors = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/50',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    medium: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    low: 'bg-green-500/20 text-green-400 border-green-500/50',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center
        font-semibold uppercase tracking-wide
        rounded-full border
        ${colors[levelLower] || colors.low}
        ${sizes[size]}
        ${levelLower === 'critical' ? 'pulse-critical' : ''}
      `}
    >
      {level}
    </span>
  );
}
