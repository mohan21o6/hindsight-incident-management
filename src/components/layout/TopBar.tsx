import React, { useState } from 'react';
import { useIncidentStore } from '../../services/incidentStore';
import {
  Search,
  Bell,
  ChevronDown,
  Plus,
  RotateCcw,
  Database,
} from 'lucide-react';

interface TopBarProps {
  onOpenNewIncidentModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenNewIncidentModal }) => {
  const { environment, setEnvironment, totalMemoryCount, resetDemoData, setActiveTab } =
    useIncidentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showEnvDropdown, setShowEnvDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const environments = ['Production', 'Staging (us-east-1)', 'Canary (eu-central-1)'];

  return (
    <header className="h-16 bg-white border-b border-[#D8D4C9] px-8 flex items-center justify-between gap-6 sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Left: Environment Selector & Global Search */}
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        {/* Environment Selector */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowEnvDropdown(!showEnvDropdown)}
            className="h-10 flex items-center gap-2.5 px-3.5 rounded-[7px] bg-[#F7F5EF] border border-[#D8D4C9] text-[13px] font-sans text-[#17302E] hover:border-[#C7C2B4] transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-[#2E7D5B]" />
            <span className="font-semibold text-[#17302E]">{environment}</span>
            <ChevronDown className="w-4 h-4 text-[#596563]" />
          </button>

          {showEnvDropdown && (
            <div className="absolute left-0 mt-1.5 w-56 bg-white border border-[#D8D4C9] rounded-[8px] shadow-dropdown z-50 py-1.5 font-sans text-xs">
              {environments.map((env) => (
                <button
                  key={env}
                  onClick={() => {
                    setEnvironment(env.split(' ')[0]);
                    setShowEnvDropdown(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-[13px] hover:bg-[#F7F5EF] flex items-center justify-between transition-colors ${
                    environment === env.split(' ')[0]
                      ? 'text-[#004643] font-semibold bg-[#F0F7F6]'
                      : 'text-[#596563]'
                  }`}
                >
                  <span>{env}</span>
                  {environment === env.split(' ')[0] && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#004643]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#7B8582] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search incidents, services, errors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-[#F7F5EF] border border-[#D8D4C9] rounded-[7px] pl-10 pr-9 text-[14px] text-[#17302E] placeholder-[#7B8582] focus:outline-none focus:bg-white focus:border-[#004643] transition-colors"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#7B8582] bg-white border border-[#D8D4C9] px-1.5 py-0.5 rounded font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions, Hindsight Status, User */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Hindsight Memory status pill */}
        <button
          onClick={() => setActiveTab('memory')}
          className="hidden md:flex items-center gap-2 h-10 px-3.5 rounded-[7px] bg-[#F0F7F6] border border-[#C8DFDD] text-[#004643] text-[13px] hover:bg-[#E6EFEF] transition-colors font-medium"
          title="Click to view Hindsight Memory Catalog"
        >
          <Database className="w-4 h-4 text-[#004643]" />
          <span className="font-semibold">Hindsight Memory</span>
          <span className="text-[12px] text-[#596563] font-mono">
            ({totalMemoryCount})
          </span>
        </button>

        {/* Trigger Incident simulation button */}
        <button
          onClick={onOpenNewIncidentModal}
          className="h-10 flex items-center gap-1.5 px-4 rounded-[7px] bg-[#004643] hover:bg-[#003734] text-[#F0EDE5] text-[14px] font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Incident</span>
        </button>

        {/* Reset Demo button */}
        <button
          onClick={resetDemoData}
          className="w-10 h-10 rounded-[7px] text-[#596563] hover:text-[#17302E] hover:bg-[#F7F5EF] border border-[#D8D4C9] transition-colors flex items-center justify-center"
          title="Reset Demo to Initial State (INC-1042)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-[7px] text-[#596563] hover:text-[#17302E] hover:bg-[#F7F5EF] border border-[#D8D4C9] transition-colors relative flex items-center justify-center"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-[#C94C4C] absolute top-2.5 right-2.5" />
          </button>
        </div>

        {/* User avatar */}
        <div className="w-9 h-9 rounded-full bg-[#004643] text-[#F0EDE5] flex items-center justify-center text-xs font-bold shadow-sm">
          MS
        </div>
      </div>
    </header>
  );
};
