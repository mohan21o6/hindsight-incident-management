import React from 'react';
import { Severity } from '../../types';

interface SeverityBadgeProps {
  severity: Severity;
  size?: 'sm' | 'md' | 'lg';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-[11px] px-1.5 py-0.5 font-medium',
    md: 'text-xs px-2 py-0.5 font-semibold',
    lg: 'text-xs px-2.5 py-1 font-semibold',
  };

  const colors: Record<Severity, { bg: string; text: string; border: string; dot: string }> = {
    'SEV-1': {
      bg: 'bg-[#FDF0F0]',
      text: 'text-[#C94C4C]',
      border: 'border-[#F7C6C6]',
      dot: 'bg-[#C94C4C]',
    },
    'SEV-2': {
      bg: 'bg-[#FDF6E8]',
      text: 'text-[#B7791F]',
      border: 'border-[#F5DEB0]',
      dot: 'bg-[#B7791F]',
    },
    'SEV-3': {
      bg: 'bg-[#FAF5EB]',
      text: 'text-[#8C6D1F]',
      border: 'border-[#E8DEC7]',
      dot: 'bg-[#8C6D1F]',
    },
    'SEV-4': {
      bg: 'bg-[#EDF4FB]',
      text: 'text-[#3B6EA5]',
      border: 'border-[#C1DAF2]',
      dot: 'bg-[#3B6EA5]',
    },
  };

  const color = colors[severity] || colors['SEV-3'];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border font-mono tracking-tight ${color.bg} ${color.text} ${color.border} ${sizeClasses[size]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
      {severity}
    </span>
  );
};
