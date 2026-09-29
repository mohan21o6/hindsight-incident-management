import React, { useState } from 'react';
import { useIncidentStore } from '../../services/incidentStore';
import { HindsightMemory } from '../../types';
import {
  Database,
  Search,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

export const MemoryView: React.FC<{ onOpenMemoryDetail: (mem: HindsightMemory) => void }> = ({
  onOpenMemoryDetail,
}) => {
  const { memories, totalMemoryCount, hindsightStatus } = useIncidentStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('ALL');
  const [selectedOutcome, setSelectedOutcome] = useState('ALL');

  const filteredMemories = memories.filter((mem) => {
    const matchesSearch =
      !searchQuery ||
      mem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.rootCause.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.incidentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.service.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesService = selectedService === 'ALL' || mem.service === selectedService;
    const matchesOutcome = selectedOutcome === 'ALL' || mem.outcome === selectedOutcome;

    return matchesSearch && matchesService && matchesOutcome;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[7px] bg-[#F0F7F6] border border-[#C8DFDD] flex items-center justify-center">
              <Database className="w-4 h-4 text-[#004643]" />
            </div>
            <div>
              <h1 className="text-[26px] font-bold tracking-tight text-[#17302E] leading-tight font-sans">
                Hindsight Memory Catalog
              </h1>
              <p className="text-[14px] text-[#596563] mt-1.5 leading-normal">
                Knowledge learned from previous production incidents and verified resolutions.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[13px] font-sans px-3.5 py-2 rounded-[7px] shadow-card font-medium border bg-[#F0F7F6] border-[#C8DFDD]">
          <span
            className={`w-2 h-2 rounded-full ${
              hindsightStatus?.usingRealHindsight ? 'bg-[#2E7D5B]' : 'bg-[#E5851E]'
            }`}
          />
          <span className="text-[#004643]">
            {hindsightStatus?.usingRealHindsight
              ? `Hindsight Bank: ${hindsightStatus.bankId} (Live)`
              : 'Hindsight: Local Fallback Engine'}
          </span>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white border border-[#D8D4C9] rounded-[10px] p-6 shadow-card">
          <span className="text-[13px] font-medium text-[#596563] block">Total Memories</span>
          <span className="text-[28px] font-bold font-sans text-[#17302E] mt-2 block leading-none">
            {totalMemoryCount.toLocaleString()}
          </span>
          <span className="text-[12px] font-mono text-[#2E7D5B] mt-2 block">
            +18 indexed this week
          </span>
        </div>

        <div className="bg-white border border-[#D8D4C9] rounded-[10px] p-6 shadow-card">
          <span className="text-[13px] font-medium text-[#596563] block">Incident Memories</span>
          <span className="text-[28px] font-bold font-sans text-[#17302E] mt-2 block leading-none">846</span>
          <span className="text-[12px] text-[#596563] mt-2 block">Historical RCA vectors</span>
        </div>

        <div className="bg-white border border-[#D8D4C9] rounded-[10px] p-6 shadow-card">
          <span className="text-[13px] font-medium text-[#596563] block">Runbook Memories</span>
          <span className="text-[28px] font-bold font-sans text-[#17302E] mt-2 block leading-none">312</span>
          <span className="text-[12px] text-[#3B6EA5] mt-2 block">Automated execution graphs</span>
        </div>

        <div className="bg-white border border-[#D8D4C9] rounded-[10px] p-6 shadow-card">
          <span className="text-[13px] font-medium text-[#596563] block">Successful Resolutions</span>
          <span className="text-[28px] font-bold font-sans text-[#2E7D5B] mt-2 block leading-none">126</span>
          <span className="text-[12px] text-[#596563] mt-2 block">Verified playbooks</span>
        </div>
      </div>

      {/* Hindsight Continuous Learning Workflow Illustration */}
      <div className="bg-white border border-[#D8D4C9] rounded-[10px] p-6 shadow-card">
        <div className="flex items-center justify-between mb-4 border-b border-[#D8D4C9] pb-4">
          <span className="text-[14px] uppercase tracking-wider text-[#17302E] font-bold">
            How Hindsight Continuous Memory Operates
          </span>
          <span className="text-[12px] font-semibold text-[#004643] bg-[#E6EFEF] px-2.5 py-0.5 rounded-[5px]">
            Knowledge Architecture
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-[#F7F5EF] border border-[#D8D4C9] rounded-[8px] space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#17302E] text-[13px]">
              <span className="w-5 h-5 rounded-full bg-[#004643] text-white flex items-center justify-center text-[10px]">1</span>
              <span>Incident Ingestion</span>
            </div>
            <p className="text-[12px] text-[#596563] leading-relaxed">
              Alerts & logs extracted in real-time from Prometheus, Datadog, & Kubernetes.
            </p>
          </div>

          <div className="p-4 bg-[#F7F5EF] border border-[#D8D4C9] rounded-[8px] space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#17302E] text-[13px]">
              <span className="w-5 h-5 rounded-full bg-[#004643] text-white flex items-center justify-center text-[10px]">2</span>
              <span>Memory Retrieval</span>
            </div>
            <p className="text-[12px] text-[#596563] leading-relaxed">
              Calculates cosine similarity over 1,284 past incidents in &lt;15ms.
            </p>
          </div>

          <div className="p-4 bg-[#F7F5EF] border border-[#D8D4C9] rounded-[8px] space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#17302E] text-[13px]">
              <span className="w-5 h-5 rounded-full bg-[#004643] text-white flex items-center justify-center text-[10px]">3</span>
              <span>Remediation Path</span>
            </div>
            <p className="text-[12px] text-[#596563] leading-relaxed">
              Maps highest-confidence historical fix into one-click executable runbook.
            </p>
          </div>

          <div className="p-4 bg-[#F0F7F6] border border-[#B8D4D2] rounded-[8px] space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#004643] text-[13px]">
              <span className="w-5 h-5 rounded-full bg-[#2E7D5B] text-white flex items-center justify-center text-[10px]">4</span>
              <span>Knowledge Storage</span>
            </div>
            <p className="text-[12px] text-[#596563] leading-relaxed">
              Resolution stored to Hindsight, strengthening future detection for team.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-[#D8D4C9] rounded-[10px] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-card">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#7B8582] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search incident memory by symptom, root cause, or error signature..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-[#F7F5EF] border border-[#D8D4C9] rounded-[7px] pl-10 pr-3.5 text-[14px] text-[#17302E] placeholder-[#7B8582] focus:outline-none focus:bg-white focus:border-[#004643] transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="h-10 bg-[#F7F5EF] border border-[#D8D4C9] rounded-[7px] px-3.5 text-[13px] text-[#17302E] focus:outline-none focus:bg-white focus:border-[#004643] transition-colors"
          >
            <option value="ALL">All Services</option>
            <option value="payments-api">payments-api</option>
            <option value="checkout-service">checkout-service</option>
            <option value="auth-service">auth-service</option>
          </select>

          <select
            value={selectedOutcome}
            onChange={(e) => setSelectedOutcome(e.target.value)}
            className="h-10 bg-[#F7F5EF] border border-[#D8D4C9] rounded-[7px] px-3.5 text-[13px] text-[#17302E] focus:outline-none focus:bg-white focus:border-[#004643] transition-colors"
          >
            <option value="ALL">All Outcomes</option>
            <option value="Resolved">Resolved</option>
            <option value="Partially Resolved">Partially Resolved</option>
          </select>
        </div>
      </div>

      {/* Memory Catalog Table */}
      <div className="bg-white border border-[#D8D4C9] rounded-[10px] overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#F7F5EF] text-[#596563] border-b border-[#D8D4C9] text-[12px] font-semibold">
              <tr>
                <th className="py-3 px-5">Memory</th>
                <th className="py-3 px-5">Source</th>
                <th className="py-3 px-5">Service</th>
                <th className="py-3 px-5">Outcome</th>
                <th className="py-3 px-5">Created</th>
                <th className="py-3 px-5 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D4C9]">
              {filteredMemories.map((mem) => (
                <tr
                  key={mem.id}
                  onClick={() => onOpenMemoryDetail(mem)}
                  className="hover:bg-[#F7F5EF] cursor-pointer transition-colors group"
                >
                  <td className="py-4 px-5">
                    <div className="font-semibold text-[14px] text-[#17302E] group-hover:text-[#004643] transition-colors">
                      {mem.title}
                    </div>
                    <p className="text-[12px] text-[#596563] line-clamp-1 mt-1">
                      {mem.rootCause}
                    </p>
                  </td>

                  <td className="py-4 px-5 font-mono text-[#17302E]">
                    <span className="bg-[#F7F5EF] border border-[#D8D4C9] px-2.5 py-1 rounded-[5px] text-[12px]">
                      {mem.incidentId}
                    </span>
                  </td>

                  <td className="py-4 px-5 text-[#596563] text-[13px]">
                    {mem.service}
                  </td>

                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1.5 text-[#2E7D5B] font-bold text-[12px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {mem.outcome}
                    </span>
                  </td>

                  <td className="py-4 px-5 text-[#596563] text-[13px]">
                    {mem.relativeTime}
                  </td>

                  <td className="py-4 px-5 text-right">
                    <button className="text-[#7B8582] group-hover:text-[#004643] transition-colors p-1">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
