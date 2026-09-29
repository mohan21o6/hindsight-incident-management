import React from 'react';
import { useIncidentStore } from '../../services/incidentStore';
import { SeverityBadge } from '../common/SeverityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { HindsightBadge } from '../common/HindsightBadge';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Database,
  ChevronRight,
} from 'lucide-react';

export const IncidentOverview: React.FC<{ onOpenMemoryDetail: (mem: any) => void }> = ({
  onOpenMemoryDetail,
}) => {
  const { incidents, selectIncident, memories } = useIncidentStore();

  const activeIncidents = incidents.filter((i) => i.status !== 'Resolved');
  const resolvedTodayCount = 14;
  const avgResolutionTime = '18m';
  const memoryMatchRate = '87%';

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight text-[#17302E] leading-tight font-sans">
            Incident Command Center
          </h1>
          <p className="text-[14px] text-[#596563] mt-1.5 leading-normal">
            Monitor, investigate and learn from production incidents.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[13px] font-sans text-[#596563] bg-white border border-[#D8D4C9] px-3.5 py-2 rounded-[7px] shadow-card">
          <span className="w-2 h-2 rounded-full bg-[#2E7D5B]" />
          <span>Hindsight Index: Synchronized (1,284 vectors)</span>
        </div>
      </div>

      {/* Top Compact Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div className="bg-white border border-[#D8D4C9] rounded-[10px] p-6 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-[#596563]">Active Incidents</span>
            <AlertCircle className="w-[18px] h-[18px] text-[#C94C4C]" />
          </div>
          <div className="flex items-baseline gap-2.5 mt-3">
            <span className="text-[28px] font-bold font-sans text-[#17302E] leading-none">
              {activeIncidents.length}
            </span>
            <span className="text-[12px] font-mono text-[#C94C4C]">1 SEV-1 active</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-[#D8D4C9] rounded-[10px] p-6 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-[#596563]">Resolved Today</span>
            <CheckCircle2 className="w-[18px] h-[18px] text-[#2E7D5B]" />
          </div>
          <div className="flex items-baseline gap-2.5 mt-3">
            <span className="text-[28px] font-bold font-sans text-[#17302E] leading-none">
              {resolvedTodayCount}
            </span>
            <span className="text-[12px] font-mono text-[#2E7D5B]">+3 vs yesterday</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-[#D8D4C9] rounded-[10px] p-6 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-[#596563]">Avg Resolution Time</span>
            <Clock className="w-[18px] h-[18px] text-[#3B6EA5]" />
          </div>
          <div className="flex items-baseline gap-2.5 mt-3">
            <span className="text-[28px] font-bold font-sans text-[#17302E] leading-none">
              {avgResolutionTime}
            </span>
            <span className="text-[12px] font-mono text-[#2E7D5B]">
              -72% with Memory
            </span>
          </div>
        </div>

        {/* Metric 4: Hindsight Memory Matches */}
        <div className="bg-[#F0F7F6] border border-[#B8D4D2] rounded-[10px] p-6 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#004643]">
              Memory Matches
            </span>
            <Database className="w-[18px] h-[18px] text-[#004643]" />
          </div>
          <div className="flex items-baseline gap-2.5 mt-3">
            <span className="text-[28px] font-bold font-sans text-[#004643] leading-none">
              {memoryMatchRate}
            </span>
            <span className="text-[12px] text-[#596563]">of new alerts matched</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Incidents Table (Left 70%) + Recent Memory Activity (Right 30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT Table Column (8 cols ~ 67%) */}
        <div className="lg:col-span-8 bg-white border border-[#D8D4C9] rounded-[10px] shadow-card overflow-hidden flex flex-col">
          <div className="p-6 border-b border-[#D8D4C9] flex items-center justify-between bg-[#F7F5EF]">
            <div>
              <h2 className="text-[16px] font-semibold text-[#17302E] flex items-center gap-2.5">
                <span>Production Incidents</span>
                <span className="text-[12px] font-mono text-[#596563] bg-white border border-[#D8D4C9] px-2.5 py-0.5 rounded-[5px]">
                  {incidents.length} total
                </span>
              </h2>
            </div>
            <span className="text-[13px] text-[#596563]">Live queue</span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#F7F5EF] text-[#596563] border-b border-[#D8D4C9] text-[12px] font-semibold">
                <tr>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5">Incident</th>
                  <th className="py-3 px-5">Service</th>
                  <th className="py-3 px-5">Severity</th>
                  <th className="py-3 px-5">Started</th>
                  <th className="py-3 px-5">Assignee</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D4C9]">
                {incidents.map((incident) => {
                  return (
                    <tr
                      key={incident.id}
                      onClick={() => selectIncident(incident.id)}
                      className="hover:bg-[#F7F5EF] cursor-pointer transition-colors group"
                    >
                      <td className="py-4 px-5">
                        <StatusBadge status={incident.status} size="sm" />
                      </td>
                      <td className="py-4 px-5">
                        <div className="font-semibold text-[14px] text-[#17302E] group-hover:text-[#004643] transition-colors leading-snug">
                          <span className="font-mono text-[#596563] font-normal mr-2 text-[13px]">{incident.id}</span>
                          {incident.title}
                        </div>
                        {incident.memoriesRetrieved && incident.memoriesRetrieved.length > 0 && (
                          <div className="mt-1.5 flex items-center gap-2">
                            <HindsightBadge
                              score={incident.memoriesRetrieved[0]?.similarityScore}
                              label={`${incident.memoriesRetrieved.length} Memories Linked`}
                              variant="tag"
                            />
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-5 font-mono text-[#17302E]">
                        <span className="bg-[#F7F5EF] border border-[#D8D4C9] px-2.5 py-1 rounded-[5px] text-[12px]">
                          {incident.service}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <SeverityBadge severity={incident.severity} size="sm" />
                      </td>
                      <td className="py-4 px-5 text-[#596563] text-[13px] whitespace-nowrap">
                        {incident.relativeTime}
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2 text-[#17302E]">
                          <div className="w-6 h-6 rounded-full bg-[#E6EFEF] text-[#004643] text-[11px] font-bold flex items-center justify-center border border-[#B8D4D2]">
                            {incident.assignee.name.charAt(0)}
                          </div>
                          <span className="text-[13px] font-medium">{incident.assignee.name.split(' ')[0]}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button className="text-[#7B8582] group-hover:text-[#004643] transition-colors p-1">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT Column (4 cols ~ 33%) */}
        <div className="lg:col-span-4 bg-white border border-[#D8D4C9] rounded-[10px] p-6 space-y-5 shadow-card">
          <div className="flex items-center justify-between border-b border-[#D8D4C9] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Database className="w-[18px] h-[18px] text-[#004643]" />
                <h3 className="text-[15px] font-bold text-[#17302E]">Recent Memory Activity</h3>
              </div>
              <p className="text-[12px] text-[#596563] mt-0.5">Hindsight Continuous Memory</p>
            </div>
            <span className="text-[11px] font-semibold bg-[#E6EFEF] text-[#004643] border border-[#B8D4D2] px-2.5 py-0.5 rounded">
              3 retrieved
            </span>
          </div>

          {/* Memory Entries List */}
          <div className="space-y-3.5">
            {/* Entry 1 */}
            <div
              onClick={() => onOpenMemoryDetail(memories[0])}
              className="p-4 bg-[#F7F5EF] border border-[#D8D4C9] hover:border-[#004643]/40 rounded-[8px] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[13px] text-[#17302E] group-hover:text-[#004643]">
                  Payment API — 503
                </span>
                <span className="text-[11px] font-mono text-[#7B8582]">2 weeks ago</span>
              </div>
              <p className="text-[12px] text-[#596563] mt-1.5 leading-relaxed line-clamp-2">
                Root cause: Database connection pool exhaustion
              </p>
              <div className="mt-3 flex items-center justify-between text-[12px]">
                <span className="text-[#2E7D5B] font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Successful resolution
                </span>
                <span className="text-[#7B8582] group-hover:text-[#004643] text-[11px] font-medium flex items-center gap-0.5">
                  Inspect <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Entry 2 */}
            <div
              onClick={() => onOpenMemoryDetail(memories[1])}
              className="p-4 bg-[#F7F5EF] border border-[#D8D4C9] hover:border-[#004643]/40 rounded-[8px] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[13px] text-[#17302E] group-hover:text-[#004643]">
                  Database connection pool
                </span>
                <span className="text-[11px] font-mono text-[#7B8582]">1 month ago</span>
              </div>
              <p className="text-[12px] text-[#596563] mt-1.5 leading-relaxed line-clamp-2">
                Root cause: Connection pool saturation during batch job
              </p>
              <div className="mt-3 flex items-center justify-between text-[12px]">
                <span className="text-[#2E7D5B] font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Successful resolution
                </span>
                <span className="text-[#7B8582] group-hover:text-[#004643] text-[11px] font-medium flex items-center gap-0.5">
                  Inspect <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Entry 3 */}
            <div
              onClick={() => onOpenMemoryDetail(memories[2])}
              className="p-4 bg-[#F7F5EF] border border-[#D8D4C9] hover:border-[#004643]/40 rounded-[8px] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[13px] text-[#17302E] group-hover:text-[#004643]">
                  Payment timeout
                </span>
                <span className="text-[11px] font-mono text-[#7B8582]">2 months ago</span>
              </div>
              <p className="text-[12px] text-[#596563] mt-1.5 leading-relaxed line-clamp-2">
                Root cause: Upstream gateway timeout cascade
              </p>
              <div className="mt-3 flex items-center justify-between text-[12px]">
                <span className="text-[#B7791F] font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Partial resolution
                </span>
                <span className="text-[#7B8582] group-hover:text-[#004643] text-[11px] font-medium flex items-center gap-0.5">
                  Inspect <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>

          {/* Value Prop Banner */}
          <div className="p-4 bg-[#F0F7F6] border border-[#C8DFDD] rounded-[8px] text-[12px] text-[#596563] leading-relaxed">
            <div className="flex items-center gap-1.5 text-[#004643] font-bold text-[13px] mb-1">
              <Database className="w-4 h-4" />
              <span>Hindsight Learning Loop</span>
            </div>
            Resolving an incident saves root causes and verified remediations into the memory store so future outages resolve in minutes.
          </div>
        </div>
      </div>
    </div>
  );
};
