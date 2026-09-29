import React, { createContext, useContext, useState, useEffect } from 'react';
import { Incident, HindsightMemory, Runbook, IncidentStatus } from '../types';
import { initialIncidents, initialMemories, initialRunbooks } from './mockData';
import { findRelevantMemories, buildEvidenceSummary } from './hindsightEngine';
import {
  getHindsightHealth,
  retainIncidentMemory,
  recallIncidentMemories,
  HindsightHealthStatus,
} from './hindsightClient';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'memory';
  timestamp: string;
}

export interface RunbookOutcome {
  runbookId: string;
  incidentId: string;
  success: boolean;
  notes?: string;
  timestamp: string;
}

export interface PostMortem {
  id: string;
  incidentId: string;
  rootCause: string;
  resolution: string;
  whatWorked: string;
  whatDidNotWork: string;
  runbookUsed?: string;
  lessonsLearned: string;
  author: string;
  createdAt: string;
}

interface IncidentStoreContextType {
  incidents: Incident[];
  selectedIncident: Incident | null;
  memories: HindsightMemory[];
  runbooks: Runbook[];
  runbookOutcomes: RunbookOutcome[];
  postMortems: PostMortem[];
  activeTab: string;
  toasts: ToastMessage[];
  demoStep: number;
  environment: string;
  hindsightStatus: HindsightHealthStatus;
  // Actions
  setActiveTab: (tab: string) => void;
  selectIncident: (id: string) => void;
  setEnvironment: (env: string) => void;
  addToast: (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
  updateIncidentStatus: (id: string, status: IncidentStatus, notes?: string) => void;
  resolveIncidentAndSaveMemory: (id: string, resolutionNotes: string, rootCause?: string) => Promise<void>;
  executeRunbook: (runbookId: string, incidentId: string) => Promise<boolean>;
  saveRunbookOutcome: (runbookId: string, incidentId: string, success: boolean, notes?: string) => void;
  savePostMortem: (pm: Omit<PostMortem, 'id' | 'createdAt'>) => Promise<void>;
  createNewIncident: (data: Partial<Incident>) => Promise<void>;
  setDemoStep: (step: number) => void;
  resetDemoData: () => void;
  totalMemoryCount: number;
}

const IncidentStoreContext = createContext<IncidentStoreContextType | undefined>(undefined);

const STORAGE_KEY = 'opsmind_state_v1';

export const IncidentStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_incidents`);
    return saved ? JSON.parse(saved) : initialIncidents;
  });

  const [memories, setMemories] = useState<HindsightMemory[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_memories`);
    return saved ? JSON.parse(saved) : initialMemories;
  });

  const [runbooks, setRunbooks] = useState<Runbook[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_runbooks`);
    return saved ? JSON.parse(saved) : initialRunbooks;
  });

  const [runbookOutcomes, setRunbookOutcomes] = useState<RunbookOutcome[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_outcomes`);
    return saved ? JSON.parse(saved) : [];
  });

  const [postMortems, setPostMortems] = useState<PostMortem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_postmortems`);
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('INC-1042');
  const [activeTab, setActiveTab] = useState<string>('investigation');
  const [environment, setEnvironment] = useState<string>('Production');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [demoStep, setDemoStep] = useState<number>(1);
  const [totalMemoryCount, setTotalMemoryCount] = useState<number>(1284);
  const [hindsightStatus, setHindsightStatus] = useState<HindsightHealthStatus>({
    status: 'fallback',
    usingRealHindsight: false,
    baseUrl: 'https://api.hindsight.vectorize.io',
    bankId: 'default',
    message: 'Initializing Hindsight health check...',
  });

  // Check Hindsight API health on mount
  useEffect(() => {
    getHindsightHealth().then((status) => {
      setHindsightStatus(status);
    });
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_incidents`, JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_memories`, JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_outcomes`, JSON.stringify(runbookOutcomes));
  }, [runbookOutcomes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_postmortems`, JSON.stringify(postMortems));
  }, [postMortems]);

  const selectedIncident = incidents.find((i) => i.id === selectedIncidentId) || incidents[0] || null;

  const addToast = (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast: ToastMessage = {
      ...toast,
      id,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));

    // Auto remove after 5s
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const selectIncident = (id: string) => {
    setSelectedIncidentId(id);
    setActiveTab('investigation');
  };

  const updateIncidentStatus = (id: string, status: IncidentStatus, notes?: string) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === id) {
          const updatedTimeline = [
            ...inc.timeline,
            {
              id: `tl-${Date.now()}`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              title: `Status changed to ${status}`,
              description: notes || `Incident transitioned to ${status} state`,
              type: status === 'Resolved' ? ('resolution' as const) : ('action' as const),
              author: 'Mohan S.',
            },
          ];
          return {
            ...inc,
            status,
            resolutionNotes: notes || inc.resolutionNotes,
            resolvedAt: status === 'Resolved' ? new Date().toISOString() : inc.resolvedAt,
            timeline: updatedTimeline,
          };
        }
        return inc;
      })
    );

    addToast({
      title: `${id} status updated`,
      description: `Incident is now ${status}`,
      type: status === 'Resolved' ? 'success' : 'info',
    });
  };

  const resolveIncidentAndSaveMemory = async (id: string, resolutionNotes: string, rootCause?: string) => {
    const inc = incidents.find((i) => i.id === id);
    if (!inc) return;

    const actualRootCause = rootCause || 'Database connection pool exhaustion on payments-api under high batch traffic.';
    const actualResolution = resolutionNotes || 'Applied Runbook: Scaled connection pool size from 50 to 100 and triggered pod restart.';

    // 1. Call Hindsight Retain API (async)
    const retainRes = await retainIncidentMemory(inc, actualRootCause, actualResolution);

    // 2. Update incident state
    setIncidents((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedTimeline = [
            ...item.timeline,
            {
              id: `tl-${Date.now()}`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              title: retainRes.source === 'hindsight_api' ? 'Resolution Retained in Hindsight' : 'Incident Resolved & Saved',
              description: `Memory vector indexed. Root cause: ${actualRootCause}`,
              type: 'resolution' as const,
              author: 'Mohan S.',
            },
          ];
          return {
            ...item,
            status: 'Resolved',
            savedToHindsight: true,
            resolvedAt: new Date().toISOString(),
            resolutionNotes: actualResolution,
            timeline: updatedTimeline,
          };
        }
        return item;
      })
    );

    // 3. Add fresh memory to Hindsight catalog
    const newMemory: HindsightMemory = {
      id: retainRes.memoryId || `mem-${id.toLowerCase()}`,
      memoryKey: `${inc.service}:resolution:${Date.now().toString(36)}`,
      title: `${inc.title} Resolution`,
      incidentId: id,
      service: inc.service,
      severity: inc.severity,
      rootCause: actualRootCause,
      resolution: actualResolution,
      outcome: 'Resolved',
      createdAt: new Date().toISOString(),
      relativeTime: 'Just now',
      category: 'Resolution',
      author: retainRes.source === 'hindsight_api' ? 'Hindsight Memory' : 'Mohan S.',
      similarityScore: 100,
      learnedRules: [
        `Verified recovery rule: Scaling pool to 100 resolves 503 within 45 seconds`,
        retainRes.source === 'hindsight_api'
          ? `Indexed into Hindsight Memory Bank`
          : `Saved execution telemetry to local index for ${inc.service}`
      ],
      affectedMetrics: [
        { metric: '503 Error Rate', before: inc.affectedPercentage, after: '0.00%' },
        { metric: 'Latency p99', before: inc.latencyP99 || '3,420ms', after: '135ms' }
      ]
    };

    setMemories((prev) => [newMemory, ...prev]);
    setTotalMemoryCount((prev) => prev + 1);

    // 4. Show Hindsight notification
    if (retainRes.source === 'hindsight_api') {
      addToast({
        title: 'Resolution Retained in Hindsight',
        description: `Experience vector indexed in Hindsight bank for ${inc.service}. Future incidents will recall this resolution.`,
        type: 'memory',
      });
    } else {
      addToast({
        title: 'Incident Resolution Saved to Memory Index',
        description: `New knowledge memory indexed for ${inc.service} (Local fallback). Future incidents will recall this path.`,
        type: 'memory',
      });
    }
  };

  const executeRunbook = async (runbookId: string, incidentId: string): Promise<boolean> => {
    const rb = runbooks.find((r) => r.id === runbookId);
    if (!rb) return false;

    // Increment runbook usage count
    setRunbooks((prev) =>
      prev.map((r) => (r.id === runbookId ? { ...r, usageCount: r.usageCount + 1, lastUsed: 'Just now' } : r))
    );

    // Add timeline event to incident
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          const updatedTimeline = [
            ...inc.timeline,
            {
              id: `tl-${Date.now()}`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              title: `Executed Runbook: ${rb.title}`,
              description: `Automated remediation applied all ${rb.steps.length} steps successfully.`,
              type: 'action' as const,
              author: 'Mohan S.',
            },
          ];
          return {
            ...inc,
            timeline: updatedTimeline,
          };
        }
        return inc;
      })
    );

    addToast({
      title: `Runbook Executed: ${rb.title}`,
      description: 'Applied pool limit expansion & rolling restart on payments-api.',
      type: 'success',
    });

    return true;
  };

  const saveRunbookOutcome = (runbookId: string, incidentId: string, success: boolean, notes?: string) => {
    const rb = runbooks.find((r) => r.id === runbookId);
    if (!rb) return;

    const outcome: RunbookOutcome = {
      runbookId,
      incidentId,
      success,
      notes,
      timestamp: new Date().toISOString(),
    };

    setRunbookOutcomes((prevOutcomes) => {
      const updatedOutcomes = [outcome, ...prevOutcomes];
      
      // Update runbook success rate dynamically based on current updated list
      setRunbooks((prevRunbooks) =>
        prevRunbooks.map((r) => {
          if (r.id !== runbookId) return r;
          const allOutcomes = updatedOutcomes.filter((o) => o.runbookId === runbookId);
          const successCount = allOutcomes.filter((o) => o.success).length;
          const newRate = Math.round((successCount / allOutcomes.length) * 100);
          return {
            ...r,
            successRate: newRate,
            relatedIncidents: r.relatedIncidents.includes(incidentId)
              ? r.relatedIncidents
              : [...r.relatedIncidents, incidentId],
          };
        })
      );

      return updatedOutcomes;
    });

    addToast({
      title: success ? `Runbook verified effective` : `Runbook outcome recorded as failed`,
      description: success
        ? `${rb.title} success saved to Hindsight. Future similar incidents will receive this recommendation.`
        : `${rb.title} failure recorded. Recommendation weight reduced.`,
      type: success ? 'memory' : 'warning',
    });
  };

  const savePostMortem = async (pm: Omit<PostMortem, 'id' | 'createdAt'>) => {
    const id = `pm-${Date.now()}`;
    const newPM: PostMortem = {
      ...pm,
      id,
      createdAt: new Date().toISOString(),
    };
    setPostMortems((prev) => [newPM, ...prev]);

    // Retain to Hindsight
    const inc = incidents.find((i) => i.id === pm.incidentId);
    if (inc) {
      const retainRes = await retainIncidentMemory(inc, pm.rootCause, pm.resolution, {
        runbookUsed: pm.runbookUsed,
        whatWorked: pm.whatWorked,
        whatDidNotWork: pm.whatDidNotWork,
        lessonsLearned: pm.lessonsLearned,
      });

      const pmMemory: HindsightMemory = {
        id: retainRes.memoryId || `mem-pm-${id}`,
        memoryKey: `${inc.service}:postmortem:${Date.now().toString(36)}`,
        title: `Post-Mortem: ${inc.title}`,
        incidentId: inc.id,
        service: inc.service,
        severity: inc.severity,
        rootCause: pm.rootCause,
        resolution: pm.resolution,
        outcome: 'Resolved',
        createdAt: new Date().toISOString(),
        relativeTime: 'Just now',
        category: 'Resolution',
        author: retainRes.source === 'hindsight_api' ? 'Hindsight Memory' : pm.author,
        similarityScore: 100,
        learnedRules: [
          pm.whatWorked ? `✓ Worked: ${pm.whatWorked}` : '',
          pm.whatDidNotWork ? `✗ Did not work: ${pm.whatDidNotWork}` : '',
          pm.lessonsLearned ? `Lesson: ${pm.lessonsLearned}` : '',
          retainRes.source === 'hindsight_api' ? `Indexed in Hindsight Memory Bank` : '',
        ].filter(Boolean),
        runbookId: pm.runbookUsed,
      };
      setMemories((prev) => [pmMemory, ...prev]);
      setTotalMemoryCount((prev) => prev + 1);

      if (retainRes.source === 'hindsight_api') {
        addToast({
          title: 'Post-Mortem Retained in Hindsight',
          description: 'Experience and lessons learned indexed in Hindsight. Future incidents will benefit from this knowledge.',
          type: 'memory',
        });
      } else {
        addToast({
          title: 'Post-Mortem Saved to Memory Index',
          description: 'Lessons learned indexed (Demo fallback). Future incidents on this service will benefit.',
          type: 'memory',
        });
      }
    }
  };

  const createNewIncident = async (data: Partial<Incident>) => {
    const newId = `INC-${Math.floor(1045 + Math.random() * 900)}`;
    const service = data.service || 'payments-api';
    const title = data.title || 'Payment service timeout spike';
    const errorSummary = data.errorSummary || 'HTTP 503 Connection Timeout';

    // Generate realistic logs based on service/error
    const generatedLogs = [
      {
        id: `log-${Date.now()}-1`,
        timestamp: new Date().toLocaleTimeString(),
        level: 'INFO' as const,
        service,
        message: `Request rate normal: tx_count=380 req/s`,
      },
      {
        id: `log-${Date.now()}-2`,
        timestamp: new Date().toLocaleTimeString(),
        level: 'ERROR' as const,
        service,
        message: errorSummary.includes('503') || errorSummary.toLowerCase().includes('pool')
          ? 'Database connection timeout after 3000ms [HikariPool-1 - Connection is not available]'
          : errorSummary.includes('Redis') || errorSummary.toLowerCase().includes('redis')
          ? 'Redis cluster lookup exceeded 450ms — NOAUTH or CLUSTERDOWN'
          : `Service error: ${errorSummary}`,
      },
      {
        id: `log-${Date.now()}-3`,
        timestamp: new Date().toLocaleTimeString(),
        level: 'FATAL' as const,
        service,
        message: errorSummary.includes('503') || errorSummary.toLowerCase().includes('pool')
          ? 'ConnectionPool exhausted: active=100 max=100 waiting=84 threads'
          : `Critical threshold breached: ${errorSummary}`,
      },
    ];

    // --- HINDSIGHT RETRIEVAL (Real API with fallback) ---
    const incidentDraft = { title, service, errorSummary, logs: generatedLogs, severity: data.severity };
    const recallResult = await recallIncidentMemories(incidentDraft, memories);
    const retrievedMemories = recallResult.memories;
    const evidenceSummary = recallResult.evidenceSummary;
    const topMatch = retrievedMemories[0];
    const hasMemory = retrievedMemories.length > 0;

    // Build recommendation based on what Hindsight recalled
    const recommendedPath = hasMemory && topMatch
      ? {
          title: recallResult.source === 'hindsight_api' ? 'Hindsight-Informed Investigation Path' : 'Historical Memory-Informed Path',
          investigationSteps: [
            `Verify current service state for ${service}`,
            `Compare with ${topMatch.incidentId}: "${topMatch.rootCause}"`,
            topMatch.runbookId
              ? `Apply recommended runbook: ${runbooks.find((r) => r.id === topMatch.runbookId)?.title || topMatch.runbookId}`
              : 'Follow resolution steps from historical memory',
          ],
          previousResolution: topMatch.resolution,
          suggestedRunbookId: topMatch.runbookId,
          confidenceScore: topMatch.similarityScore || 90,
        }
      : {
          title: 'General Investigation Path',
          investigationSteps: [
            `Inspect ${service} recent deployment history`,
            'Check service health, resource usage, and upstream dependencies',
            'Review error logs and traces for root cause patterns',
          ],
          previousResolution: 'No historical resolution found. Conduct standard investigation workflow.',
          suggestedRunbookId: undefined,
          confidenceScore: 0,
        };

    const timeline = [
      {
        id: `tl-new-1`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: 'Incident detected',
        description: `Alert: ${errorSummary} on ${service}`,
        type: 'alert' as const,
      },
      {
        id: `tl-new-2`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: hasMemory
          ? `${recallResult.source === 'hindsight_api' ? 'Hindsight Recall' : 'Memory Search'} retrieved ${retrievedMemories.length} matching ${retrievedMemories.length === 1 ? 'case' : 'cases'}`
          : 'Hindsight search: no relevant historical cases found',
        description: evidenceSummary,
        type: 'memory' as const,
      },
    ];

    if (hasMemory) {
      timeline.push({
        id: `tl-new-3`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: `Top match: ${topMatch.incidentId} (${topMatch.similarityScore || 90}% match)`,
        description: `Previous root cause: ${topMatch.rootCause}`,
        type: 'memory' as const,
      });
    }

    const newInc: Incident = {
      id: newId,
      title,
      service,
      severity: data.severity || 'SEV-1',
      status: 'Investigating',
      startedAt: new Date().toISOString(),
      relativeTime: 'Just now',
      assignee: { name: 'Mohan S.', role: 'Staff SRE' },
      environment: 'Production',
      errorSummary,
      affectedPercentage: data.affectedPercentage || '14.2%',
      latencyP99: '3,100ms',
      logs: generatedLogs,
      memoriesRetrieved: retrievedMemories,
      recommendedPath,
      timeline,
    };

    setIncidents((prev) => [newInc, ...prev]);
    setSelectedIncidentId(newId);
    setActiveTab('investigation');

    if (hasMemory) {
      addToast({
        title: `${recallResult.source === 'hindsight_api' ? 'Hindsight' : 'Memory Store'} Retrieved ${retrievedMemories.length} ${retrievedMemories.length === 1 ? 'Case' : 'Cases'} for ${newId}`,
        description: evidenceSummary,
        type: 'memory',
      });
    } else {
      addToast({
        title: `Incident ${newId} Created`,
        description: 'No similar historical incidents found. Starting fresh investigation.',
        type: 'info',
      });
    }
  };

  const resetDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_incidents`);
    localStorage.removeItem(`${STORAGE_KEY}_memories`);
    localStorage.removeItem(`${STORAGE_KEY}_runbooks`);
    localStorage.removeItem(`${STORAGE_KEY}_outcomes`);
    localStorage.removeItem(`${STORAGE_KEY}_postmortems`);
    setIncidents(initialIncidents);
    setMemories(initialMemories);
    setRunbooks(initialRunbooks);
    setRunbookOutcomes([]);
    setPostMortems([]);
    setSelectedIncidentId('INC-1042');
    setActiveTab('investigation');
    setDemoStep(1);
    setTotalMemoryCount(1284);
    addToast({
      title: 'Demo Environment Reset',
      description: 'Fresh test data and memory bank restored.',
      type: 'info',
    });
  };

  return (
    <IncidentStoreContext.Provider
      value={{
        incidents,
        selectedIncident,
        memories,
        runbooks,
        runbookOutcomes,
        postMortems,
        activeTab,
        toasts,
        demoStep,
        environment,
        hindsightStatus,
        setActiveTab,
        selectIncident,
        setEnvironment,
        addToast,
        removeToast,
        updateIncidentStatus,
        resolveIncidentAndSaveMemory,
        executeRunbook,
        saveRunbookOutcome,
        savePostMortem,
        createNewIncident,
        setDemoStep,
        resetDemoData,
        totalMemoryCount,
      }}
    >
      {children}
    </IncidentStoreContext.Provider>
  );
};

export const useIncidentStore = () => {
  const context = useContext(IncidentStoreContext);
  if (!context) {
    throw new Error('useIncidentStore must be used within an IncidentStoreProvider');
  }
  return context;
};
