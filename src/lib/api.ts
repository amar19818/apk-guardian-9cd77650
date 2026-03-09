const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export interface ApkInfo {
  fileName: string;
  fileSizeBytes: number;
  fileSizeMB: number;
  packageName: string;
  versionName: string;
  totalFilesInApk: number;
  dexFileCount: number;
  nativeLibCount: number;
  assetsCount: number;
  isSigned: boolean;
}

export interface RiskLevel {
  score: number;
  label: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "SAFE";
}

export interface RiskScore extends RiskLevel {
  triggeredBy?: string[];
  reasons?: string[];
}

export interface Permission {
  permission: string;
  level: string;
  category: string;
  description: string;
  riskReason: string;
  necessary: boolean;
}

export interface DangerousCombination {
  label: string;
  description: string;
  permissions: string[];
}

export interface NetworkIndicators {
  hardcodedUrls: string[];
  hardcodedIPs: string[];
  suspiciousDomains: string[];
}

export interface AnalysisSummary {
  totalPermissions: number;
  unnecessaryPermissions: number;
  criticalPermissions: number;
  dangerousPermissions: number;
  dangerousCombinations: number;
  topRiskAreas?: { category: string; score: number; label: string }[];
  overallScore: number;
  overallLabel: string;
  verdict: string;
}

export interface AnalysisResult {
  analysisId: string;
  status: string;
  analyzedAt: string;
  processingTimeMs: number;
  apkInfo: ApkInfo;
  overallRisk: RiskLevel & { verdict: string };
  riskScores: {
    privacyBreach: RiskScore;
    informationLeakage: RiskScore;
    deviceControl: RiskScore;
    networkExfiltration: RiskScore;
    malwareProbability: RiskScore;
  };
  permissions: {
    total: number;
    unnecessary: string[];
    byCriticality: Record<string, string[]>;
    all: Permission[];
  };
  dangerousCombinations: DangerousCombination[];
  networkIndicators: NetworkIndicators;
  filesAnalysis: {
    dexFiles: { name: string; size: number }[];
    nativeLibraries: { name: string; size: number; arch: string }[];
    suspiciousFiles: { name: string; size: number }[];
    signingFiles: string[];
    assets: string[];
  };
  summary: AnalysisSummary;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Request failed");
  return data.data ?? data;
}

export async function uploadApk(file: File): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append("apk", file);
  const res = await fetch(`${API_BASE}/api/analyse/upload`, {
    method: "POST",
    body: formData,
  });
  return handleResponse<AnalysisResult>(res);
}

export async function getAnalysis(id: string): Promise<AnalysisResult> {
  const res = await fetch(`${API_BASE}/api/analyse/${id}`);
  return handleResponse<AnalysisResult>(res);
}

export async function getRiskScores(id: string) {
  const res = await fetch(`${API_BASE}/api/analyse/${id}/risk-scores`);
  return handleResponse(res);
}

export async function getPermissions(id: string) {
  const res = await fetch(`${API_BASE}/api/analyse/${id}/permissions`);
  return handleResponse(res);
}

export async function getNetworkIndicators(id: string) {
  const res = await fetch(`${API_BASE}/api/analyse/${id}/network`);
  return handleResponse(res);
}

export async function getSummary(id: string) {
  const res = await fetch(`${API_BASE}/api/analyse/${id}/summary`);
  return handleResponse(res);
}

export async function downloadTextReport(id: string) {
  const res = await fetch(`${API_BASE}/api/report/${id}`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `apk-report-${id}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function getJsonReport(id: string) {
  const res = await fetch(`${API_BASE}/api/report/${id}/json`);
  return handleResponse(res);
}
