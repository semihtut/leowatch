export default function TagList({ tags = [], limit = 5 }) {
  const displayTags = limit ? tags.slice(0, limit) : tags;
  const remaining = tags.length - displayTags.length;

  return (
    <div className="flex flex-wrap gap-1.5">
      {displayTags.map((tag) => (
        <span
          key={tag}
          className="px-2 py-0.5 text-xs rounded-md bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] transition-colors"
        >
          {tag}
        </span>
      ))}
      {remaining > 0 && (
        <span className="px-2 py-0.5 text-xs rounded-md bg-[var(--bg-secondary)]/50 text-[var(--text-muted)]">
          +{remaining} more
        </span>
      )}
    </div>
  );
}
