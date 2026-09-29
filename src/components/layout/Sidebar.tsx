import React from 'react';
import { useIncidentStore } from '../../services/incidentStore';
import {
  LayoutDashboard,
  AlertCircle,
  Database,
  BookOpen,
  BarChart3,
  Sliders,
  Radio,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, totalMemoryCount, incidents, hindsightStatus } = useIncidentStore();

  const activeIncidentCount = incidents.filter((i) => i.status !== 'Resolved').length;

  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'investigation',
      label: 'Incidents',
      icon: AlertCircle,
      badge: activeIncidentCount > 0 ? `${activeIncidentCount} active` : null,
      badgeColor: 'bg-[#C94C4C] text-[#F0EDE5]',
    },
    {
      id: 'memory',
      label: 'Memory',
      icon: Database,
      badge: `${totalMemoryCount}`,
      badgeColor: 'bg-[#085450] text-[#F0EDE5] border border-[#0d6e69]',
      isHindsight: true,
    },
    {
      id: 'runbooks',
      label: 'Runbooks',
      icon: BookOpen,
      badge: '4 active',
      badgeColor: 'bg-[#085450] text-[#D8D4C9]',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-[#004643] text-[#F0EDE5] flex flex-col justify-between shrink-0 select-none h-screen sticky top-0 border-r border-[#003734]">
      {/* Top Header & Logo */}
      <div>
        <div className="p-6 border-b border-[#085450]/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[7px] bg-[#F0EDE5] text-[#004643] flex items-center justify-center font-bold shadow-sm">
              <Layers className="w-4 h-4 text-[#004643]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-base text-[#FFFFFF] font-sans">
                  OPSMIND
                </span>
              </div>
              <p className="text-[12px] text-[#D8D4C9] font-normal leading-tight mt-0.5">
                Self-Learning Incident Response
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-4 py-5">
          <div className="px-3 mb-3 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#A2ABA8] font-semibold font-sans">
              Main Menu
            </span>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full h-10 flex items-center justify-between px-3.5 rounded-[7px] text-[14px] font-medium transition-colors ${
                    isActive
                      ? 'bg-[#085450] text-[#FFFFFF] shadow-sm font-semibold'
                      : 'text-[#D8D4C9] hover:text-[#FFFFFF] hover:bg-[#003c39]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-[18px] h-[18px] transition-colors ${
                        isActive ? 'text-[#FFFFFF]' : 'text-[#A2ABA8]'
                      }`}
                    />
                    <span className="tracking-tight">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded font-medium ${
                        item.badgeColor || 'bg-[#085450] text-[#D8D4C9]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Hindsight Status Box */}
        <div className="mx-4 p-4 rounded-[8px] bg-[#085450]/60 border border-[#0e635e]">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  hindsightStatus?.usingRealHindsight ? 'bg-[#2E7D5B]' : 'bg-[#E5851E]'
                }`}
              />
              <span className="text-[13px] font-semibold text-[#FFFFFF]">
                Hindsight Memory
              </span>
            </div>
            <span
              className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border ${
                hindsightStatus?.usingRealHindsight
                  ? 'text-[#4ade80] bg-[#004643] border-[#2E7D5B]'
                  : 'text-[#fbbf24] bg-[#004643] border-[#E5851E]'
              }`}
            >
              {hindsightStatus?.usingRealHindsight ? 'ONLINE' : 'DEMO FALLBACK'}
            </span>
          </div>
          <p className="text-[12px] text-[#D8D4C9] leading-relaxed">
            {hindsightStatus?.usingRealHindsight
              ? `Connected to Bank: ${hindsightStatus.bankId}`
              : 'Local demo memory engine active (Hindsight API unconfigured).'}
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-[#085450]/80 space-y-2">
        {/* System Status */}
        <div className="flex items-center justify-between px-3.5 py-2 rounded-[7px] text-[13px] text-[#D8D4C9] hover:bg-[#003c39] cursor-pointer">
          <div className="flex items-center gap-2.5">
            <Radio className="w-4 h-4 text-[#2E7D5B]" />
            <span>System Status</span>
          </div>
          <span className="text-[12px] text-[#F0EDE5] font-mono font-medium">100% SLA</span>
        </div>

        {/* Settings */}
        <div className="flex items-center justify-between px-3.5 py-2 rounded-[7px] text-[13px] text-[#D8D4C9] hover:bg-[#003c39] cursor-pointer">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-[#A2ABA8]" />
            <span>Settings</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#A2ABA8]" />
        </div>

        {/* User Profile */}
        <div className="pt-3 border-t border-[#085450]/80 flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#F0EDE5] text-[#004643] flex items-center justify-center text-xs font-bold shadow-sm">
              MS
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-[#FFFFFF] truncate">Mohan S.</p>
              <p className="text-[11px] text-[#D8D4C9] truncate">Staff SRE • On-Call</p>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-[#2E7D5B]" title="Active" />
        </div>
      </div>
    </aside>
  );
};
