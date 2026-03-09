import { AlertTriangle } from "lucide-react";
import type { DangerousCombination } from "@/lib/api";

export function DangerousCombos({ combos }: { combos: DangerousCombination[] }) {
  if (combos.length === 0) return null;

  return (
    <div className="space-y-3">
      {combos.map((combo, i) => (
        <div key={i} className="rounded-lg border border-critical/20 bg-critical/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-critical" />
            <span className="font-mono text-sm font-semibold text-critical">{combo.label}</span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{combo.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {combo.permissions.map((p) => (
              <span key={p} className="font-mono text-[10px] px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                {p.replace("android.permission.", "")}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
