import { useMemo } from "react";
import { Activity, ShieldCheck, Siren, Users, AlertTriangle, MapPin, Sparkles, Radio } from "lucide-react";
import StatCard from "@/components/StatCard";
import RiskBadge from "@/components/RiskBadge";
import { useApp } from "@/lib/store";
import { GEO_ZONES, computeFleetStats } from "@/lib/data";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Index = () => {
  const { tourists, incidents } = useApp();
  const stats = computeFleetStats(tourists);

  // Synth 14-day incident trend
  const trend = useMemo(() => {
    const days = 14;
    return Array.from({ length: days }).map((_, i) => {
      const d = new Date(Date.now() - (days - 1 - i) * 86400000);
      return {
        day: d.toLocaleDateString("en", { day: "2-digit", month: "short" }),
        incidents: Math.round(2 + Math.random() * 8),
        sos: Math.round(Math.random() * 3),
      };
    });
  }, []);

  const byPlace = useMemo(() => {
    const map = new Map<string, number>();
    tourists.forEach((t) => map.set(t.location.place, (map.get(t.location.place) || 0) + 1));
    return Array.from(map.entries())
      .map(([place, count]) => ({ place: place.split(",")[0], count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);
  }, [tourists]);

  const riskDist = useMemo(() => {
    const groups = { LOW: 0, MEDIUM: 0, HIGH: 0 } as Record<string, number>;
    tourists.forEach((t) => {
      const k = t.safetyScore >= 75 ? "LOW" : t.safetyScore >= 55 ? "MEDIUM" : "HIGH";
      groups[k]++;
    });
    return [
      { name: "Safe", value: groups.LOW, color: "hsl(var(--risk-low))" },
      { name: "Caution", value: groups.MEDIUM, color: "hsl(var(--risk-medium))" },
      { name: "At Risk", value: groups.HIGH, color: "hsl(var(--risk-high))" },
    ];
  }, [tourists]);

  const recentIncidents = incidents.slice(0, 6);
  const highRiskZones = GEO_ZONES.filter((z) => z.riskLevel === "HIGH");

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative glass rounded-3xl p-6 lg:p-8 overflow-hidden">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
        <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-muted-foreground mb-3">
              <Sparkles className="h-3 w-3 text-primary" />
              AI Command Center · Northeast India Grid
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold tracking-tight">
              Realtime <span className="text-gradient">Tourism Safety</span> Intelligence
            </h1>
            <p className="mt-3 text-muted-foreground max-w-2xl">
              Geo-fenced risk monitoring, AI incident classification, and blockchain-anchored
              tourist identity — unified in a single operations console.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="glass rounded-xl px-4 py-3 flex items-center gap-3">
              <Radio className="h-4 w-4 text-[hsl(var(--success))] animate-pulse" />
              <div>
                <div className="text-[10px] uppercase text-muted-foreground tracking-wider">Network</div>
                <div className="text-sm font-medium">All 8 NE states online</div>
              </div>
            </div>
            <div className="glass rounded-xl px-4 py-3">
              <div className="text-[10px] uppercase text-muted-foreground tracking-wider">Avg Safety Score</div>
              <div className="text-2xl font-semibold text-gradient">{stats.avgSafety}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stat cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Tourists" value={stats.total} icon={Users} tone="primary" trend={`${stats.active} tracking safely`} />
        <StatCard label="Live Alerts" value={stats.alert} icon={AlertTriangle} tone="warning" trend="Geo-fence triggered" />
        <StatCard label="Active SOS" value={stats.sos} icon={Siren} tone="danger" trend="Dispatch in progress" />
        <StatCard label="Verified IDs" value={tourists.length} icon={ShieldCheck} tone="accent" trend="Blockchain anchored" />
      </section>

      {/* Charts row */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Incident Trend · 14 days</h3>
              <p className="text-xs text-muted-foreground">AI-classified events across the region</p>
            </div>
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Area type="monotone" dataKey="incidents" stroke="hsl(var(--primary))" fill="url(#g1)" strokeWidth={2} />
              <Area type="monotone" dataKey="sos" stroke="hsl(var(--destructive))" fill="url(#g2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Risk Distribution</h3>
              <p className="text-xs text-muted-foreground">Tourist safety profile</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={riskDist} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={3}>
                {riskDist.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Tourist Density by Location</h3>
              <p className="text-xs text-muted-foreground">Live check-in distribution</p>
            </div>
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={byPlace}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="place" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="count" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="font-semibold mb-1">High-Risk Geo-Zones</h3>
          <p className="text-xs text-muted-foreground mb-4">Active AI advisories</p>
          <ul className="space-y-3">
            {highRiskZones.map((z) => (
              <li key={z.id} className="p-3 rounded-xl bg-secondary/50 border border-border/50">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-medium text-sm">{z.name}</div>
                  <RiskBadge level={z.riskLevel} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{z.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Recent AI-Classified Incidents</h3>
            <p className="text-xs text-muted-foreground">Blockchain-anchored response log</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-muted-foreground border-b border-border/60">
                <th className="py-2 pr-4 font-medium">ID</th>
                <th className="py-2 pr-4 font-medium">Type</th>
                <th className="py-2 pr-4 font-medium">Severity</th>
                <th className="py-2 pr-4 font-medium">Location</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-4 font-medium">TX Hash</th>
              </tr>
            </thead>
            <tbody>
              {recentIncidents.map((i) => (
                <tr key={i.id} className="border-b border-border/40 hover:bg-secondary/30">
                  <td className="py-2.5 pr-4 font-mono text-xs">{i.id}</td>
                  <td className="py-2.5 pr-4">{i.type}</td>
                  <td className="py-2.5 pr-4"><RiskBadge level={i.severity} /></td>
                  <td className="py-2.5 pr-4 text-muted-foreground">{i.location.place}</td>
                  <td className="py-2.5 pr-4">
                    <span className={`text-xs px-2 py-0.5 rounded-md border ${
                      i.status === "RESOLVED" ? "border-[hsl(var(--success)/0.3)] text-[hsl(var(--success))] bg-[hsl(var(--success)/0.1)]" :
                      i.status === "DISPATCHED" ? "border-[hsl(var(--warning)/0.3)] text-[hsl(var(--warning))] bg-[hsl(var(--warning)/0.1)]" :
                      "border-[hsl(var(--destructive)/0.3)] text-[hsl(var(--destructive))] bg-[hsl(var(--destructive)/0.1)]"
                    }`}>{i.status}</span>
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-[10px] text-muted-foreground">{i.blockchainTx?.slice(0, 18)}…</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Index;
