// Route-level Suspense fallback. Renders inside the persistent shell's <main>
// (sidebar + header stay put) whenever a segment's code/data isn't ready yet —
// e.g. first visit, a cold chunk, or on-demand compile in dev. A dashboard-
// shaped skeleton in the brand palette reads as intentional, not a spinner.

function Block({ className = "" }: { className?: string }) {
  return (
    <div
      className={`ev-map-skeleton rounded-2xl border border-ev-border/70 ${className}`}
    />
  );
}

export default function Loading() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading page">
      {/* metric cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Block key={i} className="h-[104px]" />
        ))}
      </div>

      {/* charts / map row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Block className="h-[300px]" />
        <Block className="h-[300px] lg:col-span-2" />
      </div>

      {/* table */}
      <Block className="h-[260px]" />
    </div>
  );
}
