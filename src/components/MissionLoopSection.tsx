/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, AlertTriangle, ArrowRight, Sun, Zap, CloudOff } from 'lucide-react';

interface MissionLoopSectionProps {
  onSelectSolForDashboard: (sol: 800 | 852 | 2085) => void;
  onPlayDemo: () => void;
}

export const MissionLoopSection: React.FC<MissionLoopSectionProps> = ({
  onSelectSolForDashboard,
  onPlayDemo,
}) => {
  const [activeSol, setActiveSol] = useState<800 | 852 | 2085>(852);

  const scenarios = [
    {
      sol: 800,
      title: 'Sol 800',
      tag: 'Orientation Sol',
      conditions: 'Clear skies',
      flare: 'none',
      pressure: '887 Pa',
      gameplayEffect: 'Learn the core mechanics',
      details:
        'Ideal baseline environmental conditions. Young astronauts learn the Outpost Ares layout, practice navigating between the Base Dome and the Generator, and perform their first science upload before daylight runs out.',
      statusColor: 'text-[#00FF00]',
      badgeBg: 'bg-[#00FF00]/10 border-[#00FF00]/40',
      icon: Sun,
    },
    {
      sol: 852,
      title: 'Sol 852',
      tag: 'Onset Sol',
      conditions: 'Storm + C-class flare',
      flare: 'C-class',
      pressure: '924 Pa',
      gameplayEffect: 'Shield drains 2×',
      details:
        'A sudden regional dust front kicks up regolith particles, while NASA DONKI detects a C-class solar flare. Radiation levels climb; the habitat electromagnetic shield now depletes at double speed (2×), forcing triage between power and survival.',
      statusColor: 'text-[#FFCC00]',
      badgeBg: 'bg-[#FFCC00]/10 border-[#FFCC00]/40',
      icon: AlertTriangle,
    },
    {
      sol: 2085,
      title: 'Sol 2085',
      tag: 'Crisis Sol',
      conditions: 'Severe global storm + X-class flare',
      flare: 'X-class',
      pressure: '772 Pa',
      gameplayEffect: 'Black skies; Shield drains 2×; O₂ drains 1.5×',
      details:
        'A planetary-scale storm envelops Outpost Ares (optical depth tau spikes). Solar generators are rendered useless under blackened skies. Extreme ionizing radiation doubles shield decay (2×), while fine dust accelerates oxygen life-support loss to 1.5×.',
      statusColor: 'text-[#C1440E]',
      badgeBg: 'bg-[#C1440E]/20 border-[#C1440E]/60',
      icon: CloudOff,
    },
  ];

  return (
    <section id="mission-loop" className="py-20 px-6 border-b border-slate-800 bg-[#16191F]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="text-xs uppercase tracking-widest font-['JetBrains_Mono'] text-[#C1440E] mb-2 font-semibold">
            Section 04 · Gameplay Progression
          </div>
          <h2 className="font-['Chakra_Petch'] text-3xl sm:text-4xl font-bold text-white tracking-wide uppercase">
            The Three-Day Mission Loop
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto mt-2">
            Three escalating training scenarios calibrated directly against historical Martian meteorological milestones.
          </p>
        </div>

        {/* Actionable Scenario Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {scenarios.map((sc) => {
            const Icon = sc.icon;
            const isSelected = activeSol === sc.sol;
            return (
              <div
                key={sc.sol}
                onClick={() => setActiveSol(sc.sol as 800 | 852 | 2085)}
                className={`p-6 rounded-lg transition-all cursor-pointer border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#1D222E] border-[#C1440E] shadow-xl ring-1 ring-[#C1440E]'
                    : 'bg-[#181C24] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-['Chakra_Petch'] text-2xl font-bold text-white">
                      {sc.title}
                    </span>
                    <span
                      className={`text-[11px] font-['JetBrains_Mono'] px-2 py-0.5 rounded border uppercase font-medium ${sc.badgeBg} ${sc.statusColor}`}
                    >
                      {sc.tag}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4 font-['JetBrains_Mono'] text-xs">
                    <div className="flex justify-between border-b border-slate-800 pb-1.5 text-slate-400">
                      <span>Conditions:</span>
                      <span className="text-slate-200 font-semibold">{sc.conditions}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-1.5 text-slate-400">
                      <span>Pressure (Pa):</span>
                      <span className="text-slate-200 font-semibold">{sc.pressure}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-1.5 text-slate-400">
                      <span>Solar Flare:</span>
                      <span className={`font-bold ${sc.statusColor}`}>{sc.flare}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-black/40 rounded border border-slate-800/80 mb-4">
                    <div className="text-[11px] uppercase font-['JetBrains_Mono'] text-[#C1440E] font-bold mb-1">
                      Gameplay Effect
                    </div>
                    <div className="text-xs font-semibold text-white font-['JetBrains_Mono']">
                      {sc.gameplayEffect}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    {sc.details}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSolForDashboard(sc.sol as 800 | 852 | 2085);
                    }}
                    className="text-xs font-semibold font-['JetBrains_Mono'] text-[#C1440E] hover:text-[#e05213] flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>View Telemetry</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayDemo();
                    }}
                    className="text-xs text-slate-400 hover:text-white cursor-pointer font-['JetBrains_Mono']"
                  >
                    Simulate Sol →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Specification Table from PDF Page 3 */}
        <div className="bg-[#14171E] border border-slate-800 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 bg-[#1A1F29] flex items-center justify-between">
            <h3 className="font-['Chakra_Petch'] text-sm font-bold text-white uppercase tracking-wider">
              Curated Scenario Specification Matrix
            </h3>
            <span className="text-xs font-['JetBrains_Mono'] text-slate-400">
              NASA Curiosity REMS × DONKI Mappings
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-['JetBrains_Mono']">
              <thead className="bg-black/40 text-slate-400 border-b border-slate-800 uppercase">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">Scenario</th>
                  <th className="px-6 py-3.5 font-semibold">Atmospheric & Solar Conditions</th>
                  <th className="px-6 py-3.5 font-semibold">Gameplay Effect & Resource Multipliers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr className="hover:bg-slate-900/50">
                  <td className="px-6 py-4 font-bold text-white whitespace-nowrap">Sol 800</td>
                  <td className="px-6 py-4 text-slate-300">Clear skies (Pressure 887 Pa, No flare)</td>
                  <td className="px-6 py-4 text-[#00FF00]">Learn the core mechanics (Baseline drain)</td>
                </tr>
                <tr className="hover:bg-slate-900/50">
                  <td className="px-6 py-4 font-bold text-white whitespace-nowrap">Sol 852</td>
                  <td className="px-6 py-4 text-slate-300">Storm + C-class flare (Pressure 924 Pa)</td>
                  <td className="px-6 py-4 text-[#FFCC00]">Shield drains 2×</td>
                </tr>
                <tr className="hover:bg-slate-900/50">
                  <td className="px-6 py-4 font-bold text-white whitespace-nowrap">Sol 2085</td>
                  <td className="px-6 py-4 text-slate-300">Severe global storm + X-class flare (Pressure 772 Pa)</td>
                  <td className="px-6 py-4 text-[#C1440E] font-semibold">Black skies; Shield drains 2×; O₂ drains 1.5×</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
