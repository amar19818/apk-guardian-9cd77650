import { useState } from "react";
import { UploadZone } from "@/components/UploadZone";
import { AnalysisResults } from "@/components/AnalysisResults";
import { uploadApk, type AnalysisResult } from "@/lib/api";
import { Shield, Terminal } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleFileSelect = async (file: File) => {
    setIsUploading(true);
    try {
      const data = await uploadApk(file);
      setResult(data);
      toast.success("Analysis complete", {
        description: `${data.apkInfo.packageName} — Risk: ${data.overallRisk.label}`,
      });
    } catch (err: any) {
      toast.error("Analysis failed", {
        description: err.message || "Could not analyze the APK file",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => setResult(null);

  return (
    <div className="min-h-screen bg-background bg-grid relative">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-14 max-w-5xl">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-mono font-bold text-sm text-gradient-primary">APK ANALYSER</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Terminal className="h-3.5 w-3.5" />
            <span className="font-mono text-[10px] uppercase tracking-widest">v1.0.0</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-5xl py-8 px-4">
        {!result ? (
          <div className="flex flex-col items-center gap-8 pt-12 animate-fade-in-up">
            <div className="text-center space-y-3">
              <h1 className="text-3xl sm:text-4xl font-bold text-gradient-primary font-mono">
                APK Security Scanner
              </h1>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Upload an Android APK to analyze its permissions, network behavior, and malware risk in seconds.
              </p>
            </div>
            <div className="w-full max-w-xl">
              <UploadZone onFileSelect={handleFileSelect} isUploading={isUploading} />
            </div>
            <div className="grid grid-cols-3 gap-6 text-center mt-4">
              {[
                ["5", "Risk Parameters"],
                ["100+", "Permission Checks"],
                ["C2", "Domain Detection"],
              ].map(([num, label]) => (
                <div key={label}>
                  <p className="text-2xl font-mono font-bold text-primary">{num}</p>
                  <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <AnalysisResults result={result} onReset={handleReset} />
        )}
      </main>
    </div>
  );
};

export default Index;
