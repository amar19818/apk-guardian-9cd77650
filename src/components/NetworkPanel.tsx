import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { NetworkIndicators } from "@/lib/api";
import { Globe, AlertTriangle, Server } from "lucide-react";

export function NetworkPanel({ indicators }: { indicators: NetworkIndicators }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-muted-foreground">
            <Globe className="h-4 w-4 text-accent" />
            Hardcoded URLs ({indicators.hardcodedUrls.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 max-h-60 overflow-y-auto">
          {indicators.hardcodedUrls.map((url, i) => (
            <div key={i} className="font-mono text-xs text-foreground break-all p-2 rounded bg-secondary/50">
              {url}
            </div>
          ))}
          {indicators.hardcodedUrls.length === 0 && (
            <p className="text-xs text-muted-foreground font-mono">None found</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-muted-foreground">
            <Server className="h-4 w-4 text-low" />
            Hardcoded IPs ({indicators.hardcodedIPs.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 max-h-60 overflow-y-auto">
          {indicators.hardcodedIPs.map((ip, i) => (
            <div key={i} className="font-mono text-xs text-foreground p-2 rounded bg-secondary/50">
              {ip}
            </div>
          ))}
          {indicators.hardcodedIPs.length === 0 && (
            <p className="text-xs text-muted-foreground font-mono">None found</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-muted-foreground">
            <AlertTriangle className="h-4 w-4 text-critical" />
            Suspicious ({indicators.suspiciousDomains.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 max-h-60 overflow-y-auto">
          {indicators.suspiciousDomains.map((d, i) => (
            <div key={i} className="font-mono text-xs p-2 rounded bg-critical/10 border border-critical/20 text-critical break-all">
              {d}
            </div>
          ))}
          {indicators.suspiciousDomains.length === 0 && (
            <Badge className="bg-safe/20 text-safe border-safe/30 border">ALL CLEAR</Badge>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
