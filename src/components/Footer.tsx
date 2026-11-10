/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowUp, Activity } from 'lucide-react';

interface FooterProps {
  onOpenDashboard?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDashboard }) => {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        window.scrollTo(0, 0);
      }
    }
  };

  const handleOpenDashboard = () => {
    if (onOpenDashboard) {
      onOpenDashboard();
    } else if (typeof window !== 'undefined') {
      window.location.hash = '#mission-control';
    }
  };

  return (
    <footer className="bg-[#12141A] border-t border-slate-800 text-slate-400 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <span className="font-['Chakra_Petch'] text-lg font-bold tracking-wider text-white">
              AREON
            </span>
            <span className="text-xs font-['JetBrains_Mono'] text-[#C1440E] border border-[#C1440E]/40 px-2 py-0.5 rounded">
              Junior Astronaut Mission Trainer
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans max-w-md">
            Survive Mars. Balance the Power. Read the Data. Built by Unmesh, Sudharsan, Dilli, and Meghna during the 48-hour sprint.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-['JetBrains_Mono']">
          <button
            type="button"
            onClick={handleOpenDashboard}
            className="px-3.5 py-2 bg-slate-800 hover:bg-[#C1440E] text-white rounded transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 text-[#00FF00]" />
            <span>Mission Control Telemetry</span>
          </button>

          <button
            type="button"
            onClick={scrollToTop}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded border border-slate-800 cursor-pointer transition-colors"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] font-['JetBrains_Mono'] text-slate-400">
        <div>
          Data Sources: NASA Curiosity REMS (PDS) & NASA DONKI · Curated Training Scenarios
        </div>
        <div className="mt-2 sm:mt-0">
          Tech Stack: React · Chart.js · PapaParse · Three.js · Tailwind CSS
        </div>
      </div>
    </footer>
  );
};

export default Footer;
