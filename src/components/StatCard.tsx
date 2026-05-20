import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  tone?: "primary" | "success" | "warning" | "danger" | "accent";
}

const TONES = {
  primary: "from-primary/20 to-primary/5 text-primary border-primary/30",
  success: "from-[hsl(var(--success)/0.2)] to-[hsl(var(--success)/0.05)] text-[hsl(var(--success))] border-[hsl(var(--success)/0.3)]",
  warning: "from-[hsl(var(--warning)/0.2)] to-[hsl(var(--warning)/0.05)] text-[hsl(var(--warning))] border-[hsl(var(--warning)/0.3)]",
  danger: "from-[hsl(var(--destructive)/0.2)] to-[hsl(var(--destructive)/0.05)] text-[hsl(var(--destructive))] border-[hsl(var(--destructive)/0.3)]",
  accent: "from-accent/20 to-accent/5 text-accent border-accent/30",
};

const StatCard = ({ label, value, icon: Icon, trend, tone = "primary" }: StatCardProps) => {
  return (
    <div className={cn("relative glass rounded-2xl p-5 overflow-hidden group hover:-translate-y-0.5 transition-transform", "border")}>
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60", TONES[tone].split(" ").slice(0, 2).join(" "))} />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{value}</div>
          {trend && <div className="mt-1 text-xs text-muted-foreground">{trend}</div>}
        </div>
        <div className={cn("h-10 w-10 rounded-xl grid place-items-center border bg-background/40", TONES[tone].split(" ").slice(2).join(" "))}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
