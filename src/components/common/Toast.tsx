import React from 'react';
import { useIncidentStore } from '../../services/incidentStore';
import { CheckCircle2, AlertTriangle, Info, Database, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useIncidentStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const isMemory = toast.type === 'memory';
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-dropdown backdrop-blur-sm transition-all animate-in slide-in-from-bottom-2 ${
              isMemory
                ? 'bg-white border-[#004643]/30 text-[#17302E] ring-1 ring-[#004643]/10'
                : isSuccess
                ? 'bg-white border-[#BCE3D1] text-[#17302E]'
                : isWarning
                ? 'bg-white border-[#F5DEB0] text-[#17302E]'
                : 'bg-white border-[#D8D4C9] text-[#17302E]'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isMemory && <Database className="w-4 h-4 text-[#004643]" />}
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-[#2E7D5B]" />}
              {isWarning && <AlertTriangle className="w-4 h-4 text-[#B7791F]" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-[#3B6EA5]" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-[#17302E]">{toast.title}</p>
                  {isMemory && (
                    <span className="text-[10px] font-mono uppercase bg-[#E6EFEF] text-[#004643] px-1.5 py-0.2 rounded font-semibold">
                      Hindsight Memory
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-[#7B8582] font-mono">{toast.timestamp}</span>
              </div>
              {toast.description && (
                <p className="text-xs text-[#596563] mt-1 leading-relaxed">{toast.description}</p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#7B8582] hover:text-[#17302E] transition-colors p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
