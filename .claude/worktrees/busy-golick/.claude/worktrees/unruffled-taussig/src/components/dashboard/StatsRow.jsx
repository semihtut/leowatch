import { FileText, AlertTriangle, Database, Clock } from 'lucide-react';
import StatCard from './StatCard';

export default function StatsRow({ stats }) {
  const statItems = [
    {
      icon: FileText,
      label: "Today's Briefings",
      value: stats?.todayCount || 0,
    },
    {
      icon: AlertTriangle,
      label: 'Critical Threats',
      value: stats?.criticalCount || 0,
    },
    {
      icon: Database,
      label: 'Sources Analyzed',
      value: stats?.totalSources ? `${stats.totalSources}+` : '120+',
    },
    {
      icon: Clock,
      label: 'Last Updated',
      value: stats?.lastUpdateHoursAgo ? `${stats.lastUpdateHoursAgo}h ago` : '2h ago',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {statItems.map((item, index) => (
        <StatCard
          key={item.label}
          icon={item.icon}
          label={item.label}
          value={item.value}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
}
