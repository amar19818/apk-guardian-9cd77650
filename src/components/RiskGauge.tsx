import { cn } from "@/lib/utils";

interface RiskGaugeProps {
  score: number;
  level: string;
  size?: "sm" | "lg";
}

function getRiskColor(level: string) {
  switch (level) {
    case "critical": return "text-critical";
    case "high": return "text-high";
    case "medium": return "text-medium";
    case "low": return "text-low";
    case "safe": return "text-safe";
    default: return "text-muted-foreground";
  }
}

function getRiskStroke(level: string) {
  switch (level) {
    case "critical": return "stroke-critical";
    case "high": return "stroke-high";
    case "medium": return "stroke-medium";
    case "low": return "stroke-low";
    case "safe": return "stroke-safe";
    default: return "stroke-muted";
  }
}

export function RiskGauge({ score, level, size = "lg" }: RiskGaugeProps) {
  const isLg = size === "lg";
  const svgSize = isLg ? 180 : 100;
  const strokeWidth = isLg ? 10 : 6;
  const radius = (svgSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center">
      <svg width={svgSize} height={svgSize} className="-rotate-90">
        <circle cx={svgSize / 2} cy={svgSize / 2} r={radius} fill="none" className="stroke-secondary" strokeWidth={strokeWidth} />
        <circle cx={svgSize / 2} cy={svgSize / 2} r={radius} fill="none" className={cn(getRiskStroke(level), "transition-all duration-1000 ease-out")} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-mono font-bold", isLg ? "text-4xl" : "text-xl", getRiskColor(level))}>{score}</span>
        <span className={cn("font-mono font-semibold uppercase tracking-wider", isLg ? "text-xs" : "text-[10px]", getRiskColor(level))}>{level}</span>
      </div>
    </div>
  );
}
