/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Activity, ArrowRight } from 'lucide-react';

interface NavigationProps {
  activeTab: 'landing' | 'dashboard';
  setActiveTab: (tab: 'landing' | 'dashboard') => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  onNavigateSection,
}) => {
  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    if (activeTab !== 'landing') {
      setActiveTab('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#1A1A1A]/90 border-b border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => setActiveTab('landing')}
          className="text-left group flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C1440E] rounded"
        >
          <span className="font-['Chakra_Petch'] text-xl font-bold tracking-widest text-white group-hover:text-[#C1440E] transition-colors whitespace-nowrap shrink-0">
            AREON
          </span>
          <span className="hidden sm:inline-block text-[11px] font-['JetBrains_Mono'] uppercase tracking-wider text-slate-400 border border-slate-700/80 px-1.5 py-0.5 rounded">
            Mars STEM v1.0
          </span>
        </button>

        {/* Zone 2: 4-5 Clean Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a
            href="#overview"
            onClick={(e) => handleSectionClick(e, 'overview')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Overview
          </a>
          <a
            href="#mechanics"
            onClick={(e) => handleSectionClick(e, 'mechanics')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Mechanics
          </a>
          <a
            href="#mission-loop"
            onClick={(e) => handleSectionClick(e, 'mission-loop')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Mission Loop
          </a>
          <a
            href="#nasa-data"
            onClick={(e) => handleSectionClick(e, 'nasa-data')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            NASA Data
          </a>
          <button
            onClick={() => setActiveTab(activeTab === 'landing' ? 'dashboard' : 'landing')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'dashboard'
                ? 'text-[#C1440E] font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {activeTab === 'dashboard' ? '← Pitch Page' : 'Mission Control'}
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {activeTab === 'landing' ? (
            <button
              onClick={() => setActiveTab('dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#C1440E] hover:bg-[#a9390a] active:bg-[#8f3008] rounded transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white whitespace-nowrap shrink-0 shadow-sm"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Mission Control</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('landing')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-200 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 rounded transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white whitespace-nowrap shrink-0"
            >
              <span>View Pitch Page</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
