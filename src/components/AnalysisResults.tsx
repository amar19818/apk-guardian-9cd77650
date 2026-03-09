import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RiskGauge } from "./RiskGauge";
import { RiskScoreCard } from "./RiskScoreCard";
import { PermissionsTable } from "./PermissionsTable";
import { PrivacyBreachPanel, SecurityVulnPanel, InfoLeakPanel, MalwarePanel, FinancialRiskPanel } from "./RiskDetailPanel";
import type { AnalysisResult } from "@/lib/api";
import {
  ShieldAlert, Eye, Bug, DollarSign, Lock,
  FileText, Package, ArrowLeft, Info
} from "lucide-react";
import { cn } from "@/lib/utils";

function getVerdictBg(level: string) {
  switch (level) {
    case "critical": return "bg-critical/10 border-critical/30 text-critical";
    case "high": return "bg-high/10 border-high/30 text-high";
    case "medium": return "bg-medium/10 border-medium/30 text-medium";
    case "low": return "bg-low/10 border-low/30 text-low";
    case "safe": return "bg-safe/10 border-safe/30 text-safe";
    default: return "bg-secondary text-secondary-foreground";
  }
}

const riskIcons = {
  privacyBreach: <Eye className="h-4 w-4" />,
  informationLeak: <ShieldAlert className="h-4 w-4" />,
  securityVulnerabilities: <Lock className="h-4 w-4" />,
  malwareBehaviour: <Bug className="h-4 w-4" />,
  financialRisk: <DollarSign className="h-4 w-4" />,
};

const riskTitles = {
  privacyBreach: "Privacy Breach",
  informationLeak: "Info Leak",
  securityVulnerabilities: "Security Vulns",
  malwareBehaviour: "Malware",
  financialRisk: "Financial Risk",
};

interface AnalysisResultsProps {
  result: AnalysisResult;
  onReset: () => void;
}

export function AnalysisResults({ result, onReset }: AnalysisResultsProps) {
  const { meta, appInfo, overallRisk, riskParameters, permissions } = result;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Button variant="ghost" onClick={onReset} className="text-muted-foreground hover:text-foreground font-mono text-xs">
          <ArrowLeft className="h-4 w-4 mr-1" /> NEW SCAN
        </Button>
        <div className="text-xs text-muted-foreground font-mono">
          Analysis time: {meta.analysisTimeMs}ms
        </div>
      </div>

      {/* App Info + Overall Score */}
      <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-muted-foreground">
              <Package className="h-4 w-4 text-accent" /> App Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                ["File", meta.fileName],
                ["Package", appInfo.packageName],
                ["Version", `${appInfo.versionName} (${appInfo.versionCode})`],
                ["Size", `${meta.fileSizeMB} MB`],
                ["Target SDK", `${appInfo.targetSdk} (${appInfo.targetAndroidVersion})`],
                ["Signed", appInfo.isSigned ? "YES" : "NO"],
                ["DEX Files", appInfo.dexCount],
                ["Native Libs", appInfo.nativeLibCount],
                ["Assets", appInfo.assetCount],
              ].map(([label, value]) => (
                <div key={String(label)}>
                  <p className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">{label}</p>
                  <p className="font-mono text-sm text-foreground truncate">{String(value)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className={cn("flex flex-col items-center justify-center p-6", getVerdictBg(overallRisk.riskLevel))}>
          <RiskGauge score={overallRisk.overallScore} level={overallRisk.riskLevel} size="lg" />
          <p className="mt-2 text-center text-sm font-bold uppercase font-mono">{overallRisk.verdict}</p>
          <p className="mt-1 text-center text-xs max-w-[220px] text-muted-foreground">{overallRisk.recommendation}</p>
        </Card>
      </div>

      {/* Risk Score Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        {(Object.keys(riskIcons) as Array<keyof typeof riskIcons>).map((key) => (
          <RiskScoreCard
            key={key}
            title={riskTitles[key]}
            icon={riskIcons[key]}
            param={riskParameters[key]}
          />
        ))}
      </div>

      {/* Tabs for detailed info */}
      <Tabs defaultValue="privacy" className="w-full">
        <TabsList className="w-full justify-start bg-secondary/50 border border-border flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="privacy" className="font-mono text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <Eye className="h-3 w-3 mr-1" /> Privacy
          </TabsTrigger>
          <TabsTrigger value="security" className="font-mono text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <Lock className="h-3 w-3 mr-1" /> Security
          </TabsTrigger>
          <TabsTrigger value="infoleak" className="font-mono text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <ShieldAlert className="h-3 w-3 mr-1" /> Info Leak
          </TabsTrigger>
          <TabsTrigger value="malware" className="font-mono text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <Bug className="h-3 w-3 mr-1" /> Malware
          </TabsTrigger>
          <TabsTrigger value="financial" className="font-mono text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <DollarSign className="h-3 w-3 mr-1" /> Financial
          </TabsTrigger>
          <TabsTrigger value="permissions" className="font-mono text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <FileText className="h-3 w-3 mr-1" /> Permissions ({permissions.total})
          </TabsTrigger>
          <TabsTrigger value="components" className="font-mono text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <Info className="h-3 w-3 mr-1" /> Components
          </TabsTrigger>
        </TabsList>

        <TabsContent value="privacy" className="mt-4">
          <PrivacyBreachPanel data={riskParameters.privacyBreach} />
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <SecurityVulnPanel data={riskParameters.securityVulnerabilities} />
        </TabsContent>

        <TabsContent value="infoleak" className="mt-4">
          <InfoLeakPanel data={riskParameters.informationLeak} />
        </TabsContent>

        <TabsContent value="malware" className="mt-4">
          <MalwarePanel data={riskParameters.malwareBehaviour} />
        </TabsContent>

        <TabsContent value="financial" className="mt-4">
          <FinancialRiskPanel data={riskParameters.financialRisk} />
        </TabsContent>

        <TabsContent value="permissions" className="mt-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(permissions.counts).map(([level, count]) =>
              count > 0 ? (
                <Badge key={level} variant="outline" className="font-mono text-[10px] uppercase">
                  {level}: {count}
                </Badge>
              ) : null
            )}
          </div>
          <PermissionsTable
            dangerous={permissions.dangerous}
            normal={permissions.normal}
            signature={permissions.signature}
            unnecessary={permissions.unnecessary}
          />
        </TabsContent>

        <TabsContent value="components" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {(["activities", "services", "receivers", "providers", "features"] as const).map((type) => (
              <Card key={type}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">{type}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {appInfo.components[type].length > 0 ? appInfo.components[type].map((c, i) => (
                    <div key={i} className="font-mono text-xs text-foreground p-2 rounded bg-secondary/50">{c}</div>
                  )) : (
                    <p className="text-xs text-muted-foreground font-mono">None</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
