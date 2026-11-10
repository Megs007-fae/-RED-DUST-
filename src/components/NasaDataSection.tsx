/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Database, ShieldCheck, Download, Check, Copy, Users, ExternalLink, FileCode } from 'lucide-react';

interface NasaDataSectionProps {
  onOpenDashboard: () => void;
}

export const NasaDataSection: React.FC<NasaDataSectionProps> = ({ onOpenDashboard }) => {
  const [copied, setCopied] = useState(false);

  const csvContent = `sol,pressure_pa,solar_flare,storm_status
800,887,none,SAFE
852,924,C,WARNING
2085,772,X,WARNING`;

  const handleCopyCsv = () => {
    navigator.clipboard.writeText(csvContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsv = () => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'weather_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="nasa-data" className="py-20 px-6 border-b border-slate-800 bg-[#1A1A1A]">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* 5. NASA Data Integration — Data Validity */}
        <div>
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-widest font-['JetBrains_Mono'] text-[#C1440E] mb-2 font-semibold">
              Section 05 · Scientific Provenance
            </div>
            <h2 className="font-['Chakra_Petch'] text-3xl sm:text-4xl font-bold text-white tracking-wide uppercase">
              NASA Data Integration — Data Validity
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto mt-2">
              Every weather variable and storm effect in AREON is substantiated by open NASA scientific archives.
            </p>
          </div>

          {/* NASA Data Sources Table */}
          <div className="bg-[#14171E] border border-slate-800 rounded-lg overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-['JetBrains_Mono']">
                <thead className="bg-[#1B202B] text-slate-300 border-b border-slate-800 uppercase">
                  <tr>
                    <th className="px-6 py-4 font-bold text-white">Source</th>
                    <th className="px-6 py-4 font-bold text-white">Use in AREON</th>
                    <th className="px-6 py-4 font-bold text-white text-right">Data Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr className="hover:bg-slate-900/50">
                    <td className="px-6 py-4 font-bold text-white whitespace-nowrap flex items-center gap-2">
                      <Database className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Curiosity REMS (PDS)</span>
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-sans text-xs">
                      Historical Mars atmospheric pressure data, including the <code className="text-[#00FF00] font-['JetBrains_Mono']">pressure_pa</code> field. Provides genuine barometric sensor logs from Gale Crater.
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-right whitespace-nowrap">
                      Planetary Data System
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-900/50">
                    <td className="px-6 py-4 font-bold text-white whitespace-nowrap flex items-center gap-2">
                      <Database className="w-4 h-4 text-[#FFCC00] shrink-0" />
                      <span>NASA DONKI</span>
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-sans text-xs">
                      Historical solar-flare event information, including C- and X-class coronal mass ejection events mapped to game radiation shield decay rates.
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-right whitespace-nowrap">
                      Space Weather Database
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-900/50">
                    <td className="px-6 py-4 font-bold text-white whitespace-nowrap flex items-center gap-2">
                      <Database className="w-4 h-4 text-red-400 shrink-0" />
                      <span>NASA OSDR</span>
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-sans text-xs">
                      Astronaut health context for the AstroGuru AI feature, anchoring hypoxia, radiation thresholds, and cognitive workload under crisis.
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-right whitespace-nowrap">
                      Open Science Data
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Raw CSV Evidence (Exact 4-line block specified in PDF) */}
          <div className="bg-[#11141A] border border-slate-800 rounded-lg overflow-hidden">
            <div className="px-5 py-3 bg-[#171B24] border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#C1440E]" />
                <span className="font-['JetBrains_Mono'] text-xs font-bold text-slate-200">
                  weather_data.csv (Raw CSV Evidence)
                </span>
                <span className="text-[10px] text-slate-500 font-['JetBrains_Mono']">
                  [Verified 4-Line Excerpt]
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCsv}
                  className="px-2.5 py-1 text-[11px] font-['JetBrains_Mono'] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownloadCsv}
                  className="px-2.5 py-1 text-[11px] font-['JetBrains_Mono'] bg-[#C1440E] hover:bg-[#a9390a] text-white rounded flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </button>
              </div>
            </div>

            {/* Exact four-line CSV block */}
            <pre className="p-4 font-['JetBrains_Mono'] text-xs text-slate-200 leading-relaxed overflow-x-auto bg-[#0B0D12]">
              <code>{csvContent}</code>
            </pre>
          </div>
        </div>

        {/* 6. Data Honesty — Compliance & Transparency */}
        <div className="p-6 md:p-8 bg-[#181C24] border border-slate-800 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-6 h-6 text-[#00FF00]" />
            <h3 className="font-['Chakra_Petch'] text-xl font-bold text-white uppercase tracking-wide">
              6. Data Honesty — Compliance & Transparency
            </h3>
          </div>

          <div className="p-5 bg-black/40 border border-slate-800 rounded-lg mb-4">
            <div className="text-xs font-['JetBrains_Mono'] text-[#C1440E] uppercase font-bold mb-2">
              Public-Facing Scientific Disclosure
            </div>
            <p className="text-sm md:text-base text-slate-200 leading-relaxed italic">
              “Because a perfect three-day consecutive storm does not exist in the archive, we curated three specific historical Sols (800, 852, 2085) to act as escalating training scenarios. Solar flares were mapped to these days for gameplay. This is a curated training dataset, not live telemetry.”
            </p>
          </div>

          <p className="text-xs text-slate-400 font-['JetBrains_Mono'] leading-relaxed">
            By avoiding fake real-time claims and strictly adhering to historical PDS observations, AREON models ethical data literacy for young scientists.
          </p>
        </div>

        {/* 7. Team & Compliance */}
        <div className="p-6 md:p-8 bg-[#14171E] border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-[#C1440E]" />
              <h3 className="font-['Chakra_Petch'] text-xl font-bold text-white uppercase tracking-wide">
                7. Team & Compliance
              </h3>
            </div>
            <span className="text-xs font-['JetBrains_Mono'] text-[#00FF00] border border-[#00FF00]/40 bg-[#00FF00]/10 px-2.5 py-1 rounded">
              Verified Submission
            </span>
          </div>

          {/* Team Roles Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-black/40 border border-slate-800 rounded">
              <div className="text-[11px] font-['JetBrains_Mono'] text-slate-400 uppercase">Lead</div>
              <div className="text-base font-bold text-white font-['Chakra_Petch'] mt-1">Unmesh</div>
            </div>
            <div className="p-4 bg-black/40 border border-slate-800 rounded">
              <div className="text-[11px] font-['JetBrains_Mono'] text-slate-400 uppercase">Systems</div>
              <div className="text-base font-bold text-white font-['Chakra_Petch'] mt-1">Sudharsan</div>
            </div>
            <div className="p-4 bg-black/40 border border-slate-800 rounded">
              <div className="text-[11px] font-['JetBrains_Mono'] text-slate-400 uppercase">Level Design</div>
              <div className="text-base font-bold text-white font-['Chakra_Petch'] mt-1">Dilli</div>
            </div>
            <div className="p-4 bg-black/40 border border-slate-800 rounded">
              <div className="text-[11px] font-['JetBrains_Mono'] text-slate-400 uppercase">Frontend</div>
              <div className="text-base font-bold text-white font-['Chakra_Petch'] mt-1">Meghna</div>
            </div>
          </div>

          {/* Compliance Statement */}
          <div className="p-4 bg-black/40 rounded border border-slate-800/80 text-xs font-['JetBrains_Mono'] text-slate-300 space-y-2">
            <div className="font-bold text-[#FFCC00] uppercase">
              Hackathon Compliance Standards:
            </div>
            <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
              <li><strong className="text-slate-200">Combat-free:</strong> Non-violent STEM simulation focused purely on environmental survival, energy balance, and scientific discovery.</li>
              <li><strong className="text-slate-200">Anonymous submission:</strong> Uses AI voice narration for accessibility and team anonymity standards.</li>
              <li><strong className="text-slate-200">Sprint Timeline:</strong> Built and documented during the 48-hour November 14–15 hackathon sprint.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
