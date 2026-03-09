const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// === Meta ===
export interface Meta {
  analysisId: string;
  fileName: string;
  fileSizeBytes: number;
  fileSizeMB: number;
  analysedAt: string;
  analysisTimeMs: number;
}

// === App Info ===
export interface AppInfo {
  packageName: string;
  versionName: string;
  versionCode: number;
  minSdk: number;
  targetSdk: number;
  minAndroidVersion: string;
  targetAndroidVersion: string;
  totalFiles: number;
  dexCount: number;
  nativeLibCount: number;
  assetCount: number;
  isSigned: boolean;
  components: {
    activities: string[];
    services: string[];
    receivers: string[];
    providers: string[];
    features: string[];
  };
}

// === Overall Risk ===
export interface OverallRisk {
  overallScore: number;
  riskLevel: string;
  verdict: string;
  color: string;
  recommendation: string;
  breakdown: {
    securityVulnerabilities: number;
    privacyBreach: number;
    malwareBehaviour: number;
    informationLeak: number;
    financialRisk: number;
  };
}

// === Risk Parameter base ===
export interface RiskParameterBase {
  score: number;
  level: string;
  summary: string;
}

// === Privacy Breach ===
export interface PrivacyBreach extends RiskParameterBase {
  breachCount: number;
  details: {
    score: number;
    level: string;
    breachCount: number;
    breaches: {
      type: string;
      severity: string;
      description: string;
      triggeredBy: string[];
    }[];
    affectedCategories: string[];
    details: Record<string, string[]>;
  };
}

// === Information Leak ===
export interface InformationLeak extends RiskParameterBase {
  findingCount: number;
  details: {
    score: number;
    level: string;
    findingCount: number;
    findings: {
      type: string;
      severity: string;
      pattern: string;
      description: string;
      location: string;
      examples?: string[];
      count?: number;
    }[];
    networkEndpoints: string[];
    suspiciousUrls: string[];
  };
}

// === Security Vulnerabilities ===
export interface SecurityVulnerabilities extends RiskParameterBase {
  vulnerabilityCount: number;
  details: {
    score: number;
    level: string;
    vulnerabilityCount: number;
    vulnerabilities: {
      id: string;
      type: string;
      severity: string;
      description: string;
      recommendation: string;
      cvssScore: number;
    }[];
  };
}

// === Financial Risk ===
export interface FinancialRisk extends RiskParameterBase {
  riskCount: number;
  details: {
    score: number;
    level: string;
    riskCount: number;
    risks: {
      id: string;
      type: string;
      severity: string;
      description: string;
      howItHurtsYou: string;
      recommendation: string;
    }[];
  };
}

// === Malware Behaviour ===
export interface MalwareBehaviour extends RiskParameterBase {
  malwareProbability: string;
  indicatorCount: number;
  details: {
    score: number;
    level: string;
    malwareProbability: string;
    indicatorCount: number;
    indicators: {
      id: string;
      type: string;
      severity: string;
      confidence: string;
      description: string;
      recommendation: string;
    }[];
  };
}

// === Risk Parameters ===
export interface RiskParameters {
  privacyBreach: PrivacyBreach;
  informationLeak: InformationLeak;
  securityVulnerabilities: SecurityVulnerabilities;
  financialRisk: FinancialRisk;
  malwareBehaviour: MalwareBehaviour;
}

// === Permissions ===
export interface PermissionEntry {
  permission: string;
  shortName: string;
  level?: string;
  category: string;
  risk: string;
  description: string;
  reason?: string;
}

export interface Permissions {
  total: number;
  riskScore: number;
  counts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  unnecessary: PermissionEntry[];
  dangerous: PermissionEntry[];
  normal: PermissionEntry[];
  signature: PermissionEntry[];
  unknown: PermissionEntry[];
  categoryBreakdown: Record<string, PermissionEntry[]>;
}

// === Full Analysis Result ===
export interface AnalysisResult {
  meta: Meta;
  appInfo: AppInfo;
  overallRisk: OverallRisk;
  riskParameters: RiskParameters;
  permissions: Permissions;
}

// === Report List Item ===
export interface ReportListItem {
  analysisId: string;
  fileName: string;
  fileSizeMB: number;
  analysedAt: string;
  packageName: string;
  overallScore: number;
  riskLevel: string;
  verdict: string;
}

// === API response wrapper ===
async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Request failed");
  return data.data ?? data;
}

// === Endpoints ===

export async function analyseApk(file: File): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append("apk", file);
  const res = await fetch(`${API_BASE}/api/apk/analyse`, {
    method: "POST",
    body: formData,
  });
  return handleResponse<AnalysisResult>(res);
}

export async function listReports(): Promise<{ total: number; reports: ReportListItem[] }> {
  const res = await fetch(`${API_BASE}/api/report/`);
  return handleResponse(res);
}

export async function getReport(id: string): Promise<AnalysisResult> {
  const res = await fetch(`${API_BASE}/api/report/${id}`);
  return handleResponse<AnalysisResult>(res);
}

export async function getReportSummary(id: string) {
  const res = await fetch(`${API_BASE}/api/report/${id}/summary`);
  return handleResponse(res);
}

export async function deleteReport(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/report/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Delete failed");
}

export async function listKnownPermissions(params?: { category?: string; risk?: string; level?: string }) {
  const query = new URLSearchParams();
  if (params?.category) query.set("category", params.category);
  if (params?.risk) query.set("risk", params.risk);
  if (params?.level) query.set("level", params.level);
  const qs = query.toString();
  const res = await fetch(`${API_BASE}/api/apk/permissions${qs ? `?${qs}` : ""}`);
  return handleResponse(res);
}

export async function healthCheck() {
  const res = await fetch(`${API_BASE}/api/health`);
  return res.json();
}
