import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, trend, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="glass-card p-5"
    >
      <div className="flex items-start justify-between">
        <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500/20 to-cyan-500/20">
          <Icon className="w-5 h-5 text-pink-500" />
        </div>
        {trend !== undefined && trend !== null && (
          <span
            className={`text-xs font-medium ${
              trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-[var(--text-secondary)]'
            }`}
          >
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-[var(--text-primary)]">{value}</p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{label}</p>
      </div>
    </motion.div>
  );
}
