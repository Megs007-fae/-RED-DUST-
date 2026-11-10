/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Target, Users, BatteryCharging, Compass, AlertCircle } from 'lucide-react';

export const ProblemSolutionSection: React.FC = () => {
  return (
    <section className="py-20 px-6 border-b border-slate-800 bg-[#16191F]">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-widest font-['JetBrains_Mono'] text-[#C1440E] mb-2 font-semibold">
            Section 02 · Pedagogical Concept
          </div>
          <h2 className="font-['Chakra_Petch'] text-3xl sm:text-4xl font-bold text-white tracking-wide uppercase">
            The Problem & Solution — Why AREON?
          </h2>
        </div>

        {/* The Problem & Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* The Problem */}
          <div className="p-6 bg-[#1A1E26] border border-slate-800 rounded-lg">
            <div className="flex items-center gap-2.5 mb-3 text-slate-300">
              <AlertCircle className="w-5 h-5 text-[#FFCC00]" />
              <h3 className="font-['Chakra_Petch'] text-lg font-bold text-white">
                The STEM Challenge
              </h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Space STEM content often feels abstract to young learners. Memorizing planetary facts and atmospheric formulas fails to convey the visceral reality of interplanetary survival and resource scarcity.
            </p>
            <div className="text-xs font-['JetBrains_Mono'] text-slate-400 border-t border-slate-800 pt-3">
              Target Audience: Kids ages 7–12 & STEM Educators
            </div>
          </div>

          {/* The Solution */}
          <div className="p-6 bg-[#1A1E26] border border-slate-800 rounded-lg">
            <div className="flex items-center gap-2.5 mb-3 text-slate-300">
              <Users className="w-5 h-5 text-[#00FF00]" />
              <h3 className="font-['Chakra_Petch'] text-lg font-bold text-white">
                The AREON Experience
              </h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              AREON gives children ages 7–12 a hands-on way to engage with Mars by managing life-support systems, analyzing real Curiosity rover sensor readings, and making critical trade-offs under escalating weather pressure.
            </p>
            <div className="text-xs font-['JetBrains_Mono'] text-slate-400 border-t border-slate-800 pt-3">
              Core Methodology: Data-driven decision gameplay
            </div>
          </div>
        </div>

        {/* CORE PILLAR Box (Specified in PDF) */}
        <div className="relative p-8 rounded-lg bg-gradient-to-r from-[#C1440E]/15 via-black/40 to-[#C1440E]/15 border-2 border-[#C1440E] text-center shadow-xl">
          <div className="text-xs uppercase tracking-widest font-['JetBrains_Mono'] text-[#C1440E] font-bold mb-2">
            CORE PILLAR
          </div>
          <blockquote className="font-['Chakra_Petch'] text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-wide">
            “Every action costs Power, and Power is the only thing keeping you alive.”
          </blockquote>
          <p className="text-xs text-slate-400 font-['JetBrains_Mono'] mt-3 max-w-xl mx-auto">
            Children learn authentic mission triage: every science data packet downloaded demands power diverted from protective electromagnetic shields and life-support oxygen generation.
          </p>
        </div>
      </div>
    </section>
  );
};
