import React from 'react';
import { HindsightMemory } from '../../types';
import {
  X,
  Database,
  CheckCircle2,
} from 'lucide-react';
import { SeverityBadge } from '../common/SeverityBadge';

interface MemoryDetailModalProps {
  memory: HindsightMemory | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MemoryDetailModal: React.FC<MemoryDetailModalProps> = ({
  memory,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !memory) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white border border-[#D8D4C9] rounded-[10px] shadow-dropdown max-w-2xl w-full flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-[#D8D4C9] flex items-center justify-between bg-[#F7F5EF]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[7px] bg-[#F0F7F6] border border-[#C8DFDD] flex items-center justify-center">
              <Database className="w-4 h-4 text-[#004643]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-[13px] font-mono font-bold text-[#004643]">
                  {memory.incidentId}
                </span>
                <span className="text-[16px] font-bold text-[#17302E]">{memory.title}</span>
                <SeverityBadge severity={memory.severity} size="sm" />
              </div>
              <p className="text-[12px] text-[#596563] mt-0.5">
                Vector Key: {memory.memoryKey} • {memory.relativeTime}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#7B8582] hover:text-[#17302E] p-1.5 rounded-[6px] hover:bg-[#EBE7DD] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-[#F7F5EF] border border-[#D8D4C9] rounded-[8px]">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#7B8582] font-semibold">Service</span>
              <p className="text-[13px] font-mono font-medium text-[#17302E] mt-1">
                {memory.service}
              </p>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#7B8582] font-semibold">Outcome</span>
              <p className="text-[13px] font-bold text-[#2E7D5B] mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {memory.outcome}
              </p>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#7B8582] font-semibold">Author / Team</span>
              <p className="text-[13px] font-semibold text-[#17302E] mt-1">
                {memory.author || 'SRE On-Call'}
              </p>
            </div>
          </div>

          {/* Root Cause Panel */}
          <div className="p-4 bg-[#F7F5EF] border border-[#D8D4C9] rounded-[8px]">
            <h4 className="text-[12px] uppercase tracking-wider text-[#B7791F] font-bold mb-1.5">
              Historical Root Cause
            </h4>
            <p className="text-[13px] text-[#17302E] leading-relaxed font-medium">{memory.rootCause}</p>
          </div>

          {/* Resolution Applied */}
          <div className="p-4 bg-[#F0F7F6] border border-[#B8D4D2] rounded-[8px]">
            <h4 className="text-[12px] uppercase tracking-wider text-[#004643] font-bold mb-1.5">
              Verified Resolution
            </h4>
            <p className="text-[13px] text-[#17302E] leading-relaxed font-mono bg-white p-3 rounded-[6px] border border-[#D8D4C9]">
              {memory.resolution}
            </p>
          </div>

          {/* Learned Hindsight Rules */}
          {memory.learnedRules && memory.learnedRules.length > 0 && (
            <div>
              <h4 className="text-[12px] uppercase tracking-wider text-[#596563] font-bold mb-2.5">
                Hindsight Inferred Rules & Patterns
              </h4>
              <div className="space-y-2">
                {memory.learnedRules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-[7px] bg-[#F7F5EF] border border-[#D8D4C9] text-[13px] text-[#17302E] leading-relaxed"
                  >
                    <span className="text-[#004643] font-mono font-bold shrink-0">#{idx + 1}</span>
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Telemetry Metric Deltas */}
          {memory.affectedMetrics && memory.affectedMetrics.length > 0 && (
            <div>
              <h4 className="text-[12px] uppercase tracking-wider text-[#596563] font-bold mb-2.5">
                Observed Metric Recovery
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {memory.affectedMetrics.map((met, idx) => (
                  <div key={idx} className="p-3 bg-[#F7F5EF] border border-[#D8D4C9] rounded-[7px]">
                    <span className="text-[11px] text-[#7B8582] font-semibold block truncate">
                      {met.metric}
                    </span>
                    <div className="flex items-center justify-between text-[13px] mt-1.5">
                      <span className="text-[#C94C4C] font-mono font-semibold">{met.before}</span>
                      <span className="text-[#7B8582]">→</span>
                      <span className="text-[#2E7D5B] font-mono font-bold">{met.after}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#D8D4C9] bg-[#F7F5EF] flex items-center justify-between">
          <span className="text-[12px] text-[#7B8582] font-mono">
            UUID: {memory.id}
          </span>
          <button
            onClick={onClose}
            className="h-10 px-4 rounded-[7px] bg-white hover:bg-[#F7F5EF] border border-[#D8D4C9] text-[#596563] text-[13px] font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
