import React, { useState, useEffect } from 'react';
import { Runbook, Incident } from '../../types';
import { useIncidentStore } from '../../services/incidentStore';
import {
  X,
  Play,
  CheckCircle2,
  Terminal,
  Loader2,
  ArrowRight,
} from 'lucide-react';

interface RunbookExecutionModalProps {
  runbook: Runbook;
  incident: Incident;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const RunbookExecutionModal: React.FC<RunbookExecutionModalProps> = ({
  runbook,
  incident,
  isOpen,
  onClose,
  onComplete,
}) => {
  const { executeRunbook } = useIncidentStore();
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [stepOutputs, setStepOutputs] = useState<Record<number, string[]>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
      setIsRunning(false);
      setStepOutputs({});
      setIsCompleted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const runAllSteps = async () => {
    setIsRunning(true);

    for (let i = 0; i < runbook.steps.length; i++) {
      setCurrentStepIndex(i);
      const step = runbook.steps[i];

      const logs: string[] = [
        `[${new Date().toLocaleTimeString()}] Executing step ${step.stepNumber}: ${step.title}...`,
        `$ ${step.command || 'system action'}`,
      ];

      if (step.stepNumber === 1) {
        logs.push('[HikariCP-1] active_connections=100, idle_connections=0, total=100 (SATURATED)');
        logs.push('[WARN] 84 worker threads currently queued waiting for connection leases');
      } else if (step.stepNumber === 2) {
        logs.push('Release "payments-api" has been upgraded.');
        logs.push('CONFIG_SET: POOL_MAX_SIZE=100 applied to ConfigMap payments-api-env');
      } else if (step.stepNumber === 3) {
        logs.push('deployment.apps/payments-api restarted');
        logs.push('Pod payments-api-7b8f9c4d-1a2b: Terminating -> Replaced by payments-api-8c9e0d1f-3g4h (Ready 1/1)');
        logs.push('Connection pool successfully re-initialized with 100 max capacity in 11.4s');
      } else if (step.stepNumber === 4) {
        logs.push('Datadog metric check: HTTP 503 error rate dropped from 18.4% -> 0.01%');
        logs.push('p99 latency returned to normal range: 138ms (baseline 140ms)');
        logs.push('STATUS: HEALTHY - ALL CHECKS PASSED');
      }

      setStepOutputs((prev) => ({ ...prev, [i]: logs }));
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    await executeRunbook(runbook.id, incident.id);
    setIsRunning(false);
    setIsCompleted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white border border-[#D8D4C9] rounded-[10px] shadow-dropdown max-w-2xl w-full flex flex-col overflow-hidden max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b border-[#D8D4C9] flex items-center justify-between bg-[#F7F5EF]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[7px] bg-[#F0F7F6] border border-[#C8DFDD] flex items-center justify-center">
              <Terminal className="w-4 h-4 text-[#004643]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-[16px] font-bold text-[#17302E]">{runbook.title}</h3>
                <span className="text-[11px] font-mono bg-white border border-[#D8D4C9] text-[#596563] px-2 py-0.5 rounded-[4px]">
                  {runbook.service}
                </span>
              </div>
              <p className="text-[12px] text-[#596563] mt-0.5">Target incident: {incident.id}</p>
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
          {/* Runbook Info Card */}
          <div className="p-4 bg-[#F7F5EF] border border-[#D8D4C9] rounded-[8px] text-[13px] text-[#17302E] space-y-1.5">
            <p className="text-[#596563] leading-relaxed">{runbook.description}</p>
            <div className="flex items-center gap-4 text-[12px] text-[#596563] pt-1">
              <span>Historical Success Rate: <strong className="text-[#2E7D5B] font-bold">{runbook.successRate}%</strong></span>
              <span>Executions: <strong className="text-[#17302E] font-semibold">{runbook.usageCount} times</strong></span>
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-3.5">
            <h4 className="text-[12px] uppercase tracking-wider text-[#596563] font-bold">
              Execution Plan ({runbook.steps.length} steps)
            </h4>

            {runbook.steps.map((step, idx) => {
              const hasRun = stepOutputs[idx] !== undefined;
              const isCurrent = currentStepIndex === idx && isRunning;

              return (
                <div
                  key={step.stepNumber}
                  className={`p-4 rounded-[8px] border transition-all ${
                    hasRun
                      ? 'bg-[#F0F7F6] border-[#B8D4D2]'
                      : isCurrent
                      ? 'bg-[#EDF4FB] border-[#C1DAF2]'
                      : 'bg-[#F7F5EF] border-[#D8D4C9]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono mt-0.5 font-bold ${
                          hasRun
                            ? 'bg-[#2E7D5B] text-white'
                            : isCurrent
                            ? 'bg-[#004643] text-white'
                            : 'bg-white text-[#596563] border border-[#D8D4C9]'
                        }`}
                      >
                        {hasRun ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.stepNumber}
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-[#17302E]">{step.title}</p>
                        <p className="text-[12px] text-[#596563] mt-1 leading-relaxed">{step.description}</p>
                        {step.command && (
                          <div className="mt-2.5 font-mono text-[12px] bg-white border border-[#D8D4C9] px-3 py-1.5 rounded-[6px] text-[#004643]">
                            $ {step.command}
                          </div>
                        )}
                      </div>
                    </div>
                    {isCurrent && (
                      <Loader2 className="w-4 h-4 text-[#004643] animate-spin shrink-0" />
                    )}
                  </div>

                  {/* Terminal output if step has run */}
                  {stepOutputs[idx] && (
                    <div className="mt-3 pt-2.5 border-t border-[#D8D4C9] font-mono text-[12px] text-[#17302E] space-y-1 bg-white p-3 rounded-[6px] border border-[#D8D4C9]">
                      {stepOutputs[idx].map((line, lidx) => (
                        <div key={lidx} className="leading-tight">
                          {line}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#D8D4C9] bg-[#F7F5EF] flex items-center justify-between">
          <div className="text-[13px] text-[#596563]">
            {isCompleted ? (
              <span className="flex items-center gap-1.5 text-[#2E7D5B] font-bold">
                <CheckCircle2 className="w-4 h-4" /> Runbook execution succeeded
              </span>
            ) : isRunning ? (
              <span className="flex items-center gap-1.5 text-[#004643] font-semibold">
                <Loader2 className="w-4 h-4 animate-spin" /> Executing remediation...
              </span>
            ) : (
              <span>Ready to apply remediation</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="h-10 px-4 rounded-[7px] bg-white hover:bg-[#F7F5EF] border border-[#D8D4C9] text-[#596563] text-[13px] font-semibold transition-colors"
            >
              {isCompleted ? 'Close' : 'Cancel'}
            </button>

            {!isCompleted ? (
              <button
                onClick={runAllSteps}
                disabled={isRunning}
                className="h-10 flex items-center gap-2 px-5 rounded-[7px] bg-[#004643] hover:bg-[#003734] disabled:opacity-50 text-[#F0EDE5] text-[14px] font-semibold transition-colors shadow-sm"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Executing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Execute All Steps</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onComplete();
                }}
                className="h-10 flex items-center gap-2 px-5 rounded-[7px] bg-[#2E7D5B] hover:bg-[#25664a] text-white text-[14px] font-semibold transition-colors shadow-sm"
              >
                <span>Proceed to Mark Resolved</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
