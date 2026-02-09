import { useAppData } from "@/lib/store";
import { RiskBadge } from "@/components/RiskBadge";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function Alerts() {
  const { alerts, acknowledgeAlert } = useAppData();

  const active = alerts.filter(a => !a.acknowledged);
  const acknowledged = alerts.filter(a => a.acknowledged);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><AlertTriangle className="h-6 w-6 text-warning" /> Early Warning Alerts</h1>
        <p className="text-muted-foreground text-sm mt-1">Automated alerts based on water quality and health symptom analysis</p>
      </div>

      {active.length === 0 && (
        <div className="glass-card rounded-xl p-8 text-center">
          <CheckCircle2 className="h-10 w-10 text-success mx-auto mb-3" />
          <p className="font-medium text-foreground">No active alerts</p>
          <p className="text-sm text-muted-foreground mt-1">All monitored villages are within safe parameters</p>
        </div>
      )}

      {active.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Active Alerts ({active.length})</h3>
          {active.map(a => (
            <div key={a.id} className={`rounded-xl p-4 flex items-start gap-3 ${a.level === "HIGH" ? "bg-[hsl(var(--risk-high)/0.06)] border border-[hsl(var(--risk-high)/0.2)]" : "bg-[hsl(var(--risk-medium)/0.06)] border border-[hsl(var(--risk-medium)/0.2)]"}`}>
              <AlertTriangle className={`h-5 w-5 shrink-0 mt-0.5 ${a.level === "HIGH" ? "text-destructive" : "text-warning"}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{a.village}</span>
                  <RiskBadge level={a.level} />
                </div>
                <p className="text-sm text-foreground/80">{a.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{format(new Date(a.timestamp), "dd MMM yyyy, HH:mm")}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => acknowledgeAlert(a.id)} className="shrink-0 text-xs">
                Acknowledge
              </Button>
            </div>
          ))}
        </div>
      )}

      {acknowledged.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Acknowledged ({acknowledged.length})</h3>
          {acknowledged.slice(0, 10).map(a => (
            <div key={a.id} className="glass-card rounded-xl p-4 flex items-start gap-3 opacity-60">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-medium text-sm">{a.village}</span>
                  <RiskBadge level={a.level} />
                </div>
                <p className="text-xs text-muted-foreground">{a.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{format(new Date(a.timestamp), "dd MMM yyyy, HH:mm")}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
