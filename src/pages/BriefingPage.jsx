import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, AlertTriangle, Shield, ExternalLink, Heart } from 'lucide-react';
import { useBriefing } from '../hooks/useBriefings';
import { useFavorites } from '../hooks/useFavorites';
import SeverityBadge from '../components/briefing/SeverityBadge';
import TagList from '../components/briefing/TagList';
import SimpleSummary from '../components/briefing/SimpleSummary';
import MitreMapping from '../components/briefing/MitreMapping';
import DetectionGuidance from '../components/briefing/DetectionGuidance';
import ImmediateActions from '../components/briefing/ImmediateActions';
import Timeline from '../components/briefing/Timeline';
import SourceList from '../components/briefing/SourceList';

export default function BriefingPage() {
  const { id } = useParams();
  const { briefing, loading, error } = useBriefing(id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !briefing) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">Briefing not found</p>
        <Link to="/" className="text-pink-500 hover:text-pink-400">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const severityColors = {
    critical: 'from-red-500/20 to-red-600/10 border-red-500/30',
    high: 'from-orange-500/20 to-orange-600/10 border-orange-500/30',
    medium: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    low: 'from-green-500/20 to-green-600/10 border-green-500/30',
  };

  const severityLevel = briefing.severity?.level?.toLowerCase() || 'low';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top bar with back button and favorite */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <button
          onClick={() => toggleFavorite(id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            favorited
              ? 'bg-pink-500/20 text-pink-400'
              : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-pink-400 hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          <Heart className={`w-5 h-5 ${favorited ? 'fill-pink-500' : ''}`} />
          <span className="text-sm font-medium">
            {favorited ? 'Saved' : 'Save'}
          </span>
        </button>
      </div>

      {/* Severity Banner */}
      <div className={`p-6 rounded-2xl bg-gradient-to-r ${severityColors[severityLevel]} border`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <SeverityBadge level={briefing.severity?.level} size="lg" />
              {briefing.severity?.cisa_kev && (
                <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-500/20 text-red-400 rounded-full">
                  <AlertTriangle className="w-3 h-3" />
                  CISA KEV
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              {briefing.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)]">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(briefing.generated_date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              {briefing.severity?.cvss && (
                <span className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  CVSS {briefing.severity.cvss}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* CVEs */}
        {briefing.cves && briefing.cves.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {briefing.cves.map((cve) => (
              <a
                key={cve}
                href={`https://nvd.nist.gov/vuln/detail/${cve}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-1 text-sm font-mono bg-cyan-500/10 text-cyan-400 rounded hover:bg-cyan-500/20 transition-colors"
              >
                {cve}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        )}

        {/* Tags */}
        {briefing.tags && (
          <div className="mt-4">
            <TagList tags={briefing.tags} limit={10} />
          </div>
        )}
      </div>

      {/* Affected Products */}
      {briefing.affected_products && (
        <div className="glass-card p-5">
          <h3 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wide mb-3">
            Affected Products
          </h3>
          <div className="flex flex-wrap gap-2">
            {briefing.affected_products.map((product) => (
              <span
                key={product}
                className="px-3 py-1 text-sm bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg"
              >
                {product}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Simple Summary */}
      <SimpleSummary summary={briefing.simple_summary} />

      {/* Timeline */}
      <Timeline events={briefing.timeline} />

      {/* MITRE ATT&CK */}
      <MitreMapping mitre={briefing.mitre_attack} />

      {/* Detection Guidance */}
      <DetectionGuidance guidance={briefing.detection_guidance} />

      {/* Immediate Actions */}
      <ImmediateActions actions={briefing.immediate_actions} />

      {/* Sources */}
      <SourceList sources={briefing.sources} total={briefing.sources_analyzed} />

      {/* CISA Deadline */}
      {briefing.severity?.cisa_deadline && (
        <div className="glass-card p-5 border-red-500/30">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <p className="font-medium text-[var(--text-primary)]">CISA Remediation Deadline</p>
              <p className="text-sm text-[var(--text-secondary)]">
                Federal agencies must address this vulnerability by{' '}
                <span className="text-red-400 font-medium">
                  {new Date(briefing.severity.cisa_deadline).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
