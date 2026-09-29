import React from 'react';
import {
  BarChart3,
  TrendingDown,
  Database,
  CheckCircle2,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[7px] bg-[#F0F7F6] border border-[#C8DFDD] flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-[#004643]" />
            </div>
            <div>
              <h1 className="text-[26px] font-bold tracking-tight text-[#17302E] leading-tight font-sans">
                Operational Reliability Analytics
              </h1>
              <p className="text-[14px] text-[#596563] mt-1.5 leading-normal">
                Mean time to resolution (MTTR) and Hindsight memory impact telemetry.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[13px] font-sans text-[#596563] bg-white border border-[#D8D4C9] px-3.5 py-2 rounded-[7px] shadow-card font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-[#E5851E]"></span>
          <span>Simulated Benchmark Telemetry (30-Day Aggregate)</span>
        </div>
      </div>

      {/* Top Value Impact Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* MTTR Reduction */}
        <div className="bg-white border border-[#D8D4C9] rounded-[10px] p-6 space-y-2.5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-[#596563]">MTTR With Hindsight</span>
            <TrendingDown className="w-[18px] h-[18px] text-[#2E7D5B]" />
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-[32px] font-bold font-sans text-[#004643] leading-none">18 min</span>
            <span className="text-[13px] text-[#7B8582] line-through font-mono">64 min</span>
          </div>
          <p className="text-[13px] text-[#596563] leading-relaxed">
            <strong className="text-[#2E7D5B] font-bold">-72% reduction</strong> in mean time to resolve when similar memory is retrieved.
          </p>
        </div>

        {/* Memory Hit Rate */}
        <div className="bg-white border border-[#D8D4C9] rounded-[10px] p-6 space-y-2.5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-[#596563]">Memory Retrieval Hit Rate</span>
            <Database className="w-[18px] h-[18px] text-[#004643]" />
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-[32px] font-bold font-sans text-[#17302E] leading-none">87.4%</span>
            <span className="text-[12px] font-mono text-[#004643] font-bold">of SEV-1/2 alerts</span>
          </div>
          <p className="text-[13px] text-[#596563] leading-relaxed">
            High-confidence matching (&gt;80% cosine similarity) for repeat infrastructure failures.
          </p>
        </div>

        {/* First-Pass Resolution Rate */}
        <div className="bg-white border border-[#D8D4C9] rounded-[10px] p-6 space-y-2.5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-[#596563]">First-Runbook Success Rate</span>
            <CheckCircle2 className="w-[18px] h-[18px] text-[#2E7D5B]" />
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-[32px] font-bold font-sans text-[#17302E] leading-none">92.1%</span>
            <span className="text-[12px] font-mono text-[#2E7D5B] font-bold">+14% QoQ</span>
          </div>
          <p className="text-[13px] text-[#596563] leading-relaxed">
            Remediations successfully resolve incident without human escalation.
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Incidents by Service */}
        <div className="bg-white border border-[#D8D4C9] rounded-[10px] p-6 space-y-5 shadow-card">
          <div className="flex items-center justify-between border-b border-[#D8D4C9] pb-4">
            <h3 className="text-[14px] uppercase tracking-wider text-[#17302E] font-bold">
              Incidents by Microservice (30d)
            </h3>
            <span className="text-[12px] text-[#596563]">42 total incidents</span>
          </div>

          <div className="space-y-4 text-[13px]">
            <div>
              <div className="flex items-center justify-between mb-1.5 font-medium">
                <span className="text-[#17302E] font-mono font-semibold">payments-api</span>
                <span className="text-[#596563]">18 incidents (42%)</span>
              </div>
              <div className="h-2.5 w-full bg-[#F7F5EF] rounded-full overflow-hidden border border-[#D8D4C9]">
                <div className="h-full bg-[#004643] rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 font-medium">
                <span className="text-[#17302E] font-mono font-semibold">checkout-service</span>
                <span className="text-[#596563]">12 incidents (28%)</span>
              </div>
              <div className="h-2.5 w-full bg-[#F7F5EF] rounded-full overflow-hidden border border-[#D8D4C9]">
                <div className="h-full bg-[#3B6EA5] rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 font-medium">
                <span className="text-[#17302E] font-mono font-semibold">auth-service</span>
                <span className="text-[#596563]">7 incidents (16%)</span>
              </div>
              <div className="h-2.5 w-full bg-[#F7F5EF] rounded-full overflow-hidden border border-[#D8D4C9]">
                <div className="h-full bg-[#2E7D5B] rounded-full" style={{ width: '16%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 font-medium">
                <span className="text-[#17302E] font-mono font-semibold">order-router</span>
                <span className="text-[#596563]">5 incidents (14%)</span>
              </div>
              <div className="h-2.5 w-full bg-[#F7F5EF] rounded-full overflow-hidden border border-[#D8D4C9]">
                <div className="h-full bg-[#B7791F] rounded-full" style={{ width: '14%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Most Common Root Causes */}
        <div className="bg-white border border-[#D8D4C9] rounded-[10px] p-6 space-y-5 shadow-card">
          <div className="flex items-center justify-between border-b border-[#D8D4C9] pb-4">
            <h3 className="text-[14px] uppercase tracking-wider text-[#17302E] font-bold">
              Most Common Root Causes Learned
            </h3>
            <span className="text-[12px] font-bold text-[#004643]">Hindsight Cluster</span>
          </div>

          <div className="space-y-4 text-[13px]">
            <div>
              <div className="flex items-center justify-between mb-1.5 font-medium">
                <span className="text-[#17302E] truncate font-semibold">DB Connection Pool Exhaustion</span>
                <span className="text-[#004643] font-bold shrink-0 font-mono">14 matches</span>
              </div>
              <div className="h-2.5 w-full bg-[#F7F5EF] rounded-full overflow-hidden border border-[#D8D4C9]">
                <div className="h-full bg-[#004643] rounded-full" style={{ width: '65%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 font-medium">
                <span className="text-[#17302E] truncate font-semibold">Redis Client Socket Saturation</span>
                <span className="text-[#3B6EA5] font-bold shrink-0 font-mono">9 matches</span>
              </div>
              <div className="h-2.5 w-full bg-[#F7F5EF] rounded-full overflow-hidden border border-[#D8D4C9]">
                <div className="h-full bg-[#3B6EA5] rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 font-medium">
                <span className="text-[#17302E] truncate font-semibold">Gateway Timeout / Ingress Drop</span>
                <span className="text-[#B7791F] font-bold shrink-0 font-mono">6 matches</span>
              </div>
              <div className="h-2.5 w-full bg-[#F7F5EF] rounded-full overflow-hidden border border-[#D8D4C9]">
                <div className="h-full bg-[#B7791F] rounded-full" style={{ width: '30%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 font-medium">
                <span className="text-[#17302E] truncate font-semibold">JWKS Cache Miss Storm</span>
                <span className="text-[#596563] font-bold shrink-0 font-mono">4 matches</span>
              </div>
              <div className="h-2.5 w-full bg-[#F7F5EF] rounded-full overflow-hidden border border-[#D8D4C9]">
                <div className="h-full bg-[#596563] rounded-full" style={{ width: '20%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resolution Time Over Time (MTTR Trend Comparison) */}
      <div className="bg-white border border-[#D8D4C9] rounded-[10px] p-6 space-y-5 shadow-card">
        <div className="flex items-center justify-between border-b border-[#D8D4C9] pb-4 flex-wrap gap-2">
          <div>
            <h3 className="text-[14px] uppercase tracking-wider text-[#17302E] font-bold">
              Resolution Time Progression (Before vs After Hindsight)
            </h3>
            <p className="text-[13px] text-[#596563] mt-0.5">
              Demonstrates how the system becomes faster and more useful as memory accumulates.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[13px]">
            <span className="flex items-center gap-1.5 text-[#596563]">
              <span className="w-2.5 h-2.5 rounded bg-[#D8D4C9]" /> Without Hindsight (Manual)
            </span>
            <span className="flex items-center gap-1.5 text-[#004643] font-bold">
              <span className="w-2.5 h-2.5 rounded bg-[#004643]" /> With Hindsight Memory
            </span>
          </div>
        </div>

        {/* Visual Benchmark Bars */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 text-[13px]">
          <div className="p-4 bg-[#F7F5EF] border border-[#D8D4C9] rounded-[8px] space-y-1.5">
            <span className="text-[#7B8582] text-[11px] block font-semibold">Month 1 (0 memories)</span>
            <div className="text-[#17302E] font-bold text-[18px]">64m Avg MTTR</div>
            <div className="text-[12px] text-[#596563]">Manual log triage required</div>
          </div>

          <div className="p-4 bg-[#F7F5EF] border border-[#D8D4C9] rounded-[8px] space-y-1.5">
            <span className="text-[#7B8582] text-[11px] block font-semibold">Month 2 (250 memories)</span>
            <div className="text-[#17302E] font-bold text-[18px]">41m Avg MTTR</div>
            <div className="text-[12px] text-[#2E7D5B] font-bold">-36% reduction</div>
          </div>

          <div className="p-4 bg-[#F7F5EF] border border-[#D8D4C9] rounded-[8px] space-y-1.5">
            <span className="text-[#7B8582] text-[11px] block font-semibold">Month 3 (750 memories)</span>
            <div className="text-[#17302E] font-bold text-[18px]">26m Avg MTTR</div>
            <div className="text-[12px] text-[#2E7D5B] font-bold">-59% reduction</div>
          </div>

          <div className="p-4 bg-[#F0F7F6] border border-[#B8D4D2] rounded-[8px] space-y-1.5">
            <span className="text-[#004643] text-[11px] block font-bold">Month 4 (1,284 memories - Today)</span>
            <div className="text-[#004643] font-bold text-[18px]">18m Avg MTTR</div>
            <div className="text-[12px] text-[#2E7D5B] font-bold">-72% overall reduction</div>
          </div>
        </div>
      </div>
    </div>
  );
};
