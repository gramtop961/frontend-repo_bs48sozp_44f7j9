export default function StatsBar({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <StatCard label="Total SKUs" value={stats?.total_skus ?? 0} />
      <StatCard label="Total Units" value={stats?.total_units ?? 0} />
      <StatCard label="Low Stock" value={stats?.low_stock ?? 0} highlight />
    </div>
  );
}

function StatCard({ label, value, highlight = false }) {
  return (
    <div className={`rounded-lg border p-4 ${highlight ? 'bg-amber-50 dark:bg-amber-950/30' : 'bg-background'}`}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-2xl font-semibold ${highlight ? 'text-amber-600 dark:text-amber-400' : ''}`}>{value}</div>
    </div>
  );
}
