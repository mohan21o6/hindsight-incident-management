import React, { useState } from 'react';
import { Incident } from '../../types';
import { useIncidentStore, PostMortem } from '../../services/incidentStore';
import { X, BookOpen, CheckCircle2, AlertTriangle, Database } from 'lucide-react';

interface PostMortemModalProps {
  incident: Incident | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PostMortemModal: React.FC<PostMortemModalProps> = ({ incident, isOpen, onClose }) => {
  const { savePostMortem, runbooks, runbookOutcomes } = useIncidentStore();

  const [rootCause, setRootCause] = useState('');
  const [resolution, setResolution] = useState('');
  const [whatWorked, setWhatWorked] = useState('');
  const [whatDidNotWork, setWhatDidNotWork] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');
  const [runbookUsed, setRunbookUsed] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (isOpen && incident) {
      setRootCause(
        incident.recommendedPath?.title
          ? `Root cause identified during investigation: ${incident.recommendedPath.title}`
          : `High error rate and latency on ${incident.service}`
      );
      setResolution(
        incident.recommendedPath?.previousResolution ||
          `Applied recommended runbook remediation and verified telemetry recovery.`
      );
      setWhatWorked(
        `Automated memory retrieval identified similar pattern quickly, reducing triage time.`
      );
      setWhatDidNotWork(`Initial alerting threshold was delayed by 2 minutes.`);
      setLessonsLearned(`Add synthetic monitoring probe on ${incident.service} health endpoint.`);
      setRunbookUsed(runbooks[0]?.id || '');
    }
  }, [isOpen, incident, runbooks]);

  if (!isOpen || !incident) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const pm: Omit<PostMortem, 'id' | 'createdAt'> = {
      incidentId: incident.id,
      rootCause,
      resolution,
      whatWorked,
      whatDidNotWork,
      lessonsLearned,
      runbookUsed: runbookUsed || undefined,
      author: 'Mohan S.',
    };

    setTimeout(() => {
      savePostMortem(pm);
      setIsSubmitting(false);
      onClose();
      // Reset
      setRootCause('');
      setResolution('');
      setWhatWorked('');
      setWhatDidNotWork('');
      setLessonsLearned('');
      setRunbookUsed('');
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white border border-[#D8D4C9] rounded-[10px] shadow-dropdown max-w-2xl w-full flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-[#D8D4C9] flex items-center justify-between bg-[#F7F5EF]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[7px] bg-[#F0F7F6] border border-[#C8DFDD] flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-[#004643]" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#17302E]">Post-Incident Review</h3>
              <p className="text-[12px] text-[#596563] mt-0.5">
                {incident.id} — {incident.service} — Saved to Hindsight
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

        {/* Info Banner */}
        <div className="mx-6 mt-5 p-3.5 bg-[#F0F7F6] border border-[#B8D4D2] rounded-[8px] flex items-start gap-3">
          <Database className="w-4 h-4 text-[#004643] shrink-0 mt-0.5" />
          <p className="text-[12px] text-[#596563] leading-relaxed">
            This post-mortem will be converted into a <strong className="text-[#004643]">Hindsight memory vector</strong>. Future engineers investigating similar incidents on{' '}
            <code className="text-[#004643] font-mono font-bold">{incident.service}</code> will immediately see this resolution.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Root Cause */}
          <div>
            <label className="block text-[12px] uppercase tracking-wider text-[#596563] font-bold mb-2">
              Root Cause <span className="text-[#C94C4C]">*</span>
            </label>
            <textarea
              rows={2}
              value={rootCause}
              onChange={(e) => setRootCause(e.target.value)}
              placeholder="e.g. Database connection pool exhaustion under peak checkout traffic"
              className="w-full bg-[#F7F5EF] border border-[#D8D4C9] rounded-[7px] p-3 text-[13px] text-[#17302E] placeholder-[#A2ABA8] focus:outline-none focus:bg-white focus:border-[#004643] leading-relaxed"
              required
            />
          </div>

          {/* Resolution */}
          <div>
            <label className="block text-[12px] uppercase tracking-wider text-[#596563] font-bold mb-2">
              Resolution Applied <span className="text-[#C94C4C]">*</span>
            </label>
            <textarea
              rows={2}
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              placeholder="e.g. Increased HikariCP pool from 50 to 100 and performed rolling restart"
              className="w-full bg-[#F7F5EF] border border-[#D8D4C9] rounded-[7px] p-3 text-[13px] text-[#17302E] placeholder-[#A2ABA8] focus:outline-none focus:bg-white focus:border-[#004643] leading-relaxed font-mono"
              required
            />
          </div>

          {/* What Worked / What Did Not */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] uppercase tracking-wider text-[#2E7D5B] font-bold mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> What Worked
              </label>
              <textarea
                rows={3}
                value={whatWorked}
                onChange={(e) => setWhatWorked(e.target.value)}
                placeholder="e.g. Increasing pool size to 100 restored throughput within 45s"
                className="w-full bg-[#F7F5EF] border border-[#D8D4C9] rounded-[7px] p-3 text-[13px] text-[#17302E] placeholder-[#A2ABA8] focus:outline-none focus:bg-white focus:border-[#2E7D5B] leading-relaxed"
              />
            </div>
            <div>
              <label className="block text-[12px] uppercase tracking-wider text-[#C94C4C] font-bold mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> What Did NOT Work
              </label>
              <textarea
                rows={3}
                value={whatDidNotWork}
                onChange={(e) => setWhatDidNotWork(e.target.value)}
                placeholder="e.g. Pod restart alone did not clear connection saturation"
                className="w-full bg-[#F7F5EF] border border-[#D8D4C9] rounded-[7px] p-3 text-[13px] text-[#17302E] placeholder-[#A2ABA8] focus:outline-none focus:bg-white focus:border-[#C94C4C] leading-relaxed"
              />
            </div>
          </div>

          {/* Lessons Learned */}
          <div>
            <label className="block text-[12px] uppercase tracking-wider text-[#596563] font-bold mb-2">
              Lessons Learned / Action Items
            </label>
            <textarea
              rows={2}
              value={lessonsLearned}
              onChange={(e) => setLessonsLearned(e.target.value)}
              placeholder="e.g. Set pool alerting threshold at 80% utilization to prevent future saturation"
              className="w-full bg-[#F7F5EF] border border-[#D8D4C9] rounded-[7px] p-3 text-[13px] text-[#17302E] placeholder-[#A2ABA8] focus:outline-none focus:bg-white focus:border-[#004643] leading-relaxed"
            />
          </div>

          {/* Runbook Used */}
          <div>
            <label className="block text-[12px] uppercase tracking-wider text-[#596563] font-bold mb-2">
              Runbook Used (optional)
            </label>
            <select
              value={runbookUsed}
              onChange={(e) => setRunbookUsed(e.target.value)}
              className="w-full h-10 bg-[#F7F5EF] border border-[#D8D4C9] rounded-[7px] px-3.5 text-[13px] text-[#17302E] focus:outline-none focus:bg-white focus:border-[#004643] transition-colors"
            >
              <option value="">-- Not applicable --</option>
              {runbooks.map((rb) => (
                <option key={rb.id} value={rb.id}>
                  {rb.title} ({rb.successRate}% success rate)
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-[7px] bg-white hover:bg-[#F7F5EF] border border-[#D8D4C9] text-[#596563] text-[13px] font-semibold transition-colors"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !rootCause || !resolution}
              className="h-10 flex items-center gap-2 px-5 rounded-[7px] bg-[#004643] hover:bg-[#003734] disabled:opacity-50 text-[#F0EDE5] text-[14px] font-semibold transition-colors shadow-sm"
            >
              <Database className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving to Hindsight...' : 'Save Post-Mortem to Hindsight'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
