import React, { useState } from 'react';
import { Incident } from '../../types';
import { useIncidentStore } from '../../services/incidentStore';
import {
  X,
  CheckCircle2,
  Database,
} from 'lucide-react';

interface ResolveIncidentModalProps {
  incident: Incident;
  isOpen: boolean;
  onClose: () => void;
  onResolvedSuccess?: () => void;
}

export const ResolveIncidentModal: React.FC<ResolveIncidentModalProps> = ({
  incident,
  isOpen,
  onClose,
  onResolvedSuccess,
}) => {
  const { resolveIncidentAndSaveMemory } = useIncidentStore();

  const [rootCause, setRootCause] = useState<string>(
    'Database connection pool exhaustion on payments-api under sudden peak checkout traffic spike.'
  );
  const [resolution, setResolution] = useState<string>(
    'Increased HikariCP database connection pool limit from 50 to 100 via Helm values and performed rolling zero-downtime pod restart.'
  );
  const [saveToHindsight, setSaveToHindsight] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      resolveIncidentAndSaveMemory(incident.id, resolution, rootCause);
      setIsSubmitting(false);
      onClose();
      if (onResolvedSuccess) {
        onResolvedSuccess();
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white border border-[#D8D4C9] rounded-[10px] shadow-dropdown max-w-xl w-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#D8D4C9] flex items-center justify-between bg-[#F7F5EF]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[7px] bg-[#EBF5F0] border border-[#BCE3D1] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D5B]" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#17302E]">
                Resolve Incident & Store to Hindsight
              </h3>
              <p className="text-[12px] text-[#596563] mt-0.5">
                {incident.id} — {incident.service}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Root Cause */}
          <div>
            <label className="block text-[12px] uppercase tracking-wider text-[#596563] font-bold mb-2">
              Identified Root Cause
            </label>
            <textarea
              rows={2}
              value={rootCause}
              onChange={(e) => setRootCause(e.target.value)}
              className="w-full bg-[#F7F5EF] border border-[#D8D4C9] rounded-[7px] p-3 text-[13px] text-[#17302E] focus:outline-none focus:bg-white focus:border-[#004643] leading-relaxed"
              required
            />
          </div>

          {/* Resolution Applied */}
          <div>
            <label className="block text-[12px] uppercase tracking-wider text-[#596563] font-bold mb-2">
              Resolution Applied & Verified
            </label>
            <textarea
              rows={3}
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full bg-[#F7F5EF] border border-[#D8D4C9] rounded-[7px] p-3 text-[13px] text-[#17302E] focus:outline-none focus:bg-white focus:border-[#004643] leading-relaxed font-mono"
              required
            />
          </div>

          {/* Hindsight Memory Indexing Callout */}
          <div className="p-4 rounded-[8px] bg-[#F0F7F6] border border-[#B8D4D2] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#004643]" />
                <span className="text-[13px] font-bold text-[#004643]">
                  HINDSIGHT KNOWLEDGE SYNC
                </span>
              </div>
              <label className="flex items-center gap-2 text-[13px] text-[#17302E] cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveToHindsight}
                  onChange={(e) => setSaveToHindsight(e.target.checked)}
                  className="rounded border-[#D8D4C9] text-[#004643] focus:ring-0"
                />
                <span className="text-[12px] font-medium">Index Resolution</span>
              </label>
            </div>
            <p className="text-[12px] text-[#596563] leading-relaxed">
              This will automatically train the Hindsight vector index. Next time a similar 503 or pool saturation occurs on <code className="text-[#004643] font-mono font-bold">{incident.service}</code>, engineers will immediately receive this verified resolution path.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-[7px] bg-white hover:bg-[#F7F5EF] border border-[#D8D4C9] text-[#596563] text-[13px] font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 flex items-center gap-2 px-5 rounded-[7px] bg-[#2E7D5B] hover:bg-[#25664a] text-white text-[14px] font-semibold transition-colors shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Indexing...' : 'Confirm Resolution & Learn'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
