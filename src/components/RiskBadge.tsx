import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  level: "LOW" | "MEDIUM" | "HIGH";
  className?: string;
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
        level === "LOW" && "risk-badge-low",
        level === "MEDIUM" && "risk-badge-medium",
        level === "HIGH" && "risk-badge-high",
        className
      )}
    >
      {level === "HIGH" && "🔴 "}
      {level === "MEDIUM" && "🟡 "}
      {level === "LOW" && "🟢 "}
      {level}
    </span>
  );
}
