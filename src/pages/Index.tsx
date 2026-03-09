import { useState } from "react";
import { UploadZone } from "@/components/UploadZone";
import { AnalysisResults } from "@/components/AnalysisResults";
import { ReportHistory } from "@/components/ReportHistory";
import { analyseApk, getReport, type AnalysisResult } from "@/lib/api";
import { Shield, Terminal, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Index = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const handleFileSelect = async (file: File) => {
    setIsUploading(true);
    try {
      const data = await analyseApk(file);
      setResult(data);
      toast.success("Analysis complete", {
        description: `${data.appInfo.packageName} — Risk: ${data.overallRisk.riskLevel.toUpperCase()}`,
      });
    } catch (err: any) {
      toast.error("Analysis failed", {
        description: err.message || "Could not analyze the APK file",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewReport = async (analysisId: string) => {
    try {
      const data = await getReport(analysisId);
      setResult(data);
      setShowHistory(false);
    } catch (err: any) {
      toast.error("Failed to load report", { description: err.message });
    }
  };

  const handleReset = () => {
    setResult(null);
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-background bg-grid relative">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-14 max-w-5xl">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-mono font-bold text-sm text-gradient-primary">APK ANALYSER</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setShowHistory(!showHistory); setResult(null); }}
              className="font-mono text-[10px] text-muted-foreground hover:text-foreground"
            >
              <History className="h-3.5 w-3.5 mr-1" /> HISTORY
            </Button>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Terminal className="h-3.5 w-3.5" />
              <span className="font-mono text-[10px] uppercase tracking-widest">v1.0.0</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl py-8 px-4">
        {result ? (
          <AnalysisResults result={result} onReset={handleReset} />
        ) : showHistory ? (
          <ReportHistory onViewReport={handleViewReport} onBack={() => setShowHistory(false)} />
        ) : (
          <div className="flex flex-col items-center gap-8 pt-12 animate-fade-in-up">
            <div className="text-center space-y-3">
              <h1 className="text-3xl sm:text-4xl font-bold text-gradient-primary font-mono">
                APK Security Scanner
              </h1>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Upload an Android APK to analyze its permissions, vulnerabilities, and malware risk in seconds.
              </p>
            </div>
            <div className="w-full max-w-xl">
              <UploadZone onFileSelect={handleFileSelect} isUploading={isUploading} />
            </div>
            <div className="grid grid-cols-3 gap-6 text-center mt-4">
              {[
                ["5", "Risk Parameters"],
                ["100+", "Permission Checks"],
                ["CVSS", "Vulnerability Scoring"],
              ].map(([num, label]) => (
                <div key={label}>
                  <p className="text-2xl font-mono font-bold text-primary">{num}</p>
                  <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
