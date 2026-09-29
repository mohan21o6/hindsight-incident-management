import React from 'react';
import { useIncidentStore } from '../../services/incidentStore';
import {
  Database,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

export const DemoGuideBar: React.FC<{
  onTriggerRunbook: () => void;
  onTriggerResolve: () => void;
  onOpenMemoryDetail: () => void;
}> = ({ onTriggerRunbook, onTriggerResolve, onOpenMemoryDetail }) => {
  const {
    demoStep,
    setDemoStep,
    setActiveTab,
    selectIncident,
    resetDemoData,
    selectedIncident,
  } = useIncidentStore();

  const steps = [
    {
      num: 1,
      name: 'Past Incident in Memory',
      shortDesc: 'INC-0912 (DB Pool Exhaustion)',
      action: () => {
        setDemoStep(1);
        onOpenMemoryDetail();
      },
    },
    {
      num: 2,
      name: 'New Incident Detected',
      shortDesc: 'INC-1042 (Payment 503 Alert)',
      action: () => {
        setDemoStep(2);
        selectIncident('INC-1042');
        setActiveTab('investigation');
      },
    },
    {
      num: 3,
      name: 'Hindsight Retrieval',
      shortDesc: '3 similar matches retrieved',
      action: () => {
        setDemoStep(3);
        selectIncident('INC-1042');
        setActiveTab('investigation');
        onTriggerRunbook();
      },
    },
    {
      num: 4,
      name: 'Resolve & Continuous Learning',
      shortDesc: 'Resolution saved to Hindsight',
      action: () => {
        setDemoStep(4);
        onTriggerResolve();
      },
    },
  ];

  return (
    <div className="bg-white border-b border-[#D8D4C9] px-8 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between gap-6 flex-wrap lg:flex-nowrap">
        {/* Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-7 h-7 rounded-[6px] bg-[#F0F7F6] border border-[#C8DFDD] flex items-center justify-center">
            <Database className="w-4 h-4 text-[#004643]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold text-[#17302E]">
                Hindsight Learning Loop Demo
              </span>
              <span className="text-[10px] uppercase font-semibold bg-[#E6EFEF] text-[#004643] border border-[#B8D4D2] px-2 py-0.2 rounded">
                Interactive Flow
              </span>
            </div>
            <p className="text-[12px] text-[#596563]">
              Experience how Hindsight turns past incident resolutions into immediate remediation recommendations.
            </p>
          </div>
        </div>

        {/* Step Progression Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto py-0.5">
          {steps.map((s) => {
            const isCurrent = demoStep === s.num;
            const isDone = demoStep > s.num || (s.num === 4 && selectedIncident?.status === 'Resolved');

            return (
              <button
                key={s.num}
                onClick={s.action}
                className={`flex items-center gap-2.5 h-9 px-3.5 rounded-[7px] text-[13px] font-medium transition-colors border shrink-0 ${
                  isCurrent
                    ? 'bg-[#004643] border-[#004643] text-[#F0EDE5] shadow-xs'
                    : isDone
                    ? 'bg-[#EBF5F0] border-[#BCE3D1] text-[#2E7D5B]'
                    : 'bg-[#F7F5EF] border-[#D8D4C9] text-[#596563] hover:text-[#17302E] hover:border-[#C7C2B4]'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                    isCurrent
                      ? 'bg-[#F0EDE5] text-[#004643]'
                      : isDone
                      ? 'bg-[#2E7D5B] text-white'
                      : 'bg-[#D8D4C9] text-[#596563]'
                  }`}
                >
                  {isDone ? '✓' : s.num}
                </span>
                <span className={isCurrent ? 'text-white font-semibold' : ''}>{s.name}</span>
                <ChevronRight className={`w-3.5 h-3.5 ${isCurrent ? 'text-[#D8D4C9]' : 'text-[#7B8582]'}`} />
              </button>
            );
          })}
        </div>

        {/* Quick Reset */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={resetDemoData}
            className="flex items-center gap-1.5 h-9 px-3 rounded-[7px] bg-[#F7F5EF] hover:bg-[#EBE7DD] text-[#596563] hover:text-[#17302E] border border-[#D8D4C9] text-[12px] font-medium transition-colors"
            title="Reset to Step 1 initial state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
