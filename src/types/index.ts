export type Severity = 'SEV-1' | 'SEV-2' | 'SEV-3' | 'SEV-4';
export type IncidentStatus = 'Investigating' | 'Mitigating' | 'Resolved' | 'Monitoring';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'ERROR' | 'WARN' | 'INFO' | 'FATAL';
  service: string;
  message: string;
  meta?: Record<string, string | number>;
}

export interface HindsightMemory {
  id: string;
  memoryKey: string;
  title: string;
  incidentId: string;
  service: string;
  severity: Severity;
  rootCause: string;
  resolution: string;
  outcome: 'Resolved' | 'Partially Resolved' | 'Mitigated';
  createdAt: string;
  relativeTime: string;
  similarityScore?: number; // 0 - 100%
  learnedRules: string[];
  affectedMetrics?: {
    metric: string;
    before: string;
    after: string;
  }[];
  runbookId?: string;
  author?: string;
  category?: 'Incident' | 'Runbook' | 'Resolution' | 'Config';
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description?: string;
  type: 'alert' | 'system' | 'memory' | 'action' | 'resolution';
  author?: string;
}

export interface Incident {
  id: string;
  title: string;
  service: string;
  severity: Severity;
  status: IncidentStatus;
  startedAt: string;
  relativeTime: string;
  assignee: {
    name: string;
    avatar?: string;
    role: string;
  };
  environment: 'Production' | 'Staging' | 'Canary';
  errorSummary: string;
  affectedPercentage: string;
  latencyP99?: string;
  logs: LogEntry[];
  memoriesRetrieved: HindsightMemory[];
  recommendedPath: {
    title: string;
    investigationSteps: string[];
    previousResolution: string;
    suggestedRunbookId?: string;
    confidenceScore: number;
  };
  timeline: TimelineEvent[];
  resolvedAt?: string;
  resolutionNotes?: string;
  savedToHindsight?: boolean;
}

export interface Runbook {
  id: string;
  title: string;
  description: string;
  service: string;
  usageCount: number;
  successRate: number;
  lastUsed: string;
  relatedIncidents: string[];
  steps: {
    stepNumber: number;
    title: string;
    command?: string;
    description: string;
    type: 'automated' | 'manual' | 'verification';
  }[];
}

export interface MetricCard {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  subtext?: string;
  highlightMemory?: boolean;
}
