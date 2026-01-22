import { useBriefings } from '../hooks/useBriefings';
import WelcomeHeader from '../components/dashboard/WelcomeHeader';
import StatsRow from '../components/dashboard/StatsRow';
import BriefingGrid from '../components/briefing/BriefingGrid';

export default function Dashboard() {
  const { briefings, stats, loading, error } = useBriefings();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Error loading briefings: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <WelcomeHeader />
      <StatsRow stats={stats} />
      <BriefingGrid briefings={briefings} title="Recent Briefings" />
    </div>
  );
}
