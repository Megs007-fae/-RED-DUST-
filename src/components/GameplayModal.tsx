/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX, Shield, Zap, Wind } from 'lucide-react';

interface GameplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTradeOffDemo: () => void;
  onOpenDashboard: () => void;
}

export const GameplayModal: React.FC<GameplayModalProps> = ({
  isOpen,
  onClose,
  onOpenTradeOffDemo,
  onOpenDashboard,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [seconds, setSeconds] = useState(12);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const interval = setInterval(() => {
      setSeconds((prev) => (prev >= 90 ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Telemetry commentary based on timeline
  const getMissionLog = (t: number) => {
    if (t < 25) {
      return {
        stage: 'SOL 800: BASELINE ORIENTATION',
        voice: 'Unmesh (Mission Lead)',
        text: 'Welcome to Ares Outpost. Sun is rising; the solar array is online. We have a 5-minute daylight window to conduct research.',
        status: 'NOMINAL',
      };
    } else if (t < 55) {
      return {
        stage: 'SOL 852: DUST STORM INGRESS',
        voice: 'AstroGuru Telemetry AI',
        text: 'Curiosity REMS reports rapid pressure drop to 924 Pa. C-class solar flare detected by DONKI. Shield drain doubled to 2×.',
        status: 'CAUTION',
      };
    } else {
      return {
        stage: 'SOL 2085: SEVERE GLOBAL DUST STORM',
        voice: 'Mission Control',
        text: 'Pressure critically low at 772 Pa. X-class coronal flare active. Black sky protocol initiated. Divert power from science to life support immediately.',
        status: 'CRITICAL',
      };
    }
  };

  const currentLog = getMissionLog(seconds);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-4xl bg-[#14171D] border border-slate-700/80 rounded-lg overflow-hidden shadow-2xl flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-modal-title"
      >
        {/* Header Ribbon */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-[#1A1E26]">
          <div className="flex items-center gap-3">
            <span className="font-['Chakra_Petch'] text-sm font-bold tracking-wider text-[#C1440E] uppercase">
              AREON Gameplay Showcase
            </span>
            <span className="text-xs text-slate-400 font-['JetBrains_Mono']">
              [ 90-Second Mission Trailer · Unreal Engine 5 ]
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close video player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas Stage */}
        <div className="relative aspect-video w-full bg-black overflow-hidden group">
          <img
            src={seconds > 55 ? "/images/areon_martian_storm_sol.jpg" : "/images/areon_unreal_mars_dome.jpg"}
            alt="AREON Gameplay Screen"
            className="w-full h-full object-cover transition-opacity duration-700"
          />

          {/* Sci-Fi HUD Scanline & Grid Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)]" />
          <div className="absolute inset-0 pointer-events-none border border-cyan-500/15 m-3 rounded" />

          {/* Live In-Engine HUD Overlay */}
          <div className="absolute top-6 left-6 flex flex-col gap-1.5 font-['JetBrains_Mono'] text-xs">
            <div className="flex items-center gap-2 bg-black/60 px-2.5 py-1 rounded border border-slate-700 text-slate-200">
              <Zap className="w-3.5 h-3.5 text-[#FFCC00]" />
              <span>POWER: {Math.max(18, 100 - Math.floor(seconds * 0.9))}%</span>
            </div>
            <div className="flex items-center gap-2 bg-black/60 px-2.5 py-1 rounded border border-slate-700 text-slate-200">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>SHIELD: {Math.max(25, 100 - Math.floor(seconds * (seconds > 55 ? 1.4 : 0.7)))}%</span>
            </div>
          </div>

          <div className="absolute top-6 right-6 font-['JetBrains_Mono'] text-xs bg-black/70 px-3 py-1.5 rounded border border-slate-700 text-right">
            <div className="text-slate-400 text-[10px]">CURRENT SCENARIO</div>
            <div className="font-bold text-[#FFCC00]">{currentLog.stage}</div>
          </div>

          {/* Subtitle / Telemetry Prompt */}
          <div className="absolute bottom-16 left-6 right-6 bg-black/80 backdrop-blur-sm border border-slate-700/80 p-3 rounded text-left">
            <div className="flex items-center justify-between text-[11px] font-['JetBrains_Mono'] text-slate-400 mb-1">
              <span className="text-[#C1440E] font-semibold">{currentLog.voice}</span>
              <span className="text-slate-400">{formatTime(seconds)} / 01:30</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">{currentLog.text}</p>
          </div>

          {/* Big Center Play Overlay when paused */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <button
                onClick={() => setIsPlaying(true)}
                className="w-16 h-16 rounded-full bg-[#C1440E] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer"
                aria-label="Play video"
              >
                <Play className="w-8 h-8 ml-1" />
              </button>
            </div>
          )}
        </div>

        {/* Video Scrubber & Playback Controls */}
        <div className="p-4 bg-[#14171D] border-t border-slate-800 flex flex-col gap-3">
          {/* Timeline slider */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-['JetBrains_Mono'] text-slate-400 w-12 text-left">
              {formatTime(seconds)}
            </span>
            <input
              type="range"
              min="0"
              max="90"
              value={seconds}
              onChange={(e) => setSeconds(Number(e.target.value))}
              className="w-full accent-[#C1440E] h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              aria-label="Seek video position"
            />
            <span className="text-xs font-['JetBrains_Mono'] text-slate-400 w-12 text-right">
              01:30
            </span>
          </div>

          {/* Lower Action Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <button
                onClick={() => setSeconds(0)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs inline-flex items-center gap-1.5 cursor-pointer"
                title="Restart"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart</span>
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isMuted ? 'Muted' : 'Audio ON'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenTradeOffDemo();
                }}
                className="px-3 py-1.5 text-xs font-medium bg-[#1F2937] hover:bg-slate-700 text-slate-200 border border-slate-700 rounded cursor-pointer whitespace-nowrap"
              >
                Try Browser Trade-off Demo
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenDashboard();
                }}
                className="px-3.5 py-1.5 text-xs font-semibold bg-[#C1440E] hover:bg-[#a9390a] text-white rounded cursor-pointer whitespace-nowrap"
              >
                Inspect NASA Telemetry
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
