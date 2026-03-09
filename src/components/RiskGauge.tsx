import { cn } from "@/lib/utils";

interface RiskGaugeProps {
  score: number;
  label: string;
  size?: "sm" | "lg";
}

function getRiskColor(label: string) {
  switch (label) {
    case "CRITICAL": return "text-critical";
    case "HIGH": return "text-high";
    case "MEDIUM": return "text-medium";
    case "LOW": return "text-low";
    case "SAFE": return "text-safe";
    default: return "text-muted-foreground";
  }
}

function getRiskStroke(label: string) {
  switch (label) {
    case "CRITICAL": return "stroke-critical";
    case "HIGH": return "stroke-high";
    case "MEDIUM": return "stroke-medium";
    case "LOW": return "stroke-low";
    case "SAFE": return "stroke-safe";
    default: return "stroke-muted";
  }
}

export function RiskGauge({ score, label, size = "lg" }: RiskGaugeProps) {
  const isLg = size === "lg";
  const svgSize = isLg ? 180 : 100;
  const strokeWidth = isLg ? 10 : 6;
  const radius = (svgSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center">
      <svg width={svgSize} height={svgSize} className="-rotate-90">
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          className="stroke-secondary"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          className={cn(getRiskStroke(label), "transition-all duration-1000 ease-out")}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-mono font-bold", isLg ? "text-4xl" : "text-xl", getRiskColor(label))}>
          {score}
        </span>
        <span className={cn("font-mono font-semibold uppercase tracking-wider", isLg ? "text-xs" : "text-[10px]", getRiskColor(label))}>
          {label}
        </span>
      </div>
    </div>
  );
}
