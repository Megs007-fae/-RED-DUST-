/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Papa from 'papaparse';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type Plugin,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
  Download,
  AlertTriangle,
  ShieldAlert,
  Gauge,
  SunMedium,
  CheckCircle2,
  RefreshCw,
  FileSpreadsheet,
  ArrowLeft,
  Info,
} from 'lucide-react';
import { WeatherDataPoint } from '../types/mission.ts';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Custom Chart.js plugin to draw the 800 Pa horizontal threshold reference line
const thresholdLinePlugin: Plugin = {
  id: 'thresholdLine',
  afterDraw(chart) {
    const {
      ctx,
      chartArea: { left, right },
      scales: { y },
    } = chart;
    if (!y) return;
    const yPos = y.getPixelForValue(800);
    if (yPos === undefined || isNaN(yPos)) return;

    ctx.save();
    ctx.strokeStyle = '#FFCC00';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(left, yPos);
    ctx.lineTo(right, yPos);
    ctx.stroke();

    // Text Label above threshold line
    ctx.fillStyle = '#FFCC00';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText('CRITICAL THRESHOLD: 800 Pa', right - 12, yPos - 8);
    ctx.restore();
  },
};

interface MissionControlDashboardProps {
  onBackToPitch: () => void;
  initialSol?: number;
}

export const MissionControlDashboard: React.FC<MissionControlDashboardProps> = ({
  onBackToPitch,
  initialSol = 852,
}) => {
  const [dataPoints, setDataPoints] = useState<WeatherDataPoint[]>([
    { sol: 800, pressure_pa: 887, solar_flare: 'none', storm_status: 'SAFE' },
    { sol: 852, pressure_pa: 924, solar_flare: 'C', storm_status: 'WARNING' },
    { sol: 2085, pressure_pa: 772, solar_flare: 'X', storm_status: 'WARNING' },
  ]);
  const [selectedSol, setSelectedSol] = useState<number>(initialSol);
  const [loading, setLoading] = useState<boolean>(true);
  const [csvSource, setCsvSource] = useState<string>('weather_data.csv');
  const [parseError, setParseError] = useState<string | null>(null);

  // Load and parse weather_data.csv using PapaParse
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch('/weather_data.csv')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.text();
      })
      .then((csvText) => {
        if (!isMounted) return;
        Papa.parse<WeatherDataPoint>(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.data && results.data.length > 0) {
              const cleaned = results.data.filter((d) => d.sol && d.pressure_pa);
              if (cleaned.length > 0) {
                setDataPoints(cleaned);
              }
            }
            setLoading(false);
          },
          error: (err: Error) => {
            console.error('PapaParse error:', err);
            setParseError(err.message);
            setLoading(false);
          },
        });
      })
      .catch((err) => {
        console.warn('Could not fetch CSV, using fallback verified data:', err);
        setParseError('Live CSV fetch failed; loaded verified data fallback.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Find currently selected scenario
  const currentScenario = useMemo(() => {
    const found = dataPoints.find((d) => d.sol === selectedSol);
    return (
      found ||
      dataPoints[0] || {
        sol: 800,
        pressure_pa: 887,
        solar_flare: 'none',
        storm_status: 'SAFE',
      }
    );
  }, [dataPoints, selectedSol]);

  // Dashboard behavior logic specified in PDF Page 5:
  // if (pressure < 800 || flare !== 'none') { document.body.classList.add('storm-warning'); }
  useEffect(() => {
    const pressure = currentScenario.pressure_pa;
    const flare = currentScenario.solar_flare;

    const isStormWarning = pressure < 800 || (flare !== 'none' && flare !== 'NONE');

    if (isStormWarning) {
      document.body.classList.add('storm-warning');
    } else {
      document.body.classList.remove('storm-warning');
    }

    return () => {
      document.body.classList.remove('storm-warning');
    };
  }, [currentScenario]);

  // Download weather_data.csv
  const handleDownloadCsv = () => {
    const link = document.createElement('a');
    link.href = '/weather_data.csv';
    link.setAttribute('download', 'weather_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Status treatment mapping for Current Flare Status: NONE / C / X -> Green / Yellow / Red
  const getFlareStatusTreatment = (flare: string) => {
    const norm = String(flare).toUpperCase();
    if (norm === 'X') {
      return {
        label: 'X (EXTREME)',
        colorText: 'text-red-400',
        bgColor: 'bg-red-500/10 border-red-500/40',
        badge: 'Red Alert',
      };
    } else if (norm === 'C') {
      return {
        label: 'C (MODERATE)',
        colorText: 'text-[#FFCC00]',
        bgColor: 'bg-amber-500/10 border-amber-500/40',
        badge: 'Yellow Caution',
      };
    } else {
      return {
        label: 'NONE (QUIET)',
        colorText: 'text-[#00FF00]',
        bgColor: 'bg-emerald-500/10 border-emerald-500/40',
        badge: 'Safe Status',
      };
    }
  };

  // Status treatment mapping for Storm Status: SAFE / WARNING -> Neutral / Warning
  const getStormStatusTreatment = (status: string, pressure: number) => {
    const isWarning = status === 'WARNING' || pressure < 800;
    if (isWarning) {
      return {
        label: 'WARNING',
        colorText: 'text-[#C1440E]',
        bgColor: 'bg-[#C1440E]/15 border-[#C1440E]/50',
        subtext: pressure < 800 ? 'Barometric Drop Sub-800 Pa' : 'Solar Radiation Surge',
      };
    } else {
      return {
        label: 'SAFE',
        colorText: 'text-[#00FF00]',
        bgColor: 'bg-[#00FF00]/10 border-[#00FF00]/30',
        subtext: 'Pressure Nominal (> 800 Pa)',
      };
    }
  };

  const flareTreatment = getFlareStatusTreatment(String(currentScenario.solar_flare));
  const stormTreatment = getStormStatusTreatment(currentScenario.storm_status, currentScenario.pressure_pa);

  // Prepare Chart.js dataset
  const chartData = useMemo(() => {
    const labels = dataPoints.map((d) => `Sol ${d.sol}`);
    const pressures = dataPoints.map((d) => d.pressure_pa);

    // Dynamic point colors depending on threshold & flare
    const pointColors = dataPoints.map((d) => {
      if (d.sol === selectedSol) {
        return d.pressure_pa < 800 || d.solar_flare !== 'none' ? '#C1440E' : '#00FF00';
      }
      return '#64748B';
    });

    const pointRadius = dataPoints.map((d) => (d.sol === selectedSol ? 9 : 6));

    return {
      labels,
      datasets: [
        {
          label: 'Atmospheric Pressure (Pa)',
          data: pressures,
          borderColor: '#C1440E',
          backgroundColor: 'rgba(193, 68, 14, 0.12)',
          fill: true,
          tension: 0.25,
          borderWidth: 3,
          pointBackgroundColor: pointColors,
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 2,
          pointRadius: pointRadius,
          pointHoverRadius: 10,
        },
      ],
    };
  }, [dataPoints, selectedSol]);

  const chartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1200,
        easing: 'easeInOutQuart' as const,
      },
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      onClick: (_event: any, elements: any[]) => {
        if (elements && elements.length > 0) {
          const index = elements[0].index;
          if (dataPoints[index]) {
            setSelectedSol(dataPoints[index].sol);
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top' as const,
          labels: {
            color: '#94A3B8',
            font: {
              family: 'JetBrains Mono',
              size: 11,
            },
          },
        },
        tooltip: {
          backgroundColor: '#0F1218',
          titleColor: '#FFFFFF',
          bodyColor: '#CBD5E1',
          borderColor: '#334155',
          borderWidth: 1,
          padding: 12,
          titleFont: { family: 'Chakra Petch', size: 13, weight: 'bold' as const },
          bodyFont: { family: 'JetBrains Mono', size: 12 },
          callbacks: {
            label: (context: any) => {
              const solIndex = context.dataIndex;
              const pt = dataPoints[solIndex];
              return [
                ` Pressure: ${context.parsed.y} Pa`,
                ` Flare: ${pt?.solar_flare || 'none'}`,
                ` Status: ${pt?.storm_status || 'SAFE'}`,
              ];
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
          },
          ticks: {
            color: '#94A3B8',
            font: { family: 'JetBrains Mono', size: 11 },
          },
        },
        y: {
          min: 700,
          max: 1000,
          grid: {
            color: 'rgba(255, 255, 255, 0.07)',
          },
          ticks: {
            color: '#94A3B8',
            font: { family: 'JetBrains Mono', size: 11 },
            stepSize: 50,
          },
          title: {
            display: true,
            text: 'Atmospheric Pressure (Pa)',
            color: '#94A3B8',
            font: { family: 'JetBrains Mono', size: 11 },
          },
        },
      },
    };
  }, [dataPoints]);

  return (
    <div className="min-h-screen bg-[#14171F] text-slate-100 flex flex-col">
      {/* Top Telemetry Header Ribbon */}
      <div className="bg-[#181D26] border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToPitch}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-['JetBrains_Mono'] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Pitch</span>
            </button>
            <div className="h-4 w-px bg-slate-700 hidden sm:block" />
            <div>
              <h1 className="font-['Chakra_Petch'] text-lg font-bold tracking-wider text-white uppercase flex items-center gap-2">
                <span>Page 2 — Mission Control Dashboard</span>
                <span className="text-xs font-['JetBrains_Mono'] px-2 py-0.5 rounded bg-[#C1440E]/20 text-[#C1440E] border border-[#C1440E]/40">
                  Telemetry Console
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-sans">
                Curated Curiosity REMS & DONKI telemetry behind the AREON training scenarios.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-['JetBrains_Mono'] font-semibold bg-[#C1440E] hover:bg-[#a9390a] text-white rounded transition-colors shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download weather_data.csv</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Console Workspace */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full space-y-8">
        {/* Scenario Selection Rail */}
        <div className="bg-[#181D26] border border-slate-800 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-['JetBrains_Mono'] tracking-wider text-slate-400 font-bold block mb-1">
              Select Curated Scenario Sol:
            </span>
            <p className="text-xs text-slate-400">
              Click any Sol to update real-time telemetry gauges, warning state, and chart highlight.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {dataPoints.map((pt) => {
              const isActive = pt.sol === selectedSol;
              const isBelowThreshold = pt.pressure_pa < 800;
              const hasFlare = pt.solar_flare !== 'none';
              return (
                <button
                  key={pt.sol}
                  onClick={() => setSelectedSol(pt.sol)}
                  className={`px-4 py-2 rounded text-xs font-['JetBrains_Mono'] font-bold transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-[#C1440E] text-white border-[#C1440E] shadow-lg shadow-[#C1440E]/20'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Sol {pt.sol}</span>
                    {hasFlare && <span className="text-[10px] opacity-80">({pt.solar_flare}-flare)</span>}
                  </div>
                  <div className="text-[10px] font-normal opacity-75">
                    {pt.pressure_pa} Pa · {pt.storm_status}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Live Metrics Row (Specified in PDF Page 5) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-['Chakra_Petch'] text-sm font-bold tracking-wider text-slate-300 uppercase">
              2. Live Metrics (Selected Sol: {currentScenario.sol})
            </h2>
            <span className="text-xs font-['JetBrains_Mono'] text-slate-400">
              {currentScenario.pressure_pa < 800 || currentScenario.solar_flare !== 'none'
                ? 'Status: STORM WARNING ACTIVE'
                : 'Status: NOMINAL'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Metric 1: Current Pressure */}
            <div className="p-5 bg-[#181D26] border border-slate-800 rounded-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-['JetBrains_Mono'] text-slate-400 mb-2">
                <span className="flex items-center gap-1.5 uppercase">
                  <Gauge className="w-4 h-4 text-cyan-400" />
                  Current Pressure
                </span>
                <span className="text-[10px] border border-slate-700 px-1.5 py-0.5 rounded">
                  Curiosity REMS
                </span>
              </div>
              <div className="my-2">
                <div className="text-3xl sm:text-4xl font-extrabold font-['JetBrains_Mono'] text-white tabular-nums">
                  {currentScenario.pressure_pa}{' '}
                  <span className="text-base font-normal text-slate-400">Pa</span>
                </div>
                <div className="text-xs text-slate-400 mt-1 font-['JetBrains_Mono']">
                  {currentScenario.pressure_pa < 800 ? (
                    <span className="text-[#C1440E] font-semibold">
                      Below 800 Pa critical threshold! (-{(800 - currentScenario.pressure_pa)} Pa)
                    </span>
                  ) : (
                    <span className="text-[#00FF00] font-semibold">
                      Above 800 Pa threshold (+{(currentScenario.pressure_pa - 800)} Pa)
                    </span>
                  )}
                </div>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 font-sans">
                Numeric readout directly informing game atmospheric resistance.
              </div>
            </div>

            {/* Metric 2: Current Flare Status */}
            <div className="p-5 bg-[#181D26] border border-slate-800 rounded-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-['JetBrains_Mono'] text-slate-400 mb-2">
                <span className="flex items-center gap-1.5 uppercase">
                  <SunMedium className="w-4 h-4 text-amber-400" />
                  Current Flare Status
                </span>
                <span className="text-[10px] border border-slate-700 px-1.5 py-0.5 rounded">
                  NASA DONKI
                </span>
              </div>
              <div className="my-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`text-3xl sm:text-4xl font-extrabold font-['JetBrains_Mono'] ${flareTreatment.colorText}`}
                  >
                    {String(currentScenario.solar_flare).toUpperCase()}
                  </div>
                  <span
                    className={`text-xs font-['JetBrains_Mono'] font-bold px-2.5 py-1 rounded border uppercase ${flareTreatment.bgColor} ${flareTreatment.colorText}`}
                  >
                    {flareTreatment.badge}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1 font-['JetBrains_Mono']">
                  {flareTreatment.label}
                </div>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 font-sans">
                Radiation index governs habitat defense shield drain rate (1× vs 2×).
              </div>
            </div>

            {/* Metric 3: Storm Status */}
            <div className="p-5 bg-[#181D26] border border-slate-800 rounded-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-['JetBrains_Mono'] text-slate-400 mb-2">
                <span className="flex items-center gap-1.5 uppercase">
                  <ShieldAlert className="w-4 h-4 text-[#C1440E]" />
                  Storm Status
                </span>
                <span className="text-[10px] border border-slate-700 px-1.5 py-0.5 rounded">
                  Simulation Protocol
                </span>
              </div>
              <div className="my-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`text-3xl sm:text-4xl font-extrabold font-['JetBrains_Mono'] ${stormTreatment.colorText}`}
                  >
                    {stormTreatment.label}
                  </div>
                  <span
                    className={`text-xs font-['JetBrains_Mono'] font-bold px-2.5 py-1 rounded border uppercase ${stormTreatment.bgColor} ${stormTreatment.colorText}`}
                  >
                    {stormTreatment.label === 'WARNING' ? 'Condition Alert' : 'Nominal'}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1 font-['JetBrains_Mono']">
                  {stormTreatment.subtext}
                </div>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 font-sans">
                Triggered when pressure &lt; 800 Pa or solar flare != none.
              </div>
            </div>
          </div>
        </div>

        {/* 1. Live Graph — Chart.js (Specified in PDF Page 5) */}
        <div className="bg-[#181D26] border border-slate-800 rounded-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="font-['Chakra_Petch'] text-base font-bold text-white uppercase tracking-wider">
                1. Live Graph — Chart.js Telemetry Plot
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Atmospheric Pressure (Pa) plotted against Curated Sols (800, 852, 2085) with 800 Pa threshold line.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-['JetBrains_Mono'] text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#FFCC00] inline-block" />
                <span>800 Pa Threshold</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C1440E] inline-block" />
                <span>Atmospheric Pressure</span>
              </div>
            </div>
          </div>

          {/* Chart Canvas Area */}
          <div className="h-80 w-full relative">
            <Line
              data={chartData}
              options={chartOptions}
              plugins={[thresholdLinePlugin]}
            />
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-['JetBrains_Mono'] text-slate-400">
            <span>Left-to-right animation enabled · Click any point or scenario button to inspect</span>
            <span className="text-[#FFCC00]">
              Warning highlight active when scenario is &lt; 800 Pa or flare ≠ none
            </span>
          </div>
        </div>

        {/* PapaParse Verified Table & Raw Evidence Inspection */}
        <div className="bg-[#181D26] border border-slate-800 rounded-lg overflow-hidden">
          <div className="px-6 py-3.5 bg-[#1D232E] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#00FF00]" />
              <span className="font-['Chakra_Petch'] text-sm font-bold text-white uppercase">
                PapaParse Dataset Table View
              </span>
              <span className="text-xs text-slate-400 font-['JetBrains_Mono']">
                [Loaded from /weather_data.csv]
              </span>
            </div>
            <button
              onClick={handleDownloadCsv}
              className="text-xs font-['JetBrains_Mono'] text-[#C1440E] hover:text-[#e05213] flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-['JetBrains_Mono']">
              <thead className="bg-black/30 text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3">Sol</th>
                  <th className="px-6 py-3">Pressure (Pa)</th>
                  <th className="px-6 py-3">Solar Flare</th>
                  <th className="px-6 py-3">Storm Status</th>
                  <th className="px-6 py-3">Condition Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {dataPoints.map((row) => {
                  const isSelected = row.sol === selectedSol;
                  return (
                    <tr
                      key={row.sol}
                      onClick={() => setSelectedSol(row.sol)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#C1440E]/15 font-bold text-white' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="px-6 py-3.5 flex items-center gap-2">
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#C1440E]" />}
                        <span>Sol {row.sol}</span>
                      </td>
                      <td className="px-6 py-3.5 tabular-nums font-semibold">
                        {row.pressure_pa} Pa
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] ${
                            row.solar_flare === 'X'
                              ? 'text-red-400 bg-red-950/60'
                              : row.solar_flare === 'C'
                              ? 'text-amber-400 bg-amber-950/60'
                              : 'text-emerald-400 bg-emerald-950/60'
                          }`}
                        >
                          {row.solar_flare}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] ${
                            row.storm_status === 'WARNING'
                              ? 'text-[#C1440E] bg-[#C1440E]/10'
                              : 'text-[#00FF00] bg-[#00FF00]/10'
                          }`}
                        >
                          {row.storm_status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-400 font-sans text-xs">
                        {row.sol === 800 && 'Curiosity Gale Crater baseline clear day'}
                        {row.sol === 852 && 'Gale Crater regional dust onset + DONKI C-flare event'}
                        {row.sol === 2085 && 'Global planet-encircling dust storm + extreme X-flare event'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Data Source Footer & CSV Download (Specified in PDF Page 5) */}
        <div className="p-6 bg-[#161922] border border-slate-800 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-['JetBrains_Mono'] text-slate-300 font-bold uppercase mb-1">
                Data Provenance Notice
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                “Data provided by NASA Curiosity REMS (PDS) and DONKI. Curated for AREON. Not live telemetry.”
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={handleDownloadCsv}
              className="px-4 py-2 text-xs font-['JetBrains_Mono'] font-bold bg-[#C1440E] hover:bg-[#a9390a] text-white rounded transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download weather_data.csv</span>
            </button>
            <button
              onClick={onBackToPitch}
              className="px-4 py-2 text-xs font-['JetBrains_Mono'] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
            >
              Return to Pitch →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
