import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskGauge } from "./RiskGauge";
import type { RiskScore } from "@/lib/api";
import { cn } from "@/lib/utils";

interface RiskScoreCardProps {
  title: string;
  icon: React.ReactNode;
  riskScore: RiskScore;
}

function getGlowClass(label: string) {
  switch (label) {
    case "CRITICAL": return "glow-critical border-critical/30";
    case "HIGH": return "glow-high border-high/30";
    default: return "border-border";
  }
}

export function RiskScoreCard({ title, icon, riskScore }: RiskScoreCardProps) {
  const reasons = riskScore.reasons || riskScore.triggeredBy || [];

  return (
    <Card className={cn("transition-all duration-300 hover:scale-[1.02]", getGlowClass(riskScore.label))}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-muted-foreground">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3">
        <RiskGauge score={riskScore.score} label={riskScore.label} size="sm" />
        {reasons.length > 0 && (
          <ul className="w-full space-y-1 text-xs text-muted-foreground">
            {reasons.slice(0, 3).map((r, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-primary mt-0.5">›</span>
                <span className="font-mono leading-relaxed">{r.replace("android.permission.", "")}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
