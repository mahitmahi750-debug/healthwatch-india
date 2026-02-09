import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  variant?: "default" | "success" | "warning" | "danger";
}

const variantStyles = {
  default: "border-border",
  success: "border-[hsl(var(--risk-low)/0.4)]",
  warning: "border-[hsl(var(--risk-medium)/0.4)]",
  danger: "border-[hsl(var(--risk-high)/0.4)]",
};

const iconStyles = {
  default: "text-primary bg-primary/10",
  success: "text-[hsl(var(--risk-low))] bg-[hsl(var(--risk-low)/0.1)]",
  warning: "text-[hsl(var(--risk-medium))] bg-[hsl(var(--risk-medium)/0.1)]",
  danger: "text-[hsl(var(--risk-high))] bg-[hsl(var(--risk-high)/0.1)]",
};

export function StatCard({ title, value, icon: Icon, description, variant = "default" }: StatCardProps) {
  return (
    <div className={cn("glass-card rounded-xl p-5 transition-shadow hover:shadow-md", variantStyles[variant])}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1 text-foreground">{value}</p>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className={cn("p-2.5 rounded-lg", iconStyles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
