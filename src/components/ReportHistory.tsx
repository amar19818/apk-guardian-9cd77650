import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { listReports, deleteReport, type ReportListItem } from "@/lib/api";
import { ArrowLeft, Trash2, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function getLevelClass(level: string) {
  switch (level) {
    case "critical": return "bg-critical/20 text-critical border-critical/30";
    case "high": return "bg-high/20 text-high border-high/30";
    case "medium": return "bg-medium/20 text-medium border-medium/30";
    case "low": return "bg-low/20 text-low border-low/30";
    case "safe": return "bg-safe/20 text-safe border-safe/30";
    default: return "bg-secondary text-secondary-foreground border-border";
  }
}

interface ReportHistoryProps {
  onViewReport: (id: string) => void;
  onBack: () => void;
}

export function ReportHistory({ onViewReport, onBack }: ReportHistoryProps) {
  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await listReports();
      setReports(data.reports || []);
    } catch {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteReport(id);
      setReports((r) => r.filter((x) => x.analysisId !== id));
      toast.success("Report deleted");
    } catch {
      toast.error("Failed to delete report");
    }
  };

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-foreground font-mono text-xs">
          <ArrowLeft className="h-4 w-4 mr-1" /> BACK
        </Button>
        <h2 className="font-mono text-sm text-muted-foreground uppercase tracking-wider">Scan History</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 text-primary animate-spin" /></div>
      ) : reports.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground font-mono">No reports yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {reports.map((r) => (
            <Card
              key={r.analysisId}
              className="cursor-pointer hover:border-primary/30 transition-colors"
              onClick={() => onViewReport(r.analysisId)}
            >
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm text-foreground truncate">{r.fileName}</span>
                    <Badge className={cn("text-[10px] font-mono border uppercase shrink-0", getLevelClass(r.riskLevel))}>
                      {r.riskLevel}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono">
                    <span>{r.packageName}</span>
                    <span>{r.fileSizeMB} MB</span>
                    <span>{new Date(r.analysedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg font-bold text-foreground">{r.overallScore}</span>
                  <Button variant="ghost" size="sm" onClick={(e) => handleDelete(r.analysisId, e)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
