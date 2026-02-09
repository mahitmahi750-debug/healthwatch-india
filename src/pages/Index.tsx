import { useAppData } from "@/lib/store";
import { StatCard } from "@/components/StatCard";
import { RiskBadge } from "@/components/RiskBadge";
import { Droplets, HeartPulse, AlertTriangle, MapPin, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { format } from "date-fns";

export default function Dashboard() {
  const { waterReadings, healthReports, riskAssessments, alerts } = useAppData();

  const totalVillages = new Set([...waterReadings.map(r => r.village), ...healthReports.map(r => r.village)]).size;
  const highRisk = riskAssessments.filter(r => r.level === "HIGH").length;
  const medRisk = riskAssessments.filter(r => r.level === "MEDIUM").length;
  const activeAlerts = alerts.filter(a => !a.acknowledged).length;

  // Turbidity trend (last 10 readings)
  const turbidityTrend = waterReadings.slice(0, 10).reverse().map(r => ({
    date: format(new Date(r.timestamp), "dd MMM"),
    turbidity: r.turbidity,
    ph: r.ph,
  }));

  // Cases by village (top 5)
  const villageCases = healthReports.reduce<Record<string, number>>((acc, r) => {
    acc[r.village] = (acc[r.village] || 0) + r.diarrheaCases + r.feverCases + r.vomitingCases;
    return acc;
  }, {});
  const topVillages = Object.entries(villageCases)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([village, cases]) => ({ village: village.length > 8 ? village.slice(0, 8) + "…" : village, cases }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Community health overview — Northeast India</p>
      </div>

      {/* Active high alerts banner */}
      {highRisk > 0 && (
        <div className="rounded-xl bg-[hsl(var(--risk-high)/0.08)] border border-[hsl(var(--risk-high)/0.2)] p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
          <p className="text-sm text-foreground">
            <strong>{highRisk} village{highRisk > 1 ? "s" : ""}</strong> currently at high risk. {activeAlerts} active alert{activeAlerts !== 1 ? "s" : ""} require attention.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Villages Monitored" value={totalVillages} icon={MapPin} variant="default" />
        <StatCard title="Water Readings" value={waterReadings.length} icon={Droplets} variant="success" />
        <StatCard title="High Risk Zones" value={highRisk} icon={AlertTriangle} variant="danger" description={`${medRisk} medium risk`} />
        <StatCard title="Active Alerts" value={activeAlerts} icon={Activity} variant={activeAlerts > 0 ? "warning" : "default"} />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4 text-foreground">Water Quality Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={turbidityTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
              <Line type="monotone" dataKey="turbidity" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 3 }} name="Turbidity (NTU)" />
              <Line type="monotone" dataKey="ph" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 3 }} name="pH Level" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4 text-foreground">Cases by Village</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topVillages}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="village" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
              <Bar dataKey="cases" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} name="Total Cases" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk table */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-4 text-foreground">Village Risk Assessment</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Village</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Risk Level</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium hidden sm:table-cell">Water Score</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium hidden sm:table-cell">Health Score</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {riskAssessments.sort((a, b) => b.totalScore - a.totalScore).slice(0, 10).map(r => (
                <tr key={r.village} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 px-3 font-medium">{r.village}</td>
                  <td className="py-2.5 px-3"><RiskBadge level={r.level} /></td>
                  <td className="py-2.5 px-3 hidden sm:table-cell">{r.waterScore}</td>
                  <td className="py-2.5 px-3 hidden sm:table-cell">{r.healthScore}</td>
                  <td className="py-2.5 px-3 font-semibold">{r.totalScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
