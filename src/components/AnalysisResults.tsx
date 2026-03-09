import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RiskGauge } from "./RiskGauge";
import { RiskScoreCard } from "./RiskScoreCard";
import { PermissionsTable } from "./PermissionsTable";
import { NetworkPanel } from "./NetworkPanel";
import { DangerousCombos } from "./DangerousCombos";
import type { AnalysisResult } from "@/lib/api";
import { downloadTextReport } from "@/lib/api";
import {
  ShieldAlert, Eye, Smartphone, Wifi, Bug,
  FileText, Download, Package, ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

function getVerdictBg(label: string) {
  switch (label) {
    case "CRITICAL": return "bg-critical/10 border-critical/30 text-critical";
    case "HIGH": return "bg-high/10 border-high/30 text-high";
    case "MEDIUM": return "bg-medium/10 border-medium/30 text-medium";
    case "LOW": return "bg-low/10 border-low/30 text-low";
    case "SAFE": return "bg-safe/10 border-safe/30 text-safe";
    default: return "bg-secondary text-secondary-foreground";
  }
}

const riskIcons = {
  privacyBreach: <Eye className="h-4 w-4" />,
  informationLeakage: <ShieldAlert className="h-4 w-4" />,
  deviceControl: <Smartphone className="h-4 w-4" />,
  networkExfiltration: <Wifi className="h-4 w-4" />,
  malwareProbability: <Bug className="h-4 w-4" />,
};

const riskTitles = {
  privacyBreach: "Privacy Breach",
  informationLeakage: "Info Leakage",
  deviceControl: "Device Control",
  networkExfiltration: "Network Exfil",
  malwareProbability: "Malware Prob.",
};

interface AnalysisResultsProps {
  result: AnalysisResult;
  onReset: () => void;
}

export function AnalysisResults({ result, onReset }: AnalysisResultsProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadTextReport(result.analysisId);
    } catch (e) {
      console.error(e);
    }
    setDownloading(false);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Button variant="ghost" onClick={onReset} className="text-muted-foreground hover:text-foreground font-mono text-xs">
          <ArrowLeft className="h-4 w-4 mr-1" /> NEW SCAN
        </Button>
        <Button variant="outline" onClick={handleDownload} disabled={downloading} className="font-mono text-xs border-primary/50 text-primary hover:bg-primary/10 hover:text-primary">
          <Download className="h-4 w-4 mr-1" /> DOWNLOAD REPORT
        </Button>
      </div>

      {/* APK Info + Overall Score */}
      <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-muted-foreground">
              <Package className="h-4 w-4 text-accent" /> APK Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                ["File", result.apkInfo.fileName],
                ["Package", result.apkInfo.packageName],
                ["Version", result.apkInfo.versionName],
                ["Size", `${result.apkInfo.fileSizeMB} MB`],
                ["DEX Files", result.apkInfo.dexFileCount],
                ["Signed", result.apkInfo.isSigned ? "YES" : "NO"],
              ].map(([label, value]) => (
                <div key={String(label)}>
                  <p className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">{label}</p>
                  <p className="font-mono text-sm text-foreground truncate">{String(value)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className={cn("flex flex-col items-center justify-center p-6", getVerdictBg(result.overallRisk.label))}>
          <RiskGauge score={result.overallRisk.score} label={result.overallRisk.label} size="lg" />
          <p className="mt-3 text-center text-sm font-semibold max-w-[200px]">
            {result.overallRisk.verdict}
          </p>
        </Card>
      </div>

      {/* Risk Score Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        {(Object.keys(riskIcons) as Array<keyof typeof riskIcons>).map((key) => (
          <RiskScoreCard
            key={key}
            title={riskTitles[key]}
            icon={riskIcons[key]}
            riskScore={result.riskScores[key]}
          />
        ))}
      </div>

      {/* Tabs for detailed info */}
      <Tabs defaultValue="permissions" className="w-full">
        <TabsList className="w-full justify-start bg-secondary/50 border border-border">
          <TabsTrigger value="permissions" className="font-mono text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <FileText className="h-3 w-3 mr-1" /> Permissions ({result.permissions.total})
          </TabsTrigger>
          <TabsTrigger value="combos" className="font-mono text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <ShieldAlert className="h-3 w-3 mr-1" /> Dangerous Combos
          </TabsTrigger>
          <TabsTrigger value="network" className="font-mono text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <Wifi className="h-3 w-3 mr-1" /> Network
          </TabsTrigger>
        </TabsList>

        <TabsContent value="permissions" className="mt-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(result.permissions.byCriticality).map(([level, perms]) =>
              (perms as string[]).length > 0 ? (
                <Badge key={level} variant="outline" className="font-mono text-[10px]">
                  {level}: {(perms as string[]).length}
                </Badge>
              ) : null
            )}
          </div>
          <PermissionsTable permissions={result.permissions.all} />
        </TabsContent>

        <TabsContent value="combos" className="mt-4">
          <DangerousCombos combos={result.dangerousCombinations} />
        </TabsContent>

        <TabsContent value="network" className="mt-4">
          <NetworkPanel indicators={result.networkIndicators} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
