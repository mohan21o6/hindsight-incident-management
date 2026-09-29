import React, { useState } from 'react';
import { IncidentStoreProvider, useIncidentStore } from './services/incidentStore';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { DemoGuideBar } from './components/demo/DemoGuideBar';
import { ToastContainer } from './components/common/Toast';
import { IncidentOverview } from './components/pages/IncidentOverview';
import { IncidentInvestigation } from './components/pages/IncidentInvestigation';
import { MemoryView } from './components/pages/MemoryView';
import { RunbooksView } from './components/pages/RunbooksView';
import { AnalyticsView } from './components/pages/AnalyticsView';

import { RunbookExecutionModal } from './components/modals/RunbookExecutionModal';
import { ResolveIncidentModal } from './components/modals/ResolveIncidentModal';
import { MemoryDetailModal } from './components/modals/MemoryDetailModal';
import { NewIncidentModal } from './components/modals/NewIncidentModal';
import { PostMortemModal } from './components/modals/PostMortemModal';
import { HindsightMemory, Runbook } from './types';

const MainLayout: React.FC = () => {
  const { activeTab, selectedIncident, runbooks, memories } = useIncidentStore();

  // Modals state
  const [isRunbookModalOpen, setIsRunbookModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [isPostMortemModalOpen, setIsPostMortemModalOpen] = useState(false);
  const [isNewIncidentModalOpen, setIsNewIncidentModalOpen] = useState(false);
  const [selectedMemoryForModal, setSelectedMemoryForModal] = useState<HindsightMemory | null>(null);
  const [activeRunbookToRun, setActiveRunbookToRun] = useState<Runbook | null>(null);

  const defaultRunbook =
    runbooks.find((r) => r.id === selectedIncident?.recommendedPath?.suggestedRunbookId) ||
    runbooks[0];

  const handleOpenRunbook = (customRunbook?: Runbook) => {
    setActiveRunbookToRun(customRunbook || defaultRunbook);
    setIsRunbookModalOpen(true);
  };

  const handleOpenMemoryModal = (memory?: HindsightMemory) => {
    setSelectedMemoryForModal(memory || memories[0]);
  };

  return (
    <div className="flex h-screen bg-[#F0EDE5] text-[#17302E] overflow-hidden font-sans">
      {/* Sidebar: Solid #004643 Dark Green */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar: Clean White */}
        <TopBar onOpenNewIncidentModal={() => setIsNewIncidentModalOpen(true)} />

        {/* Interactive Hackathon Demo Flow Bar */}
        <DemoGuideBar
          onTriggerRunbook={() => handleOpenRunbook()}
          onTriggerResolve={() => setIsResolveModalOpen(true)}
          onOpenMemoryDetail={() => handleOpenMemoryModal(memories[0])}
        />

        {/* Scrollable Page Body: Warm Cream Paper Background */}
        <main className="flex-1 overflow-y-auto bg-[#F0EDE5]">
          {activeTab === 'overview' && (
            <IncidentOverview onOpenMemoryDetail={handleOpenMemoryModal} />
          )}

          {activeTab === 'investigation' && (
            <IncidentInvestigation
              onOpenRunbookModal={() => handleOpenRunbook()}
              onOpenResolveModal={() => setIsResolveModalOpen(true)}
              onOpenMemoryDetail={handleOpenMemoryModal}
            />
          )}

          {activeTab === 'memory' && (
            <MemoryView onOpenMemoryDetail={handleOpenMemoryModal} />
          )}

          {activeTab === 'runbooks' && (
            <RunbooksView onExecuteRunbook={(rb) => handleOpenRunbook(rb)} />
          )}

          {activeTab === 'analytics' && <AnalyticsView />}
        </main>
      </div>

      {/* Modals */}
      {selectedIncident && activeRunbookToRun && (
        <RunbookExecutionModal
          runbook={activeRunbookToRun}
          incident={selectedIncident}
          isOpen={isRunbookModalOpen}
          onClose={() => setIsRunbookModalOpen(false)}
          onComplete={() => {
            setIsRunbookModalOpen(false);
            setIsResolveModalOpen(true);
          }}
        />
      )}

      {selectedIncident && (
        <ResolveIncidentModal
          incident={selectedIncident}
          isOpen={isResolveModalOpen}
          onClose={() => setIsResolveModalOpen(false)}
          onResolvedSuccess={() => {
            // Prompt post-mortem after resolution
            setTimeout(() => setIsPostMortemModalOpen(true), 600);
          }}
        />
      )}

      <PostMortemModal
        incident={selectedIncident}
        isOpen={isPostMortemModalOpen}
        onClose={() => setIsPostMortemModalOpen(false)}
      />

      <MemoryDetailModal
        memory={selectedMemoryForModal}
        isOpen={selectedMemoryForModal !== null}
        onClose={() => setSelectedMemoryForModal(null)}
      />

      <NewIncidentModal
        isOpen={isNewIncidentModalOpen}
        onClose={() => setIsNewIncidentModalOpen(false)}
      />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <IncidentStoreProvider>
      <MainLayout />
    </IncidentStoreProvider>
  );
}
