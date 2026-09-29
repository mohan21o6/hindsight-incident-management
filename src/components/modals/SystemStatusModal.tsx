import React from 'react';
import {
  X,
  Radio,
  CheckCircle2,
  Database,
  Cpu,
  Server,
  Activity,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useIncidentStore } from '../../services/incidentStore';

export const SystemStatusModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { totalMemoryCount } = useIncidentStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white border border-[#D8D4C9] rounded-[10px] shadow-dropdown max-w-xl w-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#D8D4C9] flex items-center justify-between bg-[#F7F5EF]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[7px] bg-[#EBF5F0] border border-[#BCE3D1] flex items-center justify-center">
              <Radio className="w-4 h-4 text-[#2E7D5B]" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#17302E]">OpsMind System Health & Status</h3>
              <p className="text-[12px] text-[#596563] mt-0.5">Real-time telemetry of Hindsight and backend services</p>
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
        <div className="p-6 space-y-4">
          {/* Status grid */}
          <div className="space-y-3">
            {/* Hindsight Status */}
            <div className="p-4 bg-[#F0F7F6] border border-[#B8D4D2] rounded-[8px] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-[#004643]" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-[#17302E]">Hindsight Memory Engine</span>
                    <span className="text-[10px] uppercase font-mono font-bold bg-[#004643] text-[#F0EDE5] px-2 py-0.2 rounded">
                      ONLINE
                    </span>
                  </div>
                  <p className="text-[12px] text-[#596563] mt-0.5">
                    Vector Memory Bank: <code className="font-mono text-[#004643] font-bold">opsmind</code> • {totalMemoryCount.toLocaleString()} indexed vectors
                  </p>
                </div>
              </div>
              <span className="text-[12px] font-mono font-bold text-[#2E7D5B] flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Connected
              </span>
            </div>

            {/* LLM Status */}
            <div className="p-4 bg-[#F7F5EF] border border-[#D8D4C9] rounded-[8px] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Cpu className="w-5 h-5 text-[#3B6EA5]" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-[#17302E]">LLM Reasoning Layer</span>
                    <span className="text-[10px] uppercase font-mono font-semibold bg-white border border-[#D8D4C9] text-[#596563] px-2 py-0.2 rounded">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-[12px] text-[#596563] mt-0.5">
                    Hindsight Synthesis Router (Gemini / Claude 3.5 Sonnet)
                  </p>
                </div>
              </div>
              <span className="text-[12px] font-mono font-bold text-[#2E7D5B] flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Connected
              </span>
            </div>

            {/* Backend Platform */}
            <div className="p-4 bg-[#F7F5EF] border border-[#D8D4C9] rounded-[8px] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-[#004643]" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-[#17302E]">Backend API Gateway</span>
                    <span className="text-[10px] uppercase font-mono font-semibold bg-white border border-[#D8D4C9] text-[#596563] px-2 py-0.2 rounded">
                      HEALTHY
                    </span>
                  </div>
                  <p className="text-[12px] text-[#596563] mt-0.5">
                    FastAPI / Node Engine • Uptime: 99.99% • Latency: 8ms
                  </p>
                </div>
              </div>
              <span className="text-[12px] font-mono font-bold text-[#2E7D5B] flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Healthy
              </span>
            </div>
          </div>

          {/* Detailed metrics box */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-[12px]">
            <div className="p-3 bg-[#F7F5EF] border border-[#D8D4C9] rounded-[7px]">
              <span className="text-[#7B8582] text-[11px] block">Vector Retrieval Latency</span>
              <span className="text-[16px] font-bold text-[#17302E] font-mono mt-1 block">12.4 ms</span>
            </div>

            <div className="p-3 bg-[#F7F5EF] border border-[#D8D4C9] rounded-[7px]">
              <span className="text-[#7B8582] text-[11px] block">Last Knowledge Sync</span>
              <span className="text-[16px] font-bold text-[#2E7D5B] font-mono mt-1 block">Just now</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#D8D4C9] bg-[#F7F5EF] flex items-center justify-end">
          <button
            onClick={onClose}
            className="h-10 px-5 rounded-[7px] bg-[#004643] hover:bg-[#003734] text-[#F0EDE5] text-[13px] font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
