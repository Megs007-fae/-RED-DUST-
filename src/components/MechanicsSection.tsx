/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Zap, Wind, ArrowRightLeft, Map, CloudLightning, Sun } from 'lucide-react';

interface MechanicsSectionProps {
  onPlayDemo: () => void;
}

export const MechanicsSection: React.FC<MechanicsSectionProps> = ({ onPlayDemo }) => {
  return (
    <section id="mechanics" className="py-20 px-6 border-b border-slate-800 bg-[#1A1A1A]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="text-xs uppercase tracking-widest font-['JetBrains_Mono'] text-[#C1440E] mb-2 font-semibold">
            Section 03 · Core Systems
          </div>
          <h2 className="font-['Chakra_Petch'] text-3xl sm:text-4xl font-bold text-white tracking-wide uppercase">
            The Mechanics — How Kids Play
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto mt-2">
            A real-time strategy simulation designed for ages 7–12 with authentic environmental physics.
          </p>
        </div>

        {/* 1. HUD: The Three Key Resource Bars */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-['Chakra_Petch'] text-lg font-bold text-white uppercase flex items-center gap-2">
              <span className="text-[#C1440E]">01.</span> Heads-Up Display (HUD)
            </h3>
            <span className="text-xs font-['JetBrains_Mono'] text-slate-400">
              Constant Life-Support Monitoring
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* O2 Meter */}
            <div className="p-5 bg-[#14171E] border border-slate-800 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold font-['Chakra_Petch'] text-sm">
                  <Wind className="w-4 h-4" />
                  <span>O₂ (OXYGEN)</span>
                </div>
                <span className="font-['JetBrains_Mono'] text-xs font-semibold text-white">88%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full mb-3 overflow-hidden">
                <div className="bg-cyan-400 h-full w-[88%]" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Depletes continuously. In Sol 2085 severe storms, the atmospheric intake filter clogs, accelerating drain to <strong className="text-white">1.5×</strong>.
              </p>
            </div>

            {/* Power Meter */}
            <div className="p-5 bg-[#14171E] border border-slate-800 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-[#FFCC00] font-bold font-['Chakra_Petch'] text-sm">
                  <Zap className="w-4 h-4" />
                  <span>POWER RESERVE</span>
                </div>
                <span className="font-['JetBrains_Mono'] text-xs font-semibold text-white">64%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full mb-3 overflow-hidden">
                <div className="bg-[#FFCC00] h-full w-[64%]" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                The universal currency of survival. Consumed by life support, rover travel, shield boosts, and science telemetry transmissions.
              </p>
            </div>

            {/* Shield Meter */}
            <div className="p-5 bg-[#14171E] border border-slate-800 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-[#00FF00] font-bold font-['Chakra_Petch'] text-sm">
                  <Shield className="w-4 h-4" />
                  <span>DEFENSE SHIELD</span>
                </div>
                <span className="font-['JetBrains_Mono'] text-xs font-semibold text-white">72%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full mb-3 overflow-hidden">
                <div className="bg-[#00FF00] h-full w-[72%]" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Protects the outpost dome from ionizing solar flares. Under C- and X-class flares, shield depletion accelerates to <strong className="text-white">2×</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* 2. The Trade-off & The Weather */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          {/* The Trade-off */}
          <div className="p-6 bg-[#161920] border border-slate-800 rounded-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <ArrowRightLeft className="w-5 h-5 text-[#C1440E]" />
                <h3 className="font-['Chakra_Petch'] text-base font-bold text-white uppercase">
                  02. The Trade-Off
                </h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Downloading science data costs <strong className="text-white">15 Power</strong>. Recharging the habitat shield costs <strong className="text-white">10 Power</strong>.
              </p>
              <div className="p-4 bg-black/40 rounded border border-slate-800/80 space-y-2 mb-4 font-['JetBrains_Mono'] text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Download Science Telemetry:</span>
                  <span className="text-[#C1440E] font-bold">-15 Power</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Reinforce Protective Shield:</span>
                  <span className="text-[#00FF00] font-bold">-10 Power</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                The player must prioritize because both actions cannot be completed with the same limited battery capacity. Children quickly grasp opportunity cost.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/80">
              <button
                onClick={onPlayDemo}
                className="w-full py-2.5 bg-slate-800 hover:bg-[#C1440E] text-white rounded text-xs font-semibold font-['JetBrains_Mono'] uppercase tracking-wider transition-colors cursor-pointer"
              >
                Launch Interactive Trade-off Simulator →
              </button>
            </div>
          </div>

          {/* The Weather */}
          <div className="p-6 bg-[#161920] border border-slate-800 rounded-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <CloudLightning className="w-5 h-5 text-[#FFCC00]" />
                <h3 className="font-['Chakra_Petch'] text-base font-bold text-white uppercase">
                  03. The Weather
                </h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Storm conditions are directly linked to atmospheric pressure drops and solar-flare events in the curated NASA training data.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 font-['JetBrains_Mono']">
                <li className="flex items-start gap-2">
                  <span className="text-[#00FF00] font-bold">›</span>
                  <span><strong className="text-white">Pressure Drop Trigger:</strong> When atmospheric pressure falls below 800 Pa, high-velocity dust fronts materialize.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FFCC00] font-bold">›</span>
                  <span><strong className="text-white">Solar Flare Warning:</strong> DONKI C- and X-class events flood the planet with coronal mass ejections, demanding immediate shield reinforcement.</span>
                </li>
              </ul>
            </div>

            <div className="mt-5 p-3 bg-black/40 border border-slate-800 rounded text-xs text-slate-400 font-['JetBrains_Mono'] flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Solar panels only charge during the 5-minute daylight window.</span>
            </div>
          </div>
        </div>

        {/* 3. The Map: 1 km Mars terrain with Dilli's tactical screenshots */}
        <div className="p-6 bg-[#14171E] border border-slate-800 rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2.5">
              <Map className="w-5 h-5 text-[#C1440E]" />
              <h3 className="font-['Chakra_Petch'] text-base font-bold text-white uppercase">
                04. The Map — 1 km Outpost Ares Terrain
              </h3>
            </div>
            <span className="text-xs font-['JetBrains_Mono'] text-slate-400">
              Cartography & Level Design by Dilli
            </span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            A 1 km Mars terrain containing the Base Dome, Research Center, and Generator, with a strict five-minute daylight window before sub-zero Martian nightfall.
          </p>

          {/* Dilli's Map Image Showcase */}
          <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-black group mb-6">
            <img
              src="/images/areon_mars_terrain_map.jpg"
              alt="Dilli's 1km Mars Outpost Ares tactical reconnaissance map"
              className="w-full aspect-[16/9] object-cover transition-transform duration-500 group-hover:scale-[1.01]"
            />
            <div className="absolute top-3 left-3 bg-black/80 px-3 py-1 rounded text-xs font-['JetBrains_Mono'] text-slate-300 border border-slate-700">
              Sector Coordinates: 14°28'24"S, 137°40'12"E
            </div>
          </div>

          {/* Map Sectors Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-['JetBrains_Mono'] text-xs">
            <div className="p-3 bg-black/40 rounded border border-slate-800">
              <div className="font-bold text-white mb-1">Sector 1: Base Dome Habitat</div>
              <p className="text-slate-400 text-[11px] font-sans">
                Pressurized living quarters and primary life-support systems. Astronaut sanctuary.
              </p>
            </div>
            <div className="p-3 bg-black/40 rounded border border-slate-800">
              <div className="font-bold text-white mb-1">Sector 2: Research Center</div>
              <p className="text-slate-400 text-[11px] font-sans">
                Science lab for Curiosity REMS uplink. Downloading telemetry costs 15 Power.
              </p>
            </div>
            <div className="p-3 bg-black/40 rounded border border-slate-800">
              <div className="font-bold text-white mb-1">Sector 3: Power Generator</div>
              <p className="text-slate-400 text-[11px] font-sans">
                Solar collector and capacitor banks. Active only during the 5-minute daylight window.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
