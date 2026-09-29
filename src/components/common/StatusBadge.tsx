import React from 'react';
import { IncidentStatus } from '../../types';

interface StatusBadgeProps {
  status: IncidentStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  const statusConfig: Record<IncidentStatus, { bg: string; text: string; border: string; dot: string }> = {
    Investigating: {
      bg: 'bg-[#EDF4FB]',
      text: 'text-[#3B6EA5]',
      border: 'border-[#C1DAF2]',
      dot: 'bg-[#3B6EA5]',
    },
    Mitigating: {
      bg: 'bg-[#FDF6E8]',
      text: 'text-[#B7791F]',
      border: 'border-[#F5DEB0]',
      dot: 'bg-[#B7791F]',
    },
    Resolved: {
      bg: 'bg-[#EBF5F0]',
      text: 'text-[#2E7D5B]',
      border: 'border-[#BCE3D1]',
      dot: 'bg-[#2E7D5B]',
    },
    Monitoring: {
      bg: 'bg-[#F7F5EF]',
      text: 'text-[#596563]',
      border: 'border-[#D8D4C9]',
      dot: 'bg-[#596563]',
    },
  };

  const config = statusConfig[status] || statusConfig.Investigating;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded font-medium border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
};
