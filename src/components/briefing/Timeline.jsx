import { Clock, Calendar } from 'lucide-react';

export default function Timeline({ events }) {
  if (!events || events.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-[var(--text-primary)] flex items-center gap-2">
        <Clock className="w-5 h-5 text-pink-500" />
        Timeline
      </h2>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-500 to-cyan-500"></div>

        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={index} className="relative pl-10">
              {/* Dot */}
              <div className="absolute left-2 top-1.5 w-4 h-4 rounded-full bg-[var(--bg-primary)] border-2 border-pink-500 z-10"></div>

              <div className="glass-card rounded-lg p-4">
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(event.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <p className="text-[var(--text-secondary)]">{event.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
