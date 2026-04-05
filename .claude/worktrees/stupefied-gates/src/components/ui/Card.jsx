import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = false, gradient = false, ...props }) {
  if (gradient) {
    return (
      <motion.div
        className={`gradient-border ${className}`}
        whileHover={hover ? { scale: 1.02 } : {}}
        transition={{ duration: 0.2 }}
        {...props}
      >
        <div className="gradient-border-inner h-full">
          {children}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`
        bg-[var(--bg-card)]
        border border-[var(--border-default)]
        rounded-2xl
        ${hover ? 'hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer' : ''}
        ${className}
      `}
      whileHover={hover ? { scale: 1.01 } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
