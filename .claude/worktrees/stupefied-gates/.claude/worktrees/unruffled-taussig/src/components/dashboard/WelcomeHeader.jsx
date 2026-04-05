import { motion } from 'framer-motion';

export default function WelcomeHeader() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <h1 className="text-3xl font-bold text-[var(--text-primary)]">
        Today's Security Briefings
      </h1>
      <p className="mt-2 text-[var(--text-secondary)]">{today}</p>
    </motion.div>
  );
}
