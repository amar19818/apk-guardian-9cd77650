import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskGauge } from "./RiskGauge";
import type { RiskParameterBase } from "@/lib/api";
import { cn } from "@/lib/utils";

interface RiskScoreCardProps {
  title: string;
  icon: React.ReactNode;
  param: RiskParameterBase;
}

function getGlowClass(level: string) {
  switch (level) {
    case "critical": return "glow-critical border-critical/30";
    case "high": return "glow-high border-high/30";
    default: return "border-border";
  }
}

export function RiskScoreCard({ title, icon, param }: RiskScoreCardProps) {
  return (
    <Card className={cn("transition-all duration-300 hover:scale-[1.02]", getGlowClass(param.level))}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-muted-foreground">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3">
        <RiskGauge score={param.score} level={param.level} size="sm" />
        <p className="text-xs text-muted-foreground font-mono text-center leading-relaxed">{param.summary}</p>
      </CardContent>
    </Card>
  );
}
