import { motion } from 'framer-motion';
import { Shield, Coffee, Check, AlertTriangle, Users, Zap, Heart } from 'lucide-react';
import Card from '../components/ui/Card';
import GradientBorder from '../components/ui/GradientBorder';

const features = [
  {
    icon: Zap,
    title: 'Daily Briefings',
    description: 'Fresh security intelligence published every day, covering the most critical threats.',
  },
  {
    icon: Users,
    title: 'Simple Language',
    description: 'Complex threats explained in plain English that everyone can understand.',
  },
  {
    icon: Shield,
    title: 'MITRE ATT&CK Mapped',
    description: 'Every threat is mapped to the MITRE ATT&CK framework for standardized understanding.',
  },
  {
    icon: Check,
    title: 'Actionable Guidance',
    description: 'Clear detection guidance and immediate actions you can take to protect yourself.',
  },
];

export default function About() {
  return (
    <div className="max-w-3xl mx-auto space-y-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-pink-500/20 to-cyan-500/20 mb-6">
          <Shield className="w-12 h-12 text-pink-500" />
        </div>
        <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
          About Intelleo
        </h1>
        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
          Making cybersecurity intelligence accessible to everyone, completely free.
        </p>
      </motion.div>

      {/* Free Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <GradientBorder hover={false}>
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
              100% Free - No Registration Required
            </h2>
            <p className="text-[var(--text-secondary)]">
              Access all briefings, forever free. No accounts, no paywalls, no hidden fees.
            </p>
          </div>
        </GradientBorder>
      </motion.div>

      {/* Features */}
      <div className="grid gap-6 md:grid-cols-2">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="p-6 h-full">
              <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500/20 to-cyan-500/20 w-fit mb-4">
                <feature.icon className="w-6 h-6 text-pink-500" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                {feature.title}
              </h3>
              <p className="text-[var(--text-secondary)]">{feature.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            How Intelleo Works
          </h2>
          <div className="space-y-4 text-[var(--text-secondary)]">
            <p>
              Each day, we analyze security advisories, research reports, and threat intelligence
              from 10+ trusted sources. We synthesize this information into clear, actionable
              briefings that anyone can understand.
            </p>
            <p>
              Our briefings include MITRE ATT&CK mappings to help security teams understand
              attack patterns, plus detection guidance to help you identify threats in your
              environment.
            </p>
            <p>
              <strong className="text-[var(--text-primary)]">Note:</strong> We provide general
              detection guidance, not vendor-specific queries. This keeps our content accessible
              regardless of what security tools you use.
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6 bg-yellow-500/5 border-yellow-500/20">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-2">Disclaimer</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Intelleo is provided for informational purposes only. This is not professional
                security advice. Always consult with qualified security professionals for your
                specific environment. We are not responsible for actions taken based on our
                content.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Support Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center py-8"
      >
        <div className="inline-flex p-3 rounded-full bg-pink-500/10 mb-4">
          <Heart className="w-8 h-8 text-pink-500" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
          Support This Project
        </h2>
        <p className="text-[var(--text-secondary)] mb-6 max-w-lg mx-auto">
          Intelleo will always be free. If you find it valuable, consider buying us a coffee
          to help cover hosting costs and keep the project running.
        </p>
        <motion.a
          href="https://ko-fi.com/threatbrief"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-opacity"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Coffee className="w-5 h-5" />
          Buy us a coffee
        </motion.a>
        <p className="text-sm text-[var(--text-muted)] mt-4">
          Suggested: &euro;3-5 (completely optional)
        </p>
      </motion.div>
    </div>
  );
}
