import { RiskLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

const RiskBadge = ({ level, className }: { level: RiskLevel; className?: string }) => {
  const cls =
    level === "HIGH" ? "risk-badge-high" : level === "MEDIUM" ? "risk-badge-medium" : "risk-badge-low";
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider", cls, className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {level}
    </span>
  );
};

export default RiskBadge;
