import { Badge } from "@/components/ui/badge";
import type { PermissionEntry } from "@/lib/api";
import { cn } from "@/lib/utils";

function getRiskVariant(risk: string) {
  switch (risk) {
    case "critical": return "bg-critical/20 text-critical border-critical/30";
    case "high": return "bg-high/20 text-high border-high/30";
    case "medium": return "bg-medium/20 text-medium border-medium/30";
    case "low": return "bg-low/20 text-low border-low/30";
    default: return "bg-secondary text-secondary-foreground border-border";
  }
}

interface PermissionsTableProps {
  dangerous: PermissionEntry[];
  normal: PermissionEntry[];
  signature: PermissionEntry[];
  unnecessary: PermissionEntry[];
}

export function PermissionsTable({ dangerous, normal, signature, unnecessary }: PermissionsTableProps) {
  const unnecessaryNames = new Set(unnecessary.map(u => u.permission));
  const allPerms = [...dangerous, ...signature, ...normal];

  return (
    <div className="space-y-2">
      {allPerms.map((perm) => (
        <div
          key={perm.permission}
          className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border/50"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Badge className={cn("shrink-0 text-[10px] font-mono border uppercase", getRiskVariant(perm.risk))}>
              {perm.risk}
            </Badge>
            <span className="font-mono text-xs text-foreground truncate">{perm.shortName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{perm.description}</span>
            {unnecessaryNames.has(perm.permission) && (
              <Badge variant="outline" className="text-[10px] border-destructive/50 text-destructive shrink-0">
                UNNECESSARY
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
