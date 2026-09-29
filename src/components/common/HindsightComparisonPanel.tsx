/**
 * HindsightComparisonPanel
 * 
 * Shows side-by-side: "Without Hindsight" vs "With Hindsight" recommendation.
 * This is the most important demo element — directly proves the value of memory.
 */
import React, { useState } from 'react';
import { HindsightMemory } from '../../types';
import { Database, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface HindsightComparisonPanelProps {
  memoryCount: number;
  memories: HindsightMemory[];
  service: string;
  errorSummary: string;
  topRecommendation: string;
  confidenceScore: number;
}

export const HindsightComparisonPanel: React.FC<HindsightComparisonPanelProps> = ({
  memoryCount,
  memories,
  service,
  errorSummary,
  topRecommendation,
  confidenceScore,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasMemory = memoryCount > 0 && memories.length > 0;

  return (
    <div className="bg-white border border-[#D8D4C9] rounded-[10px] overflow-hidden shadow-card">
      {/* Header */}
      <div
        className="px-6 py-4 border-b border-[#D8D4C9] bg-[#F7F5EF] flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[7px] bg-[#004643]/10 border border-[#004643]/20 flex items-center justify-center">
            <Database className="w-4 h-4 text-[#004643]" />
          </div>
          <div>
            <span className="text-[14px] font-bold text-[#17302E]">
              Hindsight Memory Impact
            </span>
            <p className="text-[12px] text-[#596563] mt-0.5">
              How memory changes this investigation
            </p>
          </div>
        </div>
        <button className="text-[#596563] hover:text-[#17302E] bg-white border border-[#D8D4C9] px-2.5 py-1.5 rounded-[6px] flex items-center gap-1.5 text-[12px] font-medium transition-colors">
          {isExpanded ? <><ChevronUp className="w-3.5 h-3.5" /> Collapse</> : <><ChevronDown className="w-3.5 h-3.5" /> Expand</>}
        </button>
      </div>

      {isExpanded && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* WITHOUT HINDSIGHT */}
            <div className="p-5 rounded-[8px] border border-[#D8D4C9] bg-[#FAFAF9]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 rounded-full bg-[#E8E4DC] border border-[#C7C2B4] flex items-center justify-center">
                  <AlertTriangle className="w-3 h-3 text-[#7B8582]" />
                </div>
                <span className="text-[12px] font-bold text-[#7B8582] uppercase tracking-wider">
                  Without Hindsight
                </span>
              </div>

              <div className="space-y-3 text-[13px]">
                <div>
                  <span className="text-[11px] text-[#7B8582] font-semibold uppercase tracking-wider block mb-1">Incident</span>
                  <span className="text-[#17302E] font-medium">{service} — {errorSummary}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#7B8582] font-semibold uppercase tracking-wider block mb-1">Historical Context</span>
                  <span className="text-[#7B8582] italic">None available</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#7B8582] font-semibold uppercase tracking-wider block mb-1">Recommendation</span>
                  <div className="bg-white border border-[#D8D4C9] rounded-[6px] p-3 text-[#596563] italic leading-relaxed">
                    "Investigate {service} and check upstream database and service dependencies."
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-[#7B8582] font-semibold uppercase tracking-wider block mb-1">Confidence</span>
                  <span className="text-[#7B8582] font-mono">Generic — no historical basis</span>
                </div>
              </div>
            </div>

            {/* WITH HINDSIGHT */}
            <div className={`p-5 rounded-[8px] border ${hasMemory ? 'border-[#B8D4D2] bg-[#F0F7F6]' : 'border-[#D8D4C9] bg-[#F7F5EF]'}`}>
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${hasMemory ? 'bg-[#004643] border-[#004643]' : 'bg-[#D8D4C9] border-[#C7C2B4]'}`}>
                  {hasMemory ? (
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  ) : (
                    <Database className="w-3 h-3 text-[#7B8582]" />
                  )}
                </div>
                <span className={`text-[12px] font-bold uppercase tracking-wider ${hasMemory ? 'text-[#004643]' : 'text-[#7B8582]'}`}>
                  With Hindsight
                </span>
                {hasMemory && (
                  <span className="ml-auto text-[10px] font-mono font-bold bg-[#004643] text-[#F0EDE5] px-2 py-0.5 rounded">
                    ACTIVE
                  </span>
                )}
              </div>

              {hasMemory ? (
                <div className="space-y-3 text-[13px]">
                  <div>
                    <span className="text-[11px] text-[#596563] font-semibold uppercase tracking-wider block mb-1">Incident</span>
                    <span className="text-[#17302E] font-medium">{service} — {errorSummary}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#596563] font-semibold uppercase tracking-wider block mb-1">Historical Context</span>
                    <div className="space-y-1.5">
                      {memories.slice(0, 3).map((mem) => (
                        <div key={mem.id} className="flex items-center justify-between bg-white border border-[#D8D4C9] px-2.5 py-1.5 rounded-[6px]">
                          <span className="font-mono text-[#004643] text-[12px] font-bold">{mem.incidentId}</span>
                          <span className="text-[11px] font-mono text-[#17302E] font-semibold">{mem.similarityScore}% match</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#596563] font-semibold uppercase tracking-wider block mb-1">Recommendation</span>
                    <div className="bg-white border border-[#B8D4D2] rounded-[6px] p-3 text-[#17302E] font-medium leading-relaxed">
                      {topRecommendation}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#596563] font-semibold uppercase tracking-wider block mb-1">Confidence</span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-[#D8D4C9] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#004643] rounded-full transition-all"
                          style={{ width: `${confidenceScore}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-[#004643] text-[13px]">{confidenceScore}%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-[13px]">
                  <div>
                    <span className="text-[11px] text-[#7B8582] font-semibold uppercase tracking-wider block mb-1">Incident</span>
                    <span className="text-[#17302E] font-medium">{service} — {errorSummary}</span>
                  </div>
                  <div className="p-4 bg-white border border-[#D8D4C9] rounded-[8px] text-center text-[#7B8582]">
                    <Database className="w-8 h-8 text-[#D8D4C9] mx-auto mb-2" />
                    <p className="text-[12px] font-semibold text-[#7B8582]">No relevant memories found</p>
                    <p className="text-[11px] text-[#A2ABA8] mt-1 leading-relaxed">
                      Resolve this incident to teach Hindsight for future occurrences.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Speedup Callout */}
          {hasMemory && (
            <div className="mt-4 p-3.5 bg-[#EBF5F0] border border-[#BCE3D1] rounded-[8px] flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D5B] shrink-0" />
              <p className="text-[12px] text-[#2E7D5B] leading-relaxed font-medium">
                Hindsight retrieved {memoryCount} relevant {memoryCount === 1 ? 'incident' : 'incidents'} — providing historical root cause and verified resolution immediately, instead of starting investigation from scratch.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
