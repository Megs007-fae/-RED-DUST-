/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { ProblemSolutionSection } from './components/ProblemSolutionSection.tsx';
import { MechanicsSection } from './components/MechanicsSection.tsx';
import { MissionLoopSection } from './components/MissionLoopSection.tsx';
import { NasaDataSection } from './components/NasaDataSection.tsx';
import { MissionControlDashboard } from './components/MissionControlDashboard.tsx';
import { GameplayModal } from './components/GameplayModal.tsx';
import { TradeOffDemoModal } from './components/TradeOffDemoModal.tsx';
import { Footer } from './components/Footer.tsx';

export default function App() {
  const [activeTab, setActiveTab] = useState<'landing' | 'dashboard'>('landing');
  const [isGameplayModalOpen, setIsGameplayModalOpen] = useState(false);
  const [isTradeOffDemoOpen, setIsTradeOffDemoOpen] = useState(false);
  const [selectedDashboardSol, setSelectedDashboardSol] = useState<number>(852);

  // Sync state with URL hash for easy sharing and direct linking to Page 1 or Page 2
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#dashboard' || hash === '#mission-control' || hash === '#page2') {
        setActiveTab('dashboard');
      } else if (hash === '#pitch' || hash === '#landing' || hash === '#page1' || hash === '') {
        setActiveTab('landing');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSwitchTab = (tab: 'landing' | 'dashboard') => {
    setActiveTab(tab);
    window.location.hash = tab === 'dashboard' ? '#mission-control' : '#';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSolForDashboard = (sol: 800 | 852 | 2085) => {
    setSelectedDashboardSol(sol);
    handleSwitchTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-slate-100 flex flex-col selection:bg-[#C1440E] selection:text-white">
      {/* Universal Top Bar */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={handleSwitchTab}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'landing' ? (
          <div>
            {/* Page 1 — Landing Page: The Pitch */}
            <HeroSection
              onWatchVideo={() => setIsGameplayModalOpen(true)}
              onPlayDemo={() => setIsTradeOffDemoOpen(true)}
              onExploreDashboard={() => handleSwitchTab('dashboard')}
            />

            <ProblemSolutionSection />

            <MechanicsSection
              onPlayDemo={() => setIsTradeOffDemoOpen(true)}
            />

            <MissionLoopSection
              onSelectSolForDashboard={handleSelectSolForDashboard}
              onPlayDemo={() => setIsTradeOffDemoOpen(true)}
            />

            <NasaDataSection
              onOpenDashboard={() => handleSwitchTab('dashboard')}
            />
          </div>
        ) : (
          /* Page 2 — Mission Control Dashboard */
          <MissionControlDashboard
            initialSol={selectedDashboardSol}
            onBackToPitch={() => handleSwitchTab('landing')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onOpenDashboard={() => handleSwitchTab('dashboard')} />

      {/* Modals for Watch Video and Playable Trade-Off Demo */}
      <GameplayModal
        isOpen={isGameplayModalOpen}
        onClose={() => setIsGameplayModalOpen(false)}
        onOpenTradeOffDemo={() => setIsTradeOffDemoOpen(true)}
        onOpenDashboard={() => handleSwitchTab('dashboard')}
      />

      <TradeOffDemoModal
        isOpen={isTradeOffDemoOpen}
        onClose={() => setIsTradeOffDemoOpen(false)}
        onOpenDashboard={() => handleSwitchTab('dashboard')}
      />
    </div>
  );
}
