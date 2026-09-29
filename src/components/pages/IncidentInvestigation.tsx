import React, { useState } from 'react';
import { useIncidentStore } from '../../services/incidentStore';
import { SeverityBadge } from '../common/SeverityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { HindsightComparisonPanel } from '../common/HindsightComparisonPanel';
import { HindsightMemory } from '../../types';
import {
  Clock,
  Terminal,
  Database,
  CheckCircle2,
  Play,
  History,
  Server,
  Activity,
  ChevronDown,
  ChevronUp,
  Search,
  ChevronRight,
  GitBranch,
} from 'lucide-react';

interface IncidentInvestigationProps {
  onOpenRunbookModal: () => void;
  onOpenResolveModal: () => void;
  onOpenMemoryDetail: (memory: HindsightMemory) => void;
}

export const IncidentInvestigation: React.FC<IncidentInvestigationProps> = ({
  onOpenRunbookModal,
  onOpenResolveModal,
  onOpenMemoryDetail,
}) => {
  const { selectedIncident } = useIncidentStore();

  const [logFilter, setLogFilter] = useState<'ALL' | 'ERROR' | 'WARN' | 'INFO'>('ALL');
  const [logSearch, setLogSearch] = useState('');
  const [isMemoryExpanded, setIsMemoryExpanded] = useState(true);

  if (!selectedIncident) {
    return (
      <div className="p-12 text-center text-[#7B8582] font-sans text-sm">
        No incident selected. Select an incident from the Overview page.
      </div>
    );
  }

  const incident = selectedIncident;

  const filteredLogs = incident.logs.filter((l) => {
    const matchesFilter =
      logFilter === 'ALL' ||
      (logFilter === 'ERROR' && (l.level === 'ERROR' || l.level === 'FATAL')) ||
      l.level === logFilter;
    const matchesSearch =
      !logSearch ||
      l.message.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.service.toLowerCase().includes(logSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Incident Header - Clean White Panel with Clear Vertical Hierarchy */}
      <div className="bg-white border border-[#D8D4C9] rounded-[10px] p-6 shadow-card">
        {/* Top Meta Line */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center flex-wrap gap-3">
            <span className="font-mono text-[14px] font-bold text-[#17302E]">
              {incident.id}
            </span>
            <SeverityBadge severity={incident.severity} size="md" />
            <StatusBadge status={incident.status} size="md" />
            <span className="text-[13px] font-sans bg-[#F7F5EF] border border-[#D8D4C9] text-[#17302E] px-3 py-0.5 rounded-[6px] flex items-center gap-1.5 font-medium">
              <Server className="w-3.5 h-3.5 text-[#004643]" />
              {incident.service}
            </span>
            <span className="text-[13px] text-[#596563] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Started {incident.relativeTime}
            </span>
          </div>

          {/* Top Quick Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenRunbookModal}
              className="h-10 flex items-center gap-2 px-4 rounded-[7px] bg-[#004643] hover:bg-[#003734] text-[#F0EDE5] text-[14px] font-semibold transition-colors shadow-sm"
            >
              <Play className="w-4 h-4" />
              <span>Apply Runbook</span>
            </button>

            {incident.status !== 'Resolved' ? (
              <button
                onClick={onOpenResolveModal}
                className="h-10 flex items-center gap-2 px-4 rounded-[7px] bg-white hover:bg-[#F7F5EF] border border-[#004643] text-[#004643] text-[14px] font-semibold transition-colors shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Resolved</span>
              </button>
            ) : (
              <span className="h-10 flex items-center gap-2 px-4 rounded-[7px] bg-[#EBF5F0] border border-[#BCE3D1] text-[#2E7D5B] text-[13px] font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                Resolved & Saved to Hindsight
              </span>
            )}
          </div>
        </div>

        {/* Page Title with 12px Top and 24px Bottom Margins */}
        <h1 className="text-[26px] font-bold tracking-tight text-[#17302E] mt-3 mb-6 font-sans leading-tight">
          {incident.title}
        </h1>

        {/* TOP SECTION: Incident Summary Grid with 20px Top Padding */}
        <div className="pt-5 border-t border-[#D8D4C9] grid grid-cols-2 sm:grid-cols-4 gap-6 text-[13px]">
          <div>
            <span className="text-[#7B8582] uppercase text-[11px] block font-semibold tracking-wider">
              Target Service
            </span>
            <span className="text-[#17302E] font-medium text-[14px] mt-1 block font-mono">
              {incident.service}
            </span>
          </div>

          <div>
            <span className="text-[#7B8582] uppercase text-[11px] block font-semibold tracking-wider">
              Error Signature
            </span>
            <span className="text-[#C94C4C] font-semibold text-[14px] mt-1 block truncate">
              {incident.errorSummary}
            </span>
          </div>

          <div>
            <span className="text-[#7B8582] uppercase text-[11px] block font-semibold tracking-wider">
              Environment
            </span>
            <span className="text-[#17302E] font-medium text-[14px] mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2E7D5B]" />
              {incident.environment}
            </span>
          </div>

          <div>
            <span className="text-[#7B8582] uppercase text-[11px] block font-semibold tracking-wider">
              Blast Radius
            </span>
            <span className="text-[#B7791F] font-semibold text-[14px] mt-1 block">
              {incident.affectedPercentage} requests affected
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left 70% (Hindsight + Recommendations + Logs) & Right 30% (Timeline) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (8 cols ~ 68%) */}
        <div className="lg:col-span-8 space-y-6">
          {/* =========================================================================
              HINDSIGHT MEMORY SECTION (Centerpiece for Hackathon Judging)
             ========================================================================= */}
          <div className="bg-white border border-[#D8D4C9] rounded-[10px] p-6 shadow-card">
            {/* Header with 20px bottom padding */}
            <div className="flex items-center justify-between pb-5 border-b border-[#D8D4C9]">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-[8px] bg-[#F0F7F6] border border-[#C8DFDD] flex items-center justify-center">
                  <Database className="w-[18px] h-[18px] text-[#004643]" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-[16px] font-bold text-[#004643]">
                      Relevant Memory
                    </h2>
                    <span className="text-[11px] font-mono uppercase bg-[#E6EFEF] text-[#004643] border border-[#B8D4D2] px-2 py-0.5 rounded font-bold">
                      HINDSIGHT
                    </span>
                  </div>
                  <p className="text-[13px] text-[#596563] mt-0.5">
                    <strong className="text-[#004643]">
                      {incident.memoriesRetrieved.length} similar incidents found
                    </strong>{' '}
                    in historical knowledge bank
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsMemoryExpanded(!isMemoryExpanded)}
                className="text-[#596563] hover:text-[#17302E] text-[13px] flex items-center gap-1.5 bg-[#F7F5EF] border border-[#D8D4C9] px-3 py-1.5 rounded-[6px] transition-colors font-medium"
              >
                <span>{isMemoryExpanded ? 'Collapse' : 'Expand'}</span>
                {isMemoryExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Memory Results Timeline */}
            {isMemoryExpanded && (
              <div className="mt-5 space-y-4">
                {incident.memoriesRetrieved.map((mem) => {
                  const isTopMatch = (mem.similarityScore || 0) >= 90;

                  return (
                    <div
                      key={mem.id}
                      onClick={() => onOpenMemoryDetail(mem)}
                      className={`p-5 rounded-[8px] border transition-all cursor-pointer group ${
                        isTopMatch
                          ? 'bg-[#F0F7F6] border-[#B8D4D2] hover:border-[#004643]/60'
                          : 'bg-[#F7F5EF] border-[#D8D4C9] hover:border-[#C7C2B4]'
                      }`}
                    >
                      {/* Top Header of Memory */}
                      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#D8D4C9]">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono text-[13px] font-bold text-[#17302E] group-hover:text-[#004643] transition-colors">
                            {mem.incidentId}
                          </span>
                          <span className="text-[14px] font-semibold text-[#17302E]">
                            {mem.title}
                          </span>
                          <span className="text-[12px] text-[#7B8582]">
                            • {mem.relativeTime}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[12px] font-mono font-bold px-2.5 py-0.5 rounded-[5px] border ${
                              isTopMatch
                                ? 'bg-[#004643] text-[#F0EDE5] border-[#004643]'
                                : 'bg-white text-[#596563] border-[#D8D4C9]'
                            }`}
                          >
                            OpsMind Relevance: {mem.similarityScore}%
                          </span>
                        </div>
                      </div>

                      {/* Memory Content with Generous Breathing Room */}
                      <div className="mt-4 space-y-3 text-[13px]">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-3 items-baseline">
                          <span className="md:col-span-3 text-[11px] uppercase tracking-wider text-[#7B8582] font-semibold">
                            Root Cause:
                          </span>
                          <span className="md:col-span-9 text-[#17302E] font-medium leading-relaxed">
                            {mem.rootCause}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-3 items-baseline">
                          <span className="md:col-span-3 text-[11px] uppercase tracking-wider text-[#7B8582] font-semibold">
                            Resolution:
                          </span>
                          <span className="md:col-span-9 text-[#17302E] bg-white px-3 py-2 rounded-[6px] border border-[#D8D4C9] font-mono text-[12px] leading-relaxed">
                            {mem.resolution}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-3 items-center pt-1">
                          <span className="md:col-span-3 text-[11px] uppercase tracking-wider text-[#7B8582] font-semibold">
                            Outcome:
                          </span>
                          <div className="md:col-span-9 flex items-center justify-between">
                            <span className="text-[#2E7D5B] font-bold flex items-center gap-1.5 text-[13px]">
                              <CheckCircle2 className="w-4 h-4" />
                              {mem.outcome} successfully
                            </span>
                            <span className="text-[#7B8582] group-hover:text-[#004643] text-[12px] font-medium flex items-center gap-1">
                              Inspect Full Memory Vector <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* =========================================================================
              BEFORE / AFTER HINDSIGHT COMPARISON
             ========================================================================= */}
          <HindsightComparisonPanel
            memoryCount={incident.memoriesRetrieved.length}
            memories={incident.memoriesRetrieved}
            service={incident.service}
            errorSummary={incident.errorSummary}
            topRecommendation={
              incident.memoriesRetrieved[0]
                ? `Current symptoms match ${incident.memoriesRetrieved[0].incidentId} (${incident.memoriesRetrieved[0].similarityScore}% similarity). Previous root cause: ${incident.memoriesRetrieved[0].rootCause}. Verified resolution: ${incident.memoriesRetrieved[0].resolution}`
                : 'No historical resolution found. Conduct standard investigation.'
            }
            confidenceScore={incident.recommendedPath.confidenceScore}
          />

          {/* =========================================================================
              RECOMMENDED INVESTIGATION PATH
             ========================================================================= */}
          <div className="bg-white border border-[#D8D4C9] rounded-[10px] p-6 shadow-card space-y-5">
            <div className="flex items-center justify-between border-b border-[#D8D4C9] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[7px] bg-[#F0F7F6] border border-[#C8DFDD] flex items-center justify-center">
                  <GitBranch className="w-4 h-4 text-[#004643]" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#17302E]">
                    {incident.recommendedPath.title}
                  </h3>
                  <p className="text-[13px] text-[#596563] mt-0.5">
                    Based on previous incidents, investigate the database connection pool and timeout configuration.
                  </p>
                </div>
              </div>
              <span className="text-[12px] font-mono text-[#004643] bg-[#E6EFEF] border border-[#B8D4D2] px-2.5 py-1 rounded-[6px] font-semibold">
                {incident.recommendedPath.confidenceScore}% Confidence
              </span>
            </div>

            {/* Checklist */}
            <div className="p-4 bg-[#F7F5EF] border border-[#D8D4C9] rounded-[8px] space-y-2.5">
              <p className="text-[12px] uppercase tracking-wider text-[#596563] font-bold">
                Recommended Investigation Checklist:
              </p>
              <ol className="space-y-2 text-[13px] text-[#17302E]">
                {incident.recommendedPath.investigationSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="font-mono text-[#004643] font-bold">{idx + 1}.</span>
                    <span className="font-medium">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Previous Successful Resolution Callout */}
            <div className="p-4 bg-[#F0F7F6] border border-[#B8D4D2] rounded-[8px]">
              <div className="flex items-center gap-2 text-[#004643] text-[13px] font-bold mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D5B]" />
                <span>Previous successful resolution:</span>
              </div>
              <p className="text-[13px] text-[#17302E] pl-6 font-mono leading-relaxed">
                {incident.recommendedPath.previousResolution}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={onOpenRunbookModal}
                  className="h-10 flex items-center gap-2 px-4 rounded-[7px] bg-[#004643] hover:bg-[#003734] text-[#F0EDE5] text-[14px] font-semibold transition-colors shadow-sm"
                >
                  <Play className="w-4 h-4" />
                  <span>Apply Runbook</span>
                </button>

                <button
                  onClick={() => onOpenMemoryDetail(incident.memoriesRetrieved[0])}
                  className="h-10 flex items-center gap-2 px-4 rounded-[7px] bg-white hover:bg-[#F7F5EF] border border-[#D8D4C9] text-[#004643] text-[14px] font-semibold transition-colors shadow-sm"
                >
                  <History className="w-4 h-4" />
                  <span>View Incident History</span>
                </button>
              </div>

              {incident.status !== 'Resolved' && (
                <button
                  onClick={onOpenResolveModal}
                  className="h-10 flex items-center gap-2 px-4 rounded-[7px] bg-[#2E7D5B] hover:bg-[#25664a] text-white text-[14px] font-semibold transition-colors shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Resolved</span>
                </button>
              )}
            </div>
          </div>

          {/* =========================================================================
              ERROR LOG PANEL
             ========================================================================= */}
          <div className="bg-white border border-[#D8D4C9] rounded-[10px] overflow-hidden flex flex-col shadow-card">
            {/* Header with log filters */}
            <div className="p-4 bg-[#F7F5EF] border-b border-[#D8D4C9] flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-[#596563]" />
                <span className="text-[14px] font-semibold text-[#17302E]">
                  Telemetry & Error Logs
                </span>
                <span className="text-[11px] font-mono text-[#596563] bg-white px-2 py-0.5 rounded border border-[#D8D4C9]">
                  {filteredLogs.length} events
                </span>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2.5">
                <div className="flex items-center bg-white border border-[#D8D4C9] rounded-[6px] p-0.5 text-[12px] font-sans">
                  {(['ALL', 'ERROR', 'WARN', 'INFO'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setLogFilter(lvl)}
                      className={`px-2.5 py-1 rounded-[4px] transition-colors ${
                        logFilter === lvl
                          ? 'bg-[#004643] text-[#F0EDE5] font-semibold'
                          : 'text-[#596563] hover:text-[#17302E]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#7B8582] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filter logs..."
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    className="h-8 bg-white border border-[#D8D4C9] rounded-[6px] pl-7 pr-2.5 text-[12px] text-[#17302E] placeholder-[#7B8582] font-sans w-32 focus:w-44 transition-all focus:outline-none focus:border-[#004643]"
                  />
                </div>
              </div>
            </div>

            {/* Log Stream */}
            <div className="p-4 bg-[#17302E] font-mono text-[12px] leading-relaxed space-y-2 overflow-x-auto max-h-72 overflow-y-auto">
              {filteredLogs.map((log) => {
                const isError = log.level === 'ERROR' || log.level === 'FATAL';
                const isWarn = log.level === 'WARN';

                return (
                  <div
                    key={log.id}
                    className={`flex items-start gap-2.5 py-0.5 px-2 rounded transition-colors ${
                      isError
                        ? 'text-[#F7C6C6]'
                        : isWarn
                        ? 'text-[#F5DEB0]'
                        : 'text-[#D8D4C9]'
                    }`}
                  >
                    <span className="text-[#7B8582] shrink-0 select-none">
                      {log.timestamp}
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[11px] font-bold shrink-0 ${
                        isError
                          ? 'bg-[#C94C4C] text-white'
                          : isWarn
                          ? 'bg-[#B7791F] text-white'
                          : 'bg-[#085450] text-[#D8D4C9]'
                      }`}
                    >
                      {log.level}
                    </span>
                    <span className="text-[#A2ABA8] shrink-0 font-medium">
                      [{log.service}]
                    </span>
                    <span className="text-[#F0EDE5]">{log.message}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Investigation Timeline (4 cols ~ 32%) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Timeline Card */}
          <div className="bg-white border border-[#D8D4C9] rounded-[10px] p-6 space-y-5 shadow-card">
            <div className="flex items-center justify-between border-b border-[#D8D4C9] pb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-[18px] h-[18px] text-[#004643]" />
                <h3 className="text-[14px] uppercase tracking-wider text-[#17302E] font-bold">
                  Investigation Timeline
                </h3>
              </div>
              <span className="text-[12px] text-[#7B8582]">Live activity</span>
            </div>

            {/* Vertical Activity Line with 24px Event Spacing */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#D8D4C9]">
              {incident.timeline.map((event) => {
                const isMemoryEvent = event.type === 'memory';
                const isResolution = event.type === 'resolution';
                const isAlert = event.type === 'alert';

                return (
                  <div key={event.id} className="relative pb-1">
                    {/* Status dot */}
                    <div
                      className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full border-2 bg-white ${
                        isMemoryEvent
                          ? 'border-[#004643] bg-[#004643]'
                          : isResolution
                          ? 'border-[#2E7D5B] bg-[#2E7D5B]'
                          : isAlert
                          ? 'border-[#C94C4C] bg-[#C94C4C]'
                          : 'border-[#3B6EA5] bg-[#3B6EA5]'
                      }`}
                    />

                    <div>
                      <div className="flex items-center justify-between text-[13px]">
                        <span
                          className={`font-semibold ${
                            isMemoryEvent
                              ? 'text-[#004643]'
                              : isResolution
                              ? 'text-[#2E7D5B]'
                              : 'text-[#17302E]'
                          }`}
                        >
                          {event.time} — {event.title}
                        </span>
                      </div>
                      {event.description && (
                        <p className="text-[13px] text-[#596563] mt-1.5 leading-relaxed">
                          {event.description}
                        </p>
                      )}
                      {event.author && (
                        <span className="text-[11px] text-[#7B8582] mt-1 block">
                          by {event.author}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Service Telemetry & Health Box */}
          <div className="bg-white border border-[#D8D4C9] rounded-[10px] p-6 space-y-4 shadow-card">
            <h4 className="text-[13px] uppercase tracking-wider text-[#17302E] font-bold">
              Live Service Telemetry
            </h4>

            <div className="space-y-2.5 text-[13px]">
              <div className="flex items-center justify-between p-3 bg-[#F7F5EF] rounded-[7px] border border-[#D8D4C9]">
                <span className="text-[#596563]">p99 Latency:</span>
                <span className="text-[#C94C4C] font-mono font-bold">{incident.latencyP99}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#F7F5EF] rounded-[7px] border border-[#D8D4C9]">
                <span className="text-[#596563]">Error Rate:</span>
                <span className="text-[#C94C4C] font-mono font-bold">{incident.affectedPercentage}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#F7F5EF] rounded-[7px] border border-[#D8D4C9]">
                <span className="text-[#596563]">DB Pool Usage:</span>
                <span className="text-[#B7791F] font-mono font-bold">100 / 100 (Maxed)</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#F0F7F6] rounded-[7px] border border-[#B8D4D2]">
                <span className="text-[#004643] font-semibold">Hindsight Match:</span>
                <span className="text-[#004643] font-mono font-bold">INC-0912 (94%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
