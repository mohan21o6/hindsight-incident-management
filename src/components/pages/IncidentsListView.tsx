import React, { useState } from 'react';
import { useIncidentStore } from '../../services/incidentStore';
import { SeverityBadge } from '../common/SeverityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { HindsightBadge } from '../common/HindsightBadge';
import {
  AlertCircle,
  Search,
  Filter,
  Plus,
  ChevronRight,
  Clock,
  Server,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { Severity, IncidentStatus } from '../../types';

export const IncidentsListView: React.FC<{ onOpenNewIncidentModal: () => void }> = ({
  onOpenNewIncidentModal,
}) => {
  const { incidents, selectIncident } = useIncidentStore();

  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      !search ||
      inc.id.toLowerCase().includes(search.toLowerCase()) ||
      inc.title.toLowerCase().includes(search.toLowerCase()) ||
      inc.service.toLowerCase().includes(search.toLowerCase()) ||
      inc.errorSummary.toLowerCase().includes(search.toLowerCase());

    const matchesSeverity = severityFilter === 'ALL' || inc.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || inc.status === statusFilter;
    const matchesService = serviceFilter === 'ALL' || inc.service === serviceFilter;

    return matchesSearch && matchesSeverity && matchesStatus && matchesService;
  });

  const activeCount = incidents.filter((i) => i.status !== 'Resolved').length;
  const resolvedCount = incidents.filter((i) => i.status === 'Resolved').length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight text-[#17302E] leading-tight font-sans">
            Production Incident Queue
          </h1>
          <p className="text-[14px] text-[#596563] mt-1.5 leading-normal">
            Track, investigate, and remediate service outages across all microservices.
          </p>
        </div>

        <button
          onClick={onOpenNewIncidentModal}
          className="h-10 flex items-center gap-2 px-4 rounded-[7px] bg-[#004643] hover:bg-[#003734] text-[#F0EDE5] text-[14px] font-semibold transition-colors shadow-sm self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Incident</span>
        </button>
      </div>

      {/* Quick Summary Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-[#D8D4C9] rounded-[10px] p-5 shadow-card flex items-center justify-between">
          <div>
            <span className="text-[12px] text-[#596563] font-medium block">Total Incidents</span>
            <span className="text-[24px] font-bold text-[#17302E] font-sans mt-1 block leading-none">
              {incidents.length}
            </span>
          </div>
          <span className="text-[12px] font-mono text-[#596563] bg-[#F7F5EF] border border-[#D8D4C9] px-2.5 py-1 rounded">
            All services
          </span>
        </div>

        <div className="bg-white border border-[#D8D4C9] rounded-[10px] p-5 shadow-card flex items-center justify-between">
          <div>
            <span className="text-[12px] text-[#C94C4C] font-semibold block">Active / In Progress</span>
            <span className="text-[24px] font-bold text-[#C94C4C] font-sans mt-1 block leading-none">
              {activeCount}
            </span>
          </div>
          <span className="text-[12px] font-mono text-[#C94C4C] bg-[#FDF0F0] border border-[#F7C6C6] px-2.5 py-1 rounded">
            Requires Attention
          </span>
        </div>

        <div className="bg-white border border-[#D8D4C9] rounded-[10px] p-5 shadow-card flex items-center justify-between">
          <div>
            <span className="text-[12px] text-[#2E7D5B] font-semibold block">Resolved & Indexed</span>
            <span className="text-[24px] font-bold text-[#2E7D5B] font-sans mt-1 block leading-none">
              {resolvedCount}
            </span>
          </div>
          <span className="text-[12px] font-mono text-[#2E7D5B] bg-[#EBF5F0] border border-[#BCE3D1] px-2.5 py-1 rounded">
            Hindsight Memory Stored
          </span>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white border border-[#D8D4C9] rounded-[10px] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-card">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#7B8582] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by incident ID, title, microservice, or error signature..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 bg-[#F7F5EF] border border-[#D8D4C9] rounded-[7px] pl-10 pr-3.5 text-[14px] text-[#17302E] placeholder-[#7B8582] focus:outline-none focus:bg-white focus:border-[#004643] transition-colors"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          {/* Severity */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="h-10 bg-[#F7F5EF] border border-[#D8D4C9] rounded-[7px] px-3.5 text-[13px] text-[#17302E] focus:outline-none focus:bg-white focus:border-[#004643] transition-colors"
          >
            <option value="ALL">All Severities</option>
            <option value="SEV-1">SEV-1 (Critical)</option>
            <option value="SEV-2">SEV-2 (High)</option>
            <option value="SEV-3">SEV-3 (Medium)</option>
            <option value="SEV-4">SEV-4 (Low)</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 bg-[#F7F5EF] border border-[#D8D4C9] rounded-[7px] px-3.5 text-[13px] text-[#17302E] focus:outline-none focus:bg-white focus:border-[#004643] transition-colors"
          >
            <option value="ALL">All Statuses</option>
            <option value="Investigating">Investigating</option>
            <option value="Mitigating">Mitigating</option>
            <option value="Resolved">Resolved</option>
          </select>

          {/* Service */}
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="h-10 bg-[#F7F5EF] border border-[#D8D4C9] rounded-[7px] px-3.5 text-[13px] text-[#17302E] focus:outline-none focus:bg-white focus:border-[#004643] transition-colors"
          >
            <option value="ALL">All Services</option>
            <option value="payments-api">payments-api</option>
            <option value="checkout-service">checkout-service</option>
            <option value="auth-service">auth-service</option>
            <option value="order-service">order-service</option>
            <option value="notification-service">notification-service</option>
            <option value="api-gateway">api-gateway</option>
          </select>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-white border border-[#D8D4C9] rounded-[10px] overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#F7F5EF] text-[#596563] border-b border-[#D8D4C9] text-[12px] font-semibold">
              <tr>
                <th className="py-3 px-5">Incident</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5">Severity</th>
                <th className="py-3 px-5">Service</th>
                <th className="py-3 px-5">Environment</th>
                <th className="py-3 px-5">Started</th>
                <th className="py-3 px-5">Assignee</th>
                <th className="py-3 px-5 text-right">Investigate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D4C9]">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[14px] text-[#7B8582]">
                    No incidents matched your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((incident) => (
                  <tr
                    key={incident.id}
                    onClick={() => selectIncident(incident.id)}
                    className="hover:bg-[#F7F5EF] cursor-pointer transition-colors group"
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[#596563] text-[13px] font-semibold">
                          {incident.id}
                        </span>
                        <span className="font-semibold text-[14px] text-[#17302E] group-hover:text-[#004643] transition-colors">
                          {incident.title}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#596563] mt-1 line-clamp-1 font-mono">
                        {incident.errorSummary}
                      </p>
                    </td>

                    <td className="py-4 px-5">
                      <StatusBadge status={incident.status} size="sm" />
                    </td>

                    <td className="py-4 px-5">
                      <SeverityBadge severity={incident.severity} size="sm" />
                    </td>

                    <td className="py-4 px-5 font-mono text-[#17302E]">
                      <span className="bg-[#F7F5EF] border border-[#D8D4C9] px-2.5 py-1 rounded-[5px] text-[12px]">
                        {incident.service}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-[13px] text-[#596563]">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D5B]" />
                        {incident.environment}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-[13px] text-[#596563] whitespace-nowrap">
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
                      <button className="h-8 px-3 rounded-[6px] bg-[#F7F5EF] group-hover:bg-[#004643] group-hover:text-[#F0EDE5] border border-[#D8D4C9] text-[#004643] text-[12px] font-semibold transition-colors inline-flex items-center gap-1">
                        <span>Open</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
