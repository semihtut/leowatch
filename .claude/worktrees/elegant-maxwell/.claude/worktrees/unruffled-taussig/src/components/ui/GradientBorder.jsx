import { motion } from 'framer-motion';

export default function GradientBorder({ children, className = '', hover = true }) {
  return (
    <motion.div
      className={`gradient-border ${className}`}
      whileHover={hover ? { scale: 1.02 } : {}}
      transition={{ duration: 0.2 }}
    >
      <div className="gradient-border-inner h-full">
        {children}
      </div>
    </motion.div>
  );
}
