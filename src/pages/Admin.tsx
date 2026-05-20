import { useApp } from "@/lib/store";
import { computeFleetStats } from "@/lib/data";
import { Users, Activity, AlertTriangle, RefreshCw } from "lucide-react";
import StatCard from "@/components/StatCard";

const Admin = () => {
  const { tourists, incidents, resetSeed } = useApp();
  const stats = computeFleetStats(tourists);
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Admin <span className="text-gradient">Control</span></h1>
          <p className="text-sm text-muted-foreground mt-1">Tourists, incidents, and on-chain audit overview.</p>
        </div>
        <button onClick={resetSeed} className="text-xs px-3 py-2 rounded-lg glass hover:border-primary/40 flex items-center gap-2">
          <RefreshCw className="h-3.5 w-3.5" /> Reseed demo data
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Tourists" value={stats.total} icon={Users} />
        <StatCard label="Active Now" value={stats.active} icon={Activity} tone="success" />
        <StatCard label="Open Incidents" value={incidents.filter(i => i.status !== "RESOLVED").length} icon={AlertTriangle} tone="warning" />
        <StatCard label="Avg Safety" value={`${stats.avgSafety}%`} icon={Activity} tone="accent" />
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="font-semibold mb-3">Tourist Registry</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr className="border-b border-border/50">
                <th className="text-left py-2 px-3">ID</th>
                <th className="text-left py-2 px-3">Name</th>
                <th className="text-left py-2 px-3">Location</th>
                <th className="text-left py-2 px-3">Score</th>
                <th className="text-left py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {tourists.map((t) => (
                <tr key={t.id} className="border-b border-border/30 hover:bg-secondary/30">
                  <td className="py-2 px-3 font-mono text-xs">{t.id}</td>
                  <td className="py-2 px-3">{t.name} <span className="text-xs text-muted-foreground">· {t.nationality}</span></td>
                  <td className="py-2 px-3 text-muted-foreground">{t.location.place}</td>
                  <td className="py-2 px-3 font-medium">{t.safetyScore}</td>
                  <td className="py-2 px-3">
                    <span className={`text-xs px-2 py-0.5 rounded-md border ${
                      t.status === "SOS" ? "border-[hsl(var(--destructive)/0.4)] text-[hsl(var(--destructive))] bg-[hsl(var(--destructive)/0.1)]" :
                      t.status === "ALERT" ? "border-[hsl(var(--warning)/0.4)] text-[hsl(var(--warning))] bg-[hsl(var(--warning)/0.1)]" :
                      "border-[hsl(var(--success)/0.3)] text-[hsl(var(--success))] bg-[hsl(var(--success)/0.1)]"
                    }`}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
