import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from '@react-pdf/renderer';

// Color palette
const colors = {
  primary: '#EC4899',
  critical: '#EF4444',
  high: '#F97316',
  medium: '#3B82F6',
  low: '#22C55E',
  cyan: '#06B6D4',
  dark: '#1F2937',
  gray: '#6B7280',
  lightGray: '#E5E7EB',
  white: '#FFFFFF',
};

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: colors.white,
  },
  header: {
    marginBottom: 20,
    borderBottom: `2px solid ${colors.primary}`,
    paddingBottom: 15,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: colors.gray,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 10,
    marginTop: 15,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaLabel: {
    fontSize: 9,
    color: colors.gray,
  },
  metaValue: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.white,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: `1px solid ${colors.lightGray}`,
  },
  sectionContent: {
    fontSize: 10,
    color: colors.dark,
    lineHeight: 1.5,
  },
  cveContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 10,
  },
  cveBadge: {
    backgroundColor: '#E0F2FE',
    color: colors.cyan,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 3,
    fontSize: 9,
    fontFamily: 'Courier',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 5,
  },
  tag: {
    backgroundColor: colors.lightGray,
    color: colors.gray,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    fontSize: 8,
  },
  summaryBox: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 4,
    marginBottom: 10,
    borderLeft: `3px solid ${colors.primary}`,
  },
  summaryTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 5,
  },
  summaryText: {
    fontSize: 9,
    color: colors.dark,
    lineHeight: 1.5,
  },
  attackStep: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 20,
    marginRight: 10,
  },
  stepText: {
    flex: 1,
    fontSize: 9,
    color: colors.dark,
    lineHeight: 1.4,
  },
  mitreTable: {
    marginTop: 5,
  },
  mitreRow: {
    flexDirection: 'row',
    borderBottom: `1px solid ${colors.lightGray}`,
    paddingVertical: 6,
  },
  mitreCell: {
    fontSize: 9,
    color: colors.dark,
  },
  mitreTactic: {
    width: '25%',
    fontWeight: 'bold',
  },
  mitreTechnique: {
    width: '30%',
    color: colors.cyan,
  },
  mitreDesc: {
    width: '45%',
  },
  actionItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  actionPriority: {
    width: 24,
    height: 18,
    borderRadius: 3,
    color: colors.white,
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 18,
    marginRight: 8,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 2,
  },
  actionDesc: {
    fontSize: 9,
    color: colors.gray,
  },
  commandBox: {
    backgroundColor: '#1F2937',
    color: '#10B981',
    padding: 8,
    borderRadius: 3,
    marginTop: 5,
    fontSize: 8,
    fontFamily: 'Courier',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: colors.gray,
    borderTop: `1px solid ${colors.lightGray}`,
    paddingTop: 10,
  },
  sourceItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  sourceName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.dark,
    width: '30%',
  },
  sourceType: {
    fontSize: 9,
    color: colors.gray,
    width: '20%',
  },
  sourceDate: {
    fontSize: 9,
    color: colors.gray,
    width: '20%',
  },
  indicatorBox: {
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 3,
    marginBottom: 8,
    borderLeft: `3px solid ${colors.high}`,
  },
  indicatorTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 3,
  },
  indicatorText: {
    fontSize: 8,
    color: colors.gray,
  },
  cisaWarning: {
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 4,
    marginTop: 10,
    borderLeft: `3px solid ${colors.critical}`,
  },
  cisaText: {
    fontSize: 10,
    color: colors.critical,
    fontWeight: 'bold',
  },
});

const getSeverityColor = (severity) => {
  const level = severity?.toLowerCase() || 'low';
  return colors[level] || colors.low;
};

const getPriorityColor = (priority) => {
  if (priority === 1) return colors.critical;
  if (priority === 2) return colors.high;
  if (priority === 3) return colors.medium;
  return colors.low;
};

// Parse attack steps from text
const parseAttackSteps = (text) => {
  if (!text) return [];
  const parts = text.split(/Step\s*\d+\s*:/i);
  const steps = parts
    .map(part => part.trim())
    .filter(part => part.length > 0)
    .map((part, index) => ({
      number: index + 1,
      text: part.replace(/\.$/, '').trim()
    }));

  if (steps.length > 1) return steps;

  const sentences = text.split(/\.\s+/).filter(s => s.trim().length > 0);
  return sentences.map((sentence, index) => ({
    number: index + 1,
    text: sentence.trim().replace(/\.$/, '')
  }));
};

export default function BriefingPDF({ briefing }) {
  const attackSteps = parseAttackSteps(briefing.simple_summary?.what_attackers_do);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>INTELLEO</Text>
          <Text style={styles.subtitle}>Threat Intelligence Briefing</Text>
        </View>

        {/* Title & Meta */}
        <Text style={styles.title}>{briefing.title}</Text>

        <View style={styles.metaRow}>
          <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(briefing.severity?.level) }]}>
            <Text>{briefing.severity?.level?.toUpperCase()}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>CVSS:</Text>
            <Text style={styles.metaValue}>{briefing.severity?.cvss || 'N/A'}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Date:</Text>
            <Text style={styles.metaValue}>{briefing.generated_date}</Text>
          </View>
          {briefing.severity?.cisa_kev && (
            <View style={[styles.severityBadge, { backgroundColor: colors.critical }]}>
              <Text>CISA KEV</Text>
            </View>
          )}
        </View>

        {/* CVEs */}
        {briefing.cves && briefing.cves.length > 0 && (
          <View style={styles.cveContainer}>
            {briefing.cves.map((cve, i) => (
              <Text key={i} style={styles.cveBadge}>{cve}</Text>
            ))}
          </View>
        )}

        {/* Tags */}
        {briefing.tags && (
          <View style={styles.tagContainer}>
            {briefing.tags.slice(0, 8).map((tag, i) => (
              <Text key={i} style={styles.tag}>{tag}</Text>
            ))}
          </View>
        )}

        {/* Affected Products */}
        {briefing.affected_products && (
          <View style={[styles.section, { marginTop: 15 }]}>
            <Text style={styles.sectionTitle}>Affected Products</Text>
            <Text style={styles.sectionContent}>
              {briefing.affected_products.join(' | ')}
            </Text>
          </View>
        )}

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>What Happened</Text>
            <Text style={styles.summaryText}>{briefing.simple_summary?.what_happened}</Text>
          </View>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Who Is Affected</Text>
            <Text style={styles.summaryText}>{briefing.simple_summary?.who_is_affected}</Text>
          </View>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Why This Is Serious</Text>
            <Text style={styles.summaryText}>{briefing.simple_summary?.why_this_is_serious}</Text>
          </View>
        </View>

        {/* Attack Flow */}
        {attackSteps.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attack Flow</Text>
            {attackSteps.map((step, i) => (
              <View key={i} style={styles.attackStep}>
                <Text style={styles.stepNumber}>{step.number}</Text>
                <Text style={styles.stepText}>{step.text}</Text>
              </View>
            ))}
          </View>
        )}

        {/* CISA Deadline Warning */}
        {briefing.severity?.cisa_deadline && (
          <View style={styles.cisaWarning}>
            <Text style={styles.cisaText}>
              CISA Remediation Deadline: {briefing.severity.cisa_deadline}
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>Generated by Intelleo | {new Date().toLocaleDateString()}</Text>
          <Text>{briefing.briefing_id}</Text>
        </View>
      </Page>

      {/* Page 2: Detection & Response */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>INTELLEO</Text>
          <Text style={styles.subtitle}>Detection & Response Guide</Text>
        </View>

        {/* MITRE ATT&CK */}
        {briefing.mitre_attack?.tactics && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>MITRE ATT&CK Mapping</Text>
            <View style={styles.mitreTable}>
              {briefing.mitre_attack.tactics.map((item, i) => (
                <View key={i} style={styles.mitreRow}>
                  <Text style={[styles.mitreCell, styles.mitreTactic]}>{item.tactic}</Text>
                  <Text style={[styles.mitreCell, styles.mitreTechnique]}>{item.technique_id}</Text>
                  <Text style={[styles.mitreCell, styles.mitreDesc]}>{item.technique_name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Detection Guidance */}
        {briefing.detection_guidance && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detection Guidance</Text>
            <Text style={[styles.sectionContent, { marginBottom: 10 }]}>
              {briefing.detection_guidance.summary}
            </Text>

            {briefing.detection_guidance.what_to_look_for?.slice(0, 4).map((indicator, i) => (
              <View key={i} style={styles.indicatorBox}>
                <Text style={styles.indicatorTitle}>{indicator.indicator}</Text>
                <Text style={styles.indicatorText}>{indicator.description}</Text>
                {indicator.log_field && (
                  <Text style={[styles.indicatorText, { fontFamily: 'Courier', marginTop: 3 }]}>
                    Log: {indicator.log_field}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Immediate Actions */}
        {briefing.immediate_actions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Immediate Actions</Text>
            {briefing.immediate_actions.map((action, i) => (
              <View key={i} style={styles.actionItem}>
                <Text style={[styles.actionPriority, { backgroundColor: getPriorityColor(action.priority) }]}>
                  P{action.priority}
                </Text>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>{action.action}</Text>
                  <Text style={styles.actionDesc}>{action.description}</Text>
                  {action.command && (
                    <Text style={styles.commandBox}>{action.command}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>Generated by Intelleo | {new Date().toLocaleDateString()}</Text>
          <Text>{briefing.briefing_id} - Page 2</Text>
        </View>
      </Page>

      {/* Page 3: Sources */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>INTELLEO</Text>
          <Text style={styles.subtitle}>Sources & References</Text>
        </View>

        {/* Sources */}
        {briefing.sources && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Sources Analyzed ({briefing.sources_analyzed || briefing.sources.length})
            </Text>
            {briefing.sources.map((source, i) => (
              <View key={i} style={styles.sourceItem}>
                <Text style={styles.sourceName}>{source.name}</Text>
                <Text style={styles.sourceType}>{source.type}</Text>
                <Text style={styles.sourceDate}>{source.date}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Timeline */}
        {briefing.timeline && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Event Timeline</Text>
            {briefing.timeline.map((event, i) => (
              <View key={i} style={styles.attackStep}>
                <Text style={[styles.stepNumber, { backgroundColor: colors.cyan }]}>
                  {i + 1}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.stepText, { fontWeight: 'bold' }]}>{event.date}</Text>
                  <Text style={styles.stepText}>{event.event}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Recommended Actions Summary */}
        <View style={[styles.summaryBox, { marginTop: 20 }]}>
          <Text style={styles.summaryTitle}>What You Should Do</Text>
          {briefing.simple_summary?.what_you_should_do?.map((item, i) => (
            <Text key={i} style={[styles.summaryText, { marginBottom: 3 }]}>
              {i + 1}. {item}
            </Text>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>Generated by Intelleo | {new Date().toLocaleDateString()}</Text>
          <Text>{briefing.briefing_id} - Page 3</Text>
        </View>
      </Page>
    </Document>
  );
}
