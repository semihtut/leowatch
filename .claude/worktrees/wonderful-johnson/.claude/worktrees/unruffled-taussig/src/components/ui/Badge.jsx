export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    critical: 'bg-red-500/20 text-red-400 border-red-500/50',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    medium: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    low: 'bg-green-500/20 text-green-400 border-green-500/50',
  };

  return (
    <span
      className={`
        inline-flex items-center
        px-2.5 py-0.5
        text-xs font-medium
        rounded-full
        border
        ${variants[variant] || variants.default}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
