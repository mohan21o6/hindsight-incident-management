import React, { useState } from 'react';
import { useIncidentStore } from '../../services/incidentStore';
import { X, AlertCircle, Database } from 'lucide-react';
import { Severity } from '../../types';

interface NewIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewIncidentModal: React.FC<NewIncidentModalProps> = ({ isOpen, onClose }) => {
  const { createNewIncident } = useIncidentStore();

  const [title, setTitle] = useState('Payment API returning HTTP 503');
  const [service, setService] = useState('payments-api');
  const [severity, setSeverity] = useState<Severity>('SEV-1');
  const [errorSummary, setErrorSummary] = useState('HTTP 503 Service Unavailable (HikariPool saturation)');
  const [affectedPercentage] = useState('18.4%');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createNewIncident({
      title,
      service,
      severity,
      errorSummary,
      affectedPercentage,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white border border-[#D8D4C9] rounded-[10px] shadow-dropdown max-w-lg w-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#D8D4C9] flex items-center justify-between bg-[#F7F5EF]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[7px] bg-[#FDF0F0] border border-[#F7C6C6] flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-[#C94C4C]" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#17302E]">Simulate Production Incident</h3>
              <p className="text-[12px] text-[#596563] mt-0.5">Triggers automated Hindsight memory retrieval</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#7B8582] hover:text-[#17302E] p-1.5 rounded-[6px] hover:bg-[#EBE7DD] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-[12px] uppercase tracking-wider text-[#596563] font-bold mb-2">
              Incident Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-10 bg-[#F7F5EF] border border-[#D8D4C9] rounded-[7px] px-3.5 text-[14px] text-[#17302E] focus:outline-none focus:bg-white focus:border-[#004643] transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] uppercase tracking-wider text-[#596563] font-bold mb-2">
                Target Service
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full h-10 bg-[#F7F5EF] border border-[#D8D4C9] rounded-[7px] px-3.5 text-[13px] text-[#17302E] focus:outline-none focus:bg-white focus:border-[#004643] font-mono transition-colors"
              >
                <option value="payments-api">payments-api</option>
                <option value="checkout-service">checkout-service</option>
                <option value="auth-service">auth-service</option>
                <option value="order-router">order-router</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] uppercase tracking-wider text-[#596563] font-bold mb-2">
                Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as Severity)}
                className="w-full h-10 bg-[#F7F5EF] border border-[#D8D4C9] rounded-[7px] px-3.5 text-[13px] text-[#17302E] focus:outline-none focus:bg-white focus:border-[#004643] transition-colors"
              >
                <option value="SEV-1">SEV-1 (Critical)</option>
                <option value="SEV-2">SEV-2 (High)</option>
                <option value="SEV-3">SEV-3 (Medium)</option>
                <option value="SEV-4">SEV-4 (Low)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[12px] uppercase tracking-wider text-[#596563] font-bold mb-2">
              Error / Symptom Signature
            </label>
            <input
              type="text"
              value={errorSummary}
              onChange={(e) => setErrorSummary(e.target.value)}
              className="w-full h-10 bg-[#F7F5EF] border border-[#D8D4C9] rounded-[7px] px-3.5 text-[14px] text-[#17302E] focus:outline-none focus:bg-white focus:border-[#004643] transition-colors"
              required
            />
          </div>

          <div className="p-4 rounded-[8px] bg-[#F0F7F6] border border-[#B8D4D2] text-[12px] text-[#596563] flex items-start gap-3 leading-relaxed">
            <Database className="w-4 h-4 text-[#004643] shrink-0 mt-0.5" />
            <span>
              When created, OpsMind will automatically query Hindsight vector memory across 1,284 historical incidents to retrieve the most similar past root causes and resolutions.
            </span>
          </div>

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
              className="h-10 flex items-center gap-2 px-5 rounded-[7px] bg-[#004643] hover:bg-[#003734] text-[#F0EDE5] text-[14px] font-semibold transition-colors shadow-sm"
            >
              <span>Trigger Incident</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
