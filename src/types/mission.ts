/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WeatherDataPoint {
  sol: number;
  pressure_pa: number;
  solar_flare: 'none' | 'C' | 'X' | string;
  storm_status: 'SAFE' | 'WARNING';
  notes?: string;
}

export interface MissionScenario {
  sol: number;
  conditions: string;
  gameplayEffect: string;
  pressure_pa: number;
  flare: 'none' | 'C' | 'X';
  stormStatus: 'SAFE' | 'WARNING';
  description: string;
  atmosphericStatus: string;
}

export interface HudState {
  oxygen: number;
  power: number;
  shield: number;
  dataDownloadedMb: number;
  elapsedSeconds: number;
  daylightRemainingSeconds: number;
  isAlive: boolean;
  activeSector: 'Base Dome' | 'Research Center' | 'Power Generator';
}
