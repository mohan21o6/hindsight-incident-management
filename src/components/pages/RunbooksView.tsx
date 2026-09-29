import React, { useState } from 'react';
import { useIncidentStore } from '../../services/incidentStore';
import { Runbook } from '../../types';
import {
  BookOpen,
  Play,
  Search,
  CheckCircle2,
  XCircle,
  Database,
  TrendingUp,
} from 'lucide-react';

export const RunbooksView: React.FC<{
  onExecuteRunbook: (rb: Runbook) => void;
}> = ({ onExecuteRunbook }) => {
  const { runbooks, runbookOutcomes, saveRunbookOutcome, selectedIncident } = useIncidentStore();
  const [search, setSearch] = useState('');
  const [recordingOutcomeFor, setRecordingOutcomeFor] = useState<string | null>(null);

  const filteredRunbooks = runbooks.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.service.toLowerCase().includes(search.toLowerCase())
  );

  const handleRecordOutcome = (rbId: string, success: boolean) => {
    const incidentId = selectedIncident?.id || 'STANDALONE';
    saveRunbookOutcome(rbId, incidentId, success);
    setRecordingOutcomeFor(null);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[7px] bg-[#F0F7F6] border border-[#C8DFDD] flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-[#004643]" />
            </div>
            <div>
              <h1 className="text-[26px] font-bold tracking-tight text-[#17302E] leading-tight font-sans">
                Automated Incident Runbooks
              </h1>
              <p className="text-[14px] text-[#596563] mt-1.5 leading-normal">
                Executable remediation playbooks. Outcome history is stored in Hindsight.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[13px] font-sans text-[#596563] bg-white border border-[#D8D4C9] px-3.5 py-2 rounded-[7px] shadow-card font-medium">
          <span>Active Runbooks: {runbooks.length} verified</span>
        </div>
      </div>

      {/* Outcome History Banner */}
      {runbookOutcomes.length > 0 && (
        <div className="bg-[#F0F7F6] border border-[#B8D4D2] rounded-[10px] p-4 flex items-center gap-4">
          <div className="w-8 h-8 rounded-[7px] bg-[#004643]/10 border border-[#004643]/20 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4 text-[#004643]" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-[#004643]">
              {runbookOutcomes.length} outcome{runbookOutcomes.length !== 1 ? 's' : ''} recorded in Hindsight
            </p>
            <p className="text-[12px] text-[#596563] mt-0.5">
              {runbookOutcomes.filter((o) => o.success).length} successful · {runbookOutcomes.filter((o) => !o.success).length} failed — success rates are updated dynamically.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[12px]">
            {runbookOutcomes.slice(0, 3).map((o, idx) => (
              <div key={idx} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] border ${o.success ? 'bg-[#EBF5F0] border-[#BCE3D1] text-[#2E7D5B]' : 'bg-[#FDF0F0] border-[#F7C6C6] text-[#C94C4C]'}`}>
                {o.success ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                <span className="font-mono font-semibold text-[11px]">{o.incidentId}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white border border-[#D8D4C9] rounded-[10px] p-4 flex items-center gap-3 shadow-card">
        <Search className="w-4 h-4 text-[#7B8582]" />
        <input
          type="text"
          placeholder="Search runbooks by name, command, or affected service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 bg-[#F7F5EF] border border-[#D8D4C9] rounded-[7px] px-3.5 text-[14px] text-[#17302E] placeholder-[#7B8582] focus:outline-none focus:bg-white focus:border-[#004643] transition-colors"
        />
      </div>

      {/* Runbooks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRunbooks.map((rb) => {
          const isHighSuccess = rb.successRate >= 90;
          const rbOutcomes = runbookOutcomes.filter((o) => o.runbookId === rb.id);
          const isRecording = recordingOutcomeFor === rb.id;

          return (
            <div
              key={rb.id}
              className="bg-white border border-[#D8D4C9] hover:border-[#004643]/40 rounded-[10px] p-6 flex flex-col justify-between transition-all space-y-5 shadow-card"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div>
                    <h3 className="text-[16px] font-bold text-[#17302E]">
                      {rb.title}
                    </h3>
                    <span className="text-[12px] text-[#596563] mt-1 inline-block">
                      Service: <code className="text-[#004643] font-mono font-bold">{rb.service}</code>
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <span
                      className={`text-[12px] font-mono font-semibold px-2.5 py-0.5 rounded-[5px] border shrink-0 ${
                        isHighSuccess
                          ? 'bg-[#EBF5F0] text-[#2E7D5B] border-[#BCE3D1]'
                          : 'bg-[#F7F5EF] text-[#596563] border-[#D8D4C9]'
                      }`}
                    >
                      {rb.successRate}% Success
                    </span>
                    {rbOutcomes.length > 0 && (
                      <span className="text-[10px] text-[#596563] font-mono">
                        {rbOutcomes.length} outcomes recorded
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-[13px] text-[#596563] leading-relaxed">{rb.description}</p>

                {/* Steps count & Related Incidents */}
                <div className="mt-4 pt-4 border-t border-[#D8D4C9] space-y-2.5 text-[13px]">
                  <div className="flex items-center justify-between text-[#596563]">
                    <span>Execution steps:</span>
                    <span className="text-[#17302E] font-medium">{rb.steps.length} automated steps</span>
                  </div>

                  <div className="flex items-start justify-between text-[#596563]">
                    <span>Used in incidents:</span>
                    <div className="flex items-center gap-1.5 font-mono flex-wrap justify-end max-w-[55%]">
                      {rb.relatedIncidents.slice(0, 4).map((incId) => (
                        <span
                          key={incId}
                          className="bg-[#F7F5EF] border border-[#D8D4C9] px-2 py-0.5 rounded-[4px] text-[11px] text-[#17302E]"
                        >
                          {incId}
                        </span>
                      ))}
                      {rb.relatedIncidents.length > 4 && (
                        <span className="text-[11px] text-[#7B8582]">+{rb.relatedIncidents.length - 4} more</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Record Outcome UI */}
              {isRecording ? (
                <div className="pt-4 border-t border-[#D8D4C9]">
                  <p className="text-[12px] text-[#596563] mb-3 font-semibold">Was this runbook effective?</p>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => handleRecordOutcome(rb.id, true)}
                      className="flex-1 h-9 flex items-center justify-center gap-2 rounded-[7px] bg-[#EBF5F0] hover:bg-[#D4EDE0] border border-[#BCE3D1] text-[#2E7D5B] text-[13px] font-semibold transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Succeeded</span>
                    </button>
                    <button
                      onClick={() => handleRecordOutcome(rb.id, false)}
                      className="flex-1 h-9 flex items-center justify-center gap-2 rounded-[7px] bg-[#FDF0F0] hover:bg-[#FAE0E0] border border-[#F7C6C6] text-[#C94C4C] text-[13px] font-semibold transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Failed</span>
                    </button>
                    <button
                      onClick={() => setRecordingOutcomeFor(null)}
                      className="h-9 px-3 rounded-[7px] border border-[#D8D4C9] text-[#7B8582] text-[12px] hover:bg-[#F7F5EF] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* Bottom stats & trigger */
                <div className="pt-4 border-t border-[#D8D4C9] flex items-center justify-between">
                  <div className="text-[12px] text-[#7B8582] flex items-center gap-3">
                    <span>Used {rb.usageCount} times</span>
                    <span>•</span>
                    <span>Last used {rb.lastUsed}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRecordingOutcomeFor(rb.id)}
                      className="h-9 flex items-center gap-1.5 px-3 rounded-[7px] border border-[#D8D4C9] text-[#596563] hover:text-[#17302E] hover:bg-[#F7F5EF] text-[12px] font-medium transition-colors"
                      title="Record runbook outcome to Hindsight"
                    >
                      <Database className="w-3.5 h-3.5" />
                      <span>Record Outcome</span>
                    </button>

                    <button
                      onClick={() => onExecuteRunbook(rb)}
                      className="h-9 flex items-center gap-2 px-4 rounded-[7px] bg-[#004643] hover:bg-[#003734] text-[#F0EDE5] text-[13px] font-semibold transition-colors shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Execute</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
