import React from 'react';
import { Database } from 'lucide-react';

interface HindsightBadgeProps {
  score?: number;
  label?: string;
  variant?: 'subtle' | 'solid' | 'tag';
}

export const HindsightBadge: React.FC<HindsightBadgeProps> = ({
  score,
  label = 'HINDSIGHT',
  variant = 'subtle',
}) => {
  if (variant === 'solid') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-[#E6EFEF] border border-[#B8D4D2] text-[#004643]">
        <Database className="w-3 h-3 text-[#004643]" />
        <span>{label}</span>
        {score !== undefined && (
          <span className="bg-[#004643] text-[#F0EDE5] px-1 py-0.2 rounded text-[10px] ml-0.5 font-semibold">
            {score}% match
          </span>
        )}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-sans font-medium bg-[#F0F7F6] border border-[#C8DFDD] text-[#004643]">
      <Database className="w-3 h-3 text-[#004643]" />
      <span className="font-semibold text-[10px] font-mono uppercase tracking-wider">{label}</span>
      {score !== undefined && (
        <span className="text-[#596563] text-xs">
          • {score}% match
        </span>
      )}
    </span>
  );
};
