import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowRight, Menu, X, FileText, Eye, AlertTriangle, Activity, ChevronDown } from 'lucide-react';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const FONT = "'General Sans', sans-serif";

const NAV_LINKS = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Archive', href: '/archive' },
  { name: 'Threat Pulse', href: '/pulse' },
  { name: 'About', href: '/about' },
];

const STATS_CONFIG = [
  { key: 'total', label: 'Briefings', icon: FileText },
  { key: 'totalSources', label: 'Sources Analyzed', icon: Eye },
  { key: 'critical', label: 'Critical Threats', icon: AlertTriangle },
  { key: 'cisaKev', label: 'CISA KEV Tracked', icon: Activity },
];

// Pill button with layered glow border effect
function GlowPillButton({ children, to, variant = 'outline', className = '' }) {
  const isWhite = variant === 'solid';
  return (
    <Link to={to} className={`group relative inline-flex rounded-full ${className}`}>
      {/* Outer border */}
      <span className="absolute inset-0 rounded-full border border-white/30" style={{ borderWidth: '0.6px' }} />
      {/* Top glow streak */}
      <span className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent blur-[2px]" />
      {/* Inner pill */}
      <span
        className={`relative z-10 flex items-center gap-2 rounded-full px-[29px] py-[11px] text-sm font-medium transition-all duration-300 ${
          isWhite
            ? 'bg-white text-black group-hover:bg-white/90'
            : 'bg-black/80 text-white group-hover:bg-white/10'
        }`}
        style={{ fontFamily: FONT }}
      >
        {children}
      </span>
    </Link>
  );
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState(null);

  useDocumentMeta({
    title: undefined,
    description: 'Daily cybersecurity threat intelligence briefings in simple English. Free, accessible, and actionable security insights.',
    path: '/',
  });

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/index.json?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => setStats(data.stats))
      .catch(() => {});
  }, []);

  return (
    <div className="bg-black min-h-screen relative overflow-hidden" style={{ fontFamily: FONT }}>
      {/* ── Background Video ── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260217_030345_246c0224-10a4-422c-b324-070b7c0eceda.mp4"
      />

      {/* ── Video Overlay ── */}
      <div className="fixed inset-0 bg-black/50 z-[1]" />

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-6 md:px-[120px] py-5">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-cyan-500">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Intelleo</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center" style={{ gap: '30px' }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="flex items-center text-white text-sm font-medium hover:text-white/90 transition-colors"
                style={{ gap: '14px' }}
              >
                {link.name}
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <GlowPillButton to="/dashboard" variant="outline">
              Explore Dashboard
            </GlowPillButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white z-50"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/90 backdrop-blur-xl border-t border-white/10 overflow-hidden"
            >
              <div className="px-6 py-6 space-y-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-white/80 text-base font-medium hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-4">
                  <GlowPillButton to="/dashboard" variant="outline" className="w-full justify-center">
                    Explore Dashboard
                  </GlowPillButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Hero Content ── */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 pt-[200px] md:pt-[280px] pb-[102px]">
        {/* Badge Pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <span
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-[20px] text-[13px] font-medium"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <span className="w-1 h-1 rounded-full bg-white" />
            <span className="text-white/60">Actively tracking</span>
            <span className="text-white">{stats ? `${stats.total} threats` : 'emerging threats'}</span>
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-[36px] md:text-[56px] font-medium leading-[1.28] max-w-[613px] mb-6"
          style={{
            background: 'linear-gradient(144.5deg, #FFFFFF 28%, rgba(0, 0, 0, 0) 115%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Threat Intelligence at the Speed of Now
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-[15px] font-normal text-white/70 max-w-[680px] mb-10"
          style={{ lineHeight: '1.7' }}
        >
          Powering informed decisions with daily cybersecurity briefings in plain English.
          Intelleo tracks critical vulnerabilities, active exploits, and emerging threats — delivering
          actionable intelligence from {stats ? `${stats.totalSources}+` : 'hundreds of'} sources, completely free.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <GlowPillButton to="/dashboard" variant="solid">
            Explore Dashboard
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </GlowPillButton>
          <GlowPillButton to="/about" variant="outline">
            Learn More
          </GlowPillButton>
        </motion.div>
      </div>

      {/* ── Stats Section ── */}
      <div className="relative z-10 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {STATS_CONFIG.map((stat, i) => (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl text-center backdrop-blur-sm"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <stat.icon className="w-6 h-6 text-pink-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">
                  {stats ? stats[stat.key] : '--'}
                </div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
