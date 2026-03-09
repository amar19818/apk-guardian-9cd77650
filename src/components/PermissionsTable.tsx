import { Badge } from "@/components/ui/badge";
import type { Permission } from "@/lib/api";
import { cn } from "@/lib/utils";

function getLevelVariant(level: string) {
  switch (level) {
    case "CRITICAL": return "bg-critical/20 text-critical border-critical/30";
    case "DANGEROUS": return "bg-high/20 text-high border-high/30";
    case "MODERATE": return "bg-medium/20 text-medium border-medium/30";
    case "LOW": return "bg-low/20 text-low border-low/30";
    case "SAFE": return "bg-safe/20 text-safe border-safe/30";
    default: return "bg-secondary text-secondary-foreground border-border";
  }
}

export function PermissionsTable({ permissions }: { permissions: Permission[] }) {
  return (
    <div className="space-y-2">
      {permissions.map((perm) => (
        <div
          key={perm.permission}
          className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border/50"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Badge className={cn("shrink-0 text-[10px] font-mono border", getLevelVariant(perm.level))}>
              {perm.level}
            </Badge>
            <span className="font-mono text-xs text-foreground truncate">
              {perm.permission.replace("android.permission.", "")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{perm.description}</span>
            {!perm.necessary && (
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
