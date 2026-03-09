import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, Bug, DollarSign, Eye } from "lucide-react";
import type { RiskParameters } from "@/lib/api";
import { cn } from "@/lib/utils";

function getSeverityClass(severity: string) {
  switch (severity) {
    case "critical": return "bg-critical/10 border-critical/20 text-critical";
    case "high": return "bg-high/10 border-high/20 text-high";
    case "medium": return "bg-medium/10 border-medium/20 text-medium";
    default: return "bg-low/10 border-low/20 text-low";
  }
}

function getSeverityBadge(severity: string) {
  switch (severity) {
    case "critical": return "bg-critical/20 text-critical border-critical/30";
    case "high": return "bg-high/20 text-high border-high/30";
    case "medium": return "bg-medium/20 text-medium border-medium/30";
    default: return "bg-low/20 text-low border-low/30";
  }
}

export function PrivacyBreachPanel({ data }: { data: RiskParameters["privacyBreach"] }) {
  const breaches = data.details?.breaches || [];
  if (breaches.length === 0) return <p className="text-xs text-muted-foreground font-mono">No privacy breaches detected.</p>;

  return (
    <div className="space-y-3">
      {breaches.map((b, i) => (
        <div key={i} className={cn("rounded-lg border p-4", getSeverityClass(b.severity))}>
          <div className="flex items-center gap-2 mb-2">
            <Eye className="h-4 w-4" />
            <span className="font-mono text-sm font-semibold">{b.type}</span>
            <Badge className={cn("text-[10px] font-mono border ml-auto", getSeverityBadge(b.severity))}>{b.severity}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{b.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {b.triggeredBy.map((p) => (
              <span key={p} className="font-mono text-[10px] px-2 py-0.5 rounded bg-secondary text-secondary-foreground">{p}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SecurityVulnPanel({ data }: { data: RiskParameters["securityVulnerabilities"] }) {
  const vulns = data.details?.vulnerabilities || [];
  if (vulns.length === 0) return <p className="text-xs text-muted-foreground font-mono">No vulnerabilities found.</p>;

  return (
    <div className="space-y-3">
      {vulns.map((v) => (
        <div key={v.id} className={cn("rounded-lg border p-4", getSeverityClass(v.severity))}>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4" />
            <span className="font-mono text-sm font-semibold">{v.type}</span>
            <Badge className={cn("text-[10px] font-mono border ml-auto", getSeverityBadge(v.severity))}>CVSS {v.cvssScore}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{v.description}</p>
          <p className="text-xs text-primary font-mono">→ {v.recommendation}</p>
        </div>
      ))}
    </div>
  );
}

export function InfoLeakPanel({ data }: { data: RiskParameters["informationLeak"] }) {
  const findings = data.details?.findings || [];
  if (findings.length === 0) return <p className="text-xs text-muted-foreground font-mono">No information leaks found.</p>;

  return (
    <div className="space-y-3">
      {findings.map((f, i) => (
        <div key={i} className={cn("rounded-lg border p-4", getSeverityClass(f.severity))}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-mono text-sm font-semibold">{f.pattern}</span>
            <Badge className={cn("text-[10px] font-mono border ml-auto", getSeverityBadge(f.severity))}>{f.type}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{f.description}</p>
          {f.examples && f.examples.length > 0 && (
            <div className="space-y-1 mt-2">
              {f.examples.map((ex, j) => (
                <div key={j} className="font-mono text-[10px] px-2 py-1 rounded bg-secondary/50 text-secondary-foreground break-all">{ex}</div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function MalwarePanel({ data }: { data: RiskParameters["malwareBehaviour"] }) {
  const indicators = data.details?.indicators || [];
  if (indicators.length === 0) return <p className="text-xs text-muted-foreground font-mono">No malware indicators found.</p>;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-mono text-muted-foreground">Malware Probability:</span>
        <Badge className={cn("text-[10px] font-mono border", getSeverityBadge(data.level))}>{data.malwareProbability}</Badge>
      </div>
      {indicators.map((ind) => (
        <div key={ind.id} className={cn("rounded-lg border p-4", getSeverityClass(ind.severity))}>
          <div className="flex items-center gap-2 mb-2">
            <Bug className="h-4 w-4" />
            <span className="font-mono text-sm font-semibold">{ind.type}</span>
            <Badge className={cn("text-[10px] font-mono border ml-auto", getSeverityBadge(ind.severity))}>{ind.confidence}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{ind.description}</p>
          <p className="text-xs text-primary font-mono">→ {ind.recommendation}</p>
        </div>
      ))}
    </div>
  );
}

export function FinancialRiskPanel({ data }: { data: RiskParameters["financialRisk"] }) {
  const risks = data.details?.risks || [];
  if (risks.length === 0) return <p className="text-xs text-muted-foreground font-mono">No financial risks found.</p>;

  return (
    <div className="space-y-3">
      {risks.map((r) => (
        <div key={r.id} className={cn("rounded-lg border p-4", getSeverityClass(r.severity))}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4" />
            <span className="font-mono text-sm font-semibold">{r.type}</span>
            <Badge className={cn("text-[10px] font-mono border ml-auto", getSeverityBadge(r.severity))}>{r.severity}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{r.description}</p>
          <p className="text-xs text-high font-mono italic">💰 {r.howItHurtsYou}</p>
          <p className="text-xs text-primary font-mono mt-1">→ {r.recommendation}</p>
        </div>
      ))}
    </div>
  );
}
