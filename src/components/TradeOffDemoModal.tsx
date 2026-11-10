/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Shield, Zap, Wind, Database, Sun, AlertTriangle, CheckCircle, RotateCcw, MapPin } from 'lucide-react';

interface TradeOffDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDashboard: () => void;
}

export const TradeOffDemoModal: React.FC<TradeOffDemoModalProps> = ({
  isOpen,
  onClose,
  onOpenDashboard,
}) => {
  const [selectedSol, setSelectedSol] = useState<800 | 852 | 2085>(800);
  const [oxygen, setOxygen] = useState(100);
  const [power, setPower] = useState(100);
  const [shield, setShield] = useState(100);
  const [dataMb, setDataMb] = useState(0);
  const [daylightSeconds, setDaylightSeconds] = useState(300); // 5-minute daylight window
  const [currentSector, setCurrentSector] = useState<'Base Dome' | 'Research Center' | 'Power Generator'>('Base Dome');
  const [log, setLog] = useState<string[]>([
    'T-00: Ares Habitat initialized. 5-minute daylight window active.',
    'Mission Objective: Download 100 MB NASA research telemetry without exhausting Life Support Power.',
  ]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState('');
  const [hasWon, setHasWon] = useState(false);

  // Multiplier effects based on the 3-day loop:
  // Sol 800: Normal
  // Sol 852: Shield drains 2x
  // Sol 2085: Black skies (no solar charging!), Shield drains 2x, O2 drains 1.5x
  const shieldDrainRate = selectedSol === 800 ? 1 : 2;
  const o2DrainRate = selectedSol === 2085 ? 1.5 : 1;

  // Real-time tick
  useEffect(() => {
    if (!isOpen || isGameOver || hasWon) return;

    const timer = setInterval(() => {
      setDaylightSeconds((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });

      setShield((prev) => {
        const next = Math.max(0, prev - (0.8 * shieldDrainRate));
        if (next <= 0) {
          setIsGameOver(true);
          setGameOverReason('SHIELD COLLAPSED: Solar radiation breached Outpost Ares habitat.');
        }
        return next;
      });

      setOxygen((prev) => {
        const next = Math.max(0, prev - (0.4 * o2DrainRate));
        if (next <= 0) {
          setIsGameOver(true);
          setGameOverReason('OXYGEN DEPLETED: Environmental life support failure.');
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isGameOver, hasWon, shieldDrainRate, o2DrainRate]);

  // Check victory
  useEffect(() => {
    if (dataMb >= 100 && !isGameOver && !hasWon) {
      setHasWon(true);
      setLog((prev) => [
        '🎉 MISSION SUCCESS! 100 MB research data downloaded and archived to Earth uplink.',
        ...prev,
      ]);
    }
  }, [dataMb, isGameOver, hasWon]);

  if (!isOpen) return null;

  const handleDownloadData = () => {
    if (isGameOver || hasWon) return;
    if (power < 15) {
      setLog((prev) => ['⚠️ INSUFFICIENT POWER: Downloading data requires 15 Power.', ...prev.slice(0, 8)]);
      return;
    }
    setPower((prev) => prev - 15);
    setDataMb((prev) => prev + 25);
    setLog((prev) => [
      '📡 Data download completed: +25 MB. Cost: -15 Power.',
      ...prev.slice(0, 8),
    ]);
  };

  const handleRechargeShield = () => {
    if (isGameOver || hasWon) return;
    if (power < 10) {
      setLog((prev) => ['⚠️ INSUFFICIENT POWER: Shield recharge requires 10 Power.', ...prev.slice(0, 8)]);
      return;
    }
    setPower((prev) => prev - 10);
    setShield((prev) => Math.min(100, prev + 25));
    setLog((prev) => [
      '🛡️ Defense shield reinforced: +25% Shield integrity. Cost: -10 Power.',
      ...prev.slice(0, 8),
    ]);
  };

  const handleSolarHarvest = () => {
    if (isGameOver || hasWon) return;
    if (selectedSol === 2085) {
      setLog((prev) => [
        '❌ SOLAR FAILURE: Sol 2085 global dust storm has darkened Martian sky (tau > 3.0). Solar panels cannot generate power.',
        ...prev.slice(0, 8),
      ]);
      return;
    }
    if (daylightSeconds <= 0) {
      setLog((prev) => [
        '🌑 NIGHTFALL: Daylight window has expired. Generator cannot recharge until next Sol.',
        ...prev.slice(0, 8),
      ]);
      return;
    }
    setPower((prev) => Math.min(100, prev + 20));
    setLog((prev) => [
      '☀️ Solar Generator aligned with Martian sun: +20 Power harvested.',
      ...prev.slice(0, 8),
    ]);
  };

  const handleReset = (newSol = selectedSol) => {
    setSelectedSol(newSol);
    setOxygen(100);
    setPower(100);
    setShield(100);
    setDataMb(0);
    setDaylightSeconds(300);
    setIsGameOver(false);
    setGameOverReason('');
    setHasWon(false);
    setLog([
      `Scenario reset: Sol ${newSol} initiated.`,
      newSol === 800
        ? 'Sol 800: Clear skies, baseline mechanics.'
        : newSol === 852
        ? 'Sol 852: Dust storm + C-class flare active. Shield drains 2×!'
        : 'Sol 2085: Severe global storm + X-flare. Black skies, no solar, Shield 2× & O₂ 1.5× drain!',
    ]);
  };

  const formatSec = (s: number) => {
    const mins = Math.floor(s / 60);
    const rem = s % 60;
    return `${mins}:${rem.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-4xl bg-[#14171E] border border-slate-700 rounded-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="trade-off-demo-title"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-[#1A1F29]">
          <div className="flex items-center gap-3">
            <span
              id="trade-off-demo-title"
              className="font-['Chakra_Petch'] text-sm font-bold tracking-wider text-[#C1440E] uppercase"
            >
              AREON Interactive Trade-Off Simulator
            </span>
            <span className="hidden sm:inline-block text-xs font-['JetBrains_Mono'] text-slate-400">
              [ 1 km Outpost Ares Terrain ]
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 cursor-pointer"
            aria-label="Close demo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Sol Scenario Selector */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-black/40 border border-slate-800 rounded">
            <span className="text-xs uppercase font-['JetBrains_Mono'] text-slate-400">
              Select Mission Scenario:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleReset(800)}
                className={`px-3 py-1.5 text-xs font-['JetBrains_Mono'] rounded transition-all cursor-pointer ${
                  selectedSol === 800
                    ? 'bg-[#00FF00]/20 text-[#00FF00] border border-[#00FF00]'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                Sol 800 (Clear)
              </button>
              <button
                onClick={() => handleReset(852)}
                className={`px-3 py-1.5 text-xs font-['JetBrains_Mono'] rounded transition-all cursor-pointer ${
                  selectedSol === 852
                    ? 'bg-[#FFCC00]/20 text-[#FFCC00] border border-[#FFCC00]'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                Sol 852 (Storm + C-Flare)
              </button>
              <button
                onClick={() => handleReset(2085)}
                className={`px-3 py-1.5 text-xs font-['JetBrains_Mono'] rounded transition-all cursor-pointer ${
                  selectedSol === 2085
                    ? 'bg-[#C1440E]/30 text-[#C1440E] border border-[#C1440E] font-bold'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                Sol 2085 (Severe + X-Flare)
              </button>
            </div>
          </div>

          {/* HUD Resource Display - The 3 Key Resource Bars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Oxygen Bar */}
            <div className="bg-[#181C24] p-4 rounded border border-slate-800 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-['JetBrains_Mono']">
                <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                  <Wind className="w-4 h-4 text-cyan-400" /> O₂ OXYGEN
                </span>
                <span className="font-bold text-white tabular-nums">{Math.round(oxygen)}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    oxygen < 25 ? 'bg-red-500' : 'bg-cyan-400'
                  }`}
                  style={{ width: `${oxygen}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-400 font-['JetBrains_Mono']">
                {selectedSol === 2085 ? 'Severe Storm: Drain 1.5×' : 'Nominal consumption rate'}
              </span>
            </div>

            {/* Power Bar */}
            <div className="bg-[#181C24] p-4 rounded border border-slate-800 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-['JetBrains_Mono']">
                <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                  <Zap className="w-4 h-4 text-[#FFCC00]" /> POWER RESERVE
                </span>
                <span className="font-bold text-white tabular-nums">{Math.round(power)}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    power < 20 ? 'bg-red-500' : 'bg-[#FFCC00]'
                  }`}
                  style={{ width: `${power}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-400 font-['JetBrains_Mono']">
                Core Pillar: "Every action costs Power"
              </span>
            </div>

            {/* Shield Bar */}
            <div className="bg-[#181C24] p-4 rounded border border-slate-800 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-['JetBrains_Mono']">
                <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                  <Shield className="w-4 h-4 text-[#00FF00]" /> DEFENSE SHIELD
                </span>
                <span className="font-bold text-white tabular-nums">{Math.round(shield)}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    shield < 25 ? 'bg-red-500' : 'bg-[#00FF00]'
                  }`}
                  style={{ width: `${shield}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-400 font-['JetBrains_Mono']">
                {selectedSol !== 800 ? 'Solar Flare Active: Drain 2×' : 'Atmospheric shielding stable'}
              </span>
            </div>
          </div>

          {/* Core Trade-Off Actions Strip */}
          <div className="p-4 bg-[#1B202A] rounded border border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <h4 className="font-['Chakra_Petch'] text-sm font-bold text-white">
                  The Core Trade-off Decisions
                </h4>
                <p className="text-xs text-slate-400">
                  Downloading data costs 15 Power. Recharging the shield costs 10 Power. You cannot do both with limited supply.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-['JetBrains_Mono'] shrink-0">
                <div className="flex items-center gap-1.5 text-slate-300 bg-black/40 px-2.5 py-1 rounded">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Daylight: {formatSec(daylightSeconds)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#00FF00] bg-black/40 px-2.5 py-1 rounded">
                  <Database className="w-3.5 h-3.5" />
                  <span>Data: {dataMb} / 100 MB</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={handleDownloadData}
                disabled={isGameOver || hasWon}
                className="flex flex-col items-center justify-center gap-1 p-3 bg-slate-800 hover:bg-[#C1440E] active:scale-95 disabled:opacity-40 disabled:hover:bg-slate-800 text-white rounded transition-all cursor-pointer text-center group"
              >
                <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider">
                  <Database className="w-4 h-4 text-cyan-400 group-hover:text-white" />
                  <span>Download Data</span>
                </div>
                <span className="text-[11px] text-slate-300 font-['JetBrains_Mono']">
                  Costs 15 Power (+25 MB)
                </span>
              </button>

              <button
                onClick={handleRechargeShield}
                disabled={isGameOver || hasWon}
                className="flex flex-col items-center justify-center gap-1 p-3 bg-slate-800 hover:bg-emerald-600 active:scale-95 disabled:opacity-40 disabled:hover:bg-slate-800 text-white rounded transition-all cursor-pointer text-center group"
              >
                <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider">
                  <Shield className="w-4 h-4 text-emerald-400 group-hover:text-white" />
                  <span>Recharge Shield</span>
                </div>
                <span className="text-[11px] text-slate-300 font-['JetBrains_Mono']">
                  Costs 10 Power (+25% Shield)
                </span>
              </button>

              <button
                onClick={handleSolarHarvest}
                disabled={isGameOver || hasWon || selectedSol === 2085 || daylightSeconds <= 0}
                className="flex flex-col items-center justify-center gap-1 p-3 bg-slate-800 hover:bg-amber-600 active:scale-95 disabled:opacity-40 disabled:hover:bg-slate-800 text-white rounded transition-all cursor-pointer text-center group"
              >
                <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider">
                  <Sun className="w-4 h-4 text-amber-400 group-hover:text-white" />
                  <span>Solar Harvest</span>
                </div>
                <span className="text-[11px] text-slate-300 font-['JetBrains_Mono']">
                  {selectedSol === 2085 ? 'Black Skies (Offline)' : '+20 Power (Daylight)'}
                </span>
              </button>
            </div>
          </div>

          {/* Sector Navigation & Map */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-['JetBrains_Mono'] text-slate-400">
                <span>1 KM MARS TERRAIN SECTORS</span>
                <span className="text-[#C1440E]">Current: {currentSector}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['Base Dome', 'Research Center', 'Power Generator'] as const).map((sector) => (
                  <button
                    key={sector}
                    onClick={() => {
                      setCurrentSector(sector);
                      setLog((prev) => [
                        `Astronaut traversed to ${sector}.`,
                        ...prev.slice(0, 8),
                      ]);
                    }}
                    className={`p-2.5 rounded text-xs font-medium text-center transition-all cursor-pointer border ${
                      currentSector === sector
                        ? 'bg-[#C1440E]/20 border-[#C1440E] text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 mx-auto mb-1 text-slate-400" />
                    <span>{sector}</span>
                  </button>
                ))}
              </div>

              {/* Status Banner */}
              {isGameOver && (
                <div className="p-3 bg-red-950/80 border border-red-700 rounded text-red-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{gameOverReason}</span>
                  </div>
                  <button
                    onClick={() => handleReset()}
                    className="px-2.5 py-1 bg-red-800 hover:bg-red-700 text-white rounded text-xs font-bold cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              )}

              {hasWon && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-600 rounded text-emerald-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>TRAINING COMPLETE! Telemetry successfully archived.</span>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenDashboard();
                    }}
                    className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-bold cursor-pointer"
                  >
                    View Telemetry
                  </button>
                </div>
              )}
            </div>

            {/* Tactical Live Event Feed */}
            <div className="bg-black/50 border border-slate-800 rounded p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 text-xs font-['JetBrains_Mono'] text-slate-400">
                <span>SIMULATION EVENT LOG</span>
                <button
                  onClick={() => handleReset()}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Sol</span>
                </button>
              </div>
              <div className="space-y-1.5 font-['JetBrains_Mono'] text-[11px] text-slate-300 max-h-36 overflow-y-auto">
                {log.map((entry, idx) => (
                  <div key={idx} className="leading-tight text-slate-300">
                    <span className="text-slate-500 mr-1.5">›</span>
                    {entry}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#161A22] flex items-center justify-between">
          <span className="text-xs text-slate-400 font-['JetBrains_Mono']">
            Ages 7–12 STEM Curriculum · Curiosity REMS Data Model
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleReset()}
              className="px-3 py-1.5 text-xs text-slate-300 hover:text-white cursor-pointer"
            >
              Reset Simulation
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenDashboard();
              }}
              className="px-4 py-1.5 text-xs font-semibold bg-[#C1440E] hover:bg-[#a9390a] text-white rounded cursor-pointer"
            >
              Go to Mission Control →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
