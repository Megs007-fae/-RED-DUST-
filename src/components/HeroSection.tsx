/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, Tv, Activity, ArrowRight, Sparkles } from 'lucide-react';
import { MarsGlobe } from './MarsGlobe.tsx';

interface HeroSectionProps {
  onWatchVideo: () => void;
  onPlayDemo: () => void;
  onExploreDashboard: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onWatchVideo,
  onPlayDemo,
  onExploreDashboard,
}) => {
  return (
    <section id="overview" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden border-b border-slate-800">
      {/* Three.js Mars Globe (slowly rotating in hero background with subtle glow) */}
      <MarsGlobe />

      {/* Atmospheric Vignette & Grid */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/70 via-[#1A1A1A]/85 to-[#1A1A1A] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(193, 68, 14, 0.4) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 flex flex-col items-center text-center">
        {/* Subtitle & Mission Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs uppercase tracking-widest font-['JetBrains_Mono'] text-[#C1440E] font-semibold">
            Junior Astronaut Mission Trainer
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-xs font-['JetBrains_Mono'] text-slate-400">
            NASA Space Apps STEM Sprint
          </span>
        </div>

        {/* Main Title */}
        <h1 className="font-['Chakra_Petch'] text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-wider text-white uppercase mb-4 drop-shadow-md">
          AREON
        </h1>

        {/* Tagline */}
        <p className="font-['Plus_Jakarta_Sans'] text-lg sm:text-2xl font-medium text-slate-200 tracking-tight max-w-2xl mb-8">
          “Survive Mars. Balance the Power. Read the Data.”
        </p>

        {/* Three Primary Judge-Facing Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xl mb-12">
          {/* WATCH Action */}
          <button
            onClick={onWatchVideo}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-5 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-white font-semibold text-xs tracking-wider uppercase border border-slate-700 hover:border-slate-500 rounded transition-all cursor-pointer shadow-lg group focus-visible:ring-2 focus-visible:ring-white"
          >
            <Tv className="w-4 h-4 text-[#FFCC00] group-hover:scale-110 transition-transform" />
            <span className="font-['JetBrains_Mono']">■ WATCH</span>
            <span className="text-slate-400 font-normal text-[11px] normal-case">90s Gameplay</span>
          </button>

          {/* PLAY Action */}
          <button
            onClick={onPlayDemo}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-5 py-3.5 bg-[#C1440E] hover:bg-[#a9390a] text-white font-semibold text-xs tracking-wider uppercase rounded transition-all cursor-pointer shadow-lg shadow-[#C1440E]/20 group focus-visible:ring-2 focus-visible:ring-white"
          >
            <Play className="w-4 h-4 text-white fill-white group-hover:scale-110 transition-transform" />
            <span className="font-['JetBrains_Mono']">■ PLAY</span>
            <span className="text-red-100 font-normal text-[11px] normal-case">Browser Demo</span>
          </button>

          {/* EXPLORE Action */}
          <button
            onClick={onExploreDashboard}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-5 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-white font-semibold text-xs tracking-wider uppercase border border-[#C1440E]/60 hover:border-[#C1440E] rounded transition-all cursor-pointer shadow-lg group focus-visible:ring-2 focus-visible:ring-white"
          >
            <Activity className="w-4 h-4 text-[#00FF00] group-hover:scale-110 transition-transform" />
            <span className="font-['JetBrains_Mono']">■ EXPLORE</span>
            <span className="text-slate-400 font-normal text-[11px] normal-case">Mission Control</span>
          </button>
        </div>

        {/* Wide Cinematic Unreal Game Screenshot Showcase */}
        <div className="w-full max-w-5xl rounded-lg overflow-hidden border border-slate-700/80 shadow-2xl bg-black relative group">
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-black/75 backdrop-blur-sm border border-slate-700 px-3 py-1 rounded text-[11px] font-['JetBrains_Mono'] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#00FF00]" />
            <span>Outpost Ares Base Dome · Unreal Engine 5 Simulation View</span>
          </div>

          <img
            src="/images/areon_unreal_mars_dome.jpg"
            alt="Unreal Engine capture showing Mars landscape and Base Dome"
            className="w-full aspect-[16/9] object-cover transition-transform duration-700 group-hover:scale-[1.01]"
          />

          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-3 bg-black/80 backdrop-blur-sm border border-slate-700/80 px-3 py-1.5 rounded text-[11px] font-['JetBrains_Mono'] text-slate-400">
            <span>Terrain: 1 km Outpost Grid</span>
            <span className="text-slate-600">|</span>
            <span className="text-[#FFCC00]">Daylight Window: 05:00</span>
          </div>
        </div>
      </div>
    </section>
  );
};
