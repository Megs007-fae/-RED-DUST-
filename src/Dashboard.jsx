import annotationPlugin from "chartjs-plugin-annotation";
import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  Title,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "./index.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  annotationPlugin
);

const THRESHOLD = 705;
const MISSION_DAYS = [
  {
    sol: 800,
    phase: "DAY 01",
    condition: "CLEAR",
    description: "Stable atmospheric conditions",
    severity: "nominal",
  },
  {
    sol: 850,
    phase: "DAY 02",
    condition: "MODERATE STORM",
    description: "Escalating atmospheric disturbance",
    severity: "warning",
  },
  {
    sol: 910,
    phase: "DAY 03",
    condition: "SEVERE STORM",
    description: "Critical atmospheric conditions",
    severity: "critical",
  },
];

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Papa.parse("/simulated_mission_data.csv", {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,

      complete: (result) => {
        const validData = result.data.filter(
  (item) =>
    item.sol !== undefined &&
    item.sol !== null &&
    item.sol !== "" &&
    Number.isFinite(Number(item.sol)) &&
    Number.isFinite(Number(item.pressure_pa))
);

// Preserve the original CSV row order
setWeatherData(validData);

console.log("LAST CSV ROW:", validData[validData.length - 1]);
        setLoading(false);
      },

      error: () => {
        setError("Unable to load mission telemetry.");
        setLoading(false);
      },
    });
  }, []);

  const latest = weatherData.length
    ? weatherData[weatherData.length - 1]
    : null;
  const activeMissionDay = latest
  ? MISSION_DAYS.find(
      (day) => Number(latest.sol) === day.sol
    )
  : null;

  const missionProgress = activeMissionDay
  ? MISSION_DAYS.findIndex(
      (day) => day.sol === activeMissionDay.sol
    ) + 1
  : 0;

const missionProgressLabel =
  missionProgress === 0
    ? "AWAITING MISSION DATA"
    : `MISSION DAY ${missionProgress} / 3`;

const missionDayRecords = MISSION_DAYS.map((day) => {
  const readings = weatherData.filter(
    (item) => Number(item.sol) === day.sol
  );

  const firstBreachIndex = weatherData.findIndex(
    (item) =>
      Number(item.sol) === day.sol &&
      Number(item.pressure_pa) < THRESHOLD
  );

  return {
    ...day,
    recordCount: readings.length,
    minPressure:
  readings.length > 0
    ? Math.min(
        ...readings.map((item) =>
          Number(item.pressure_pa)
        )
      )
    : null,
    firstBreachIndex,
    status:
      readings.length === 0
        ? "AWAITING DATA"
        : firstBreachIndex !== -1
          ? "THRESHOLD BREACHED"
          : "NO BREACH RECORDED",
  };
});
  const pressureDifference = latest
  ? Number(latest.pressure_pa) - THRESHOLD
  : null;

  const pressureLevel = latest
  ? Math.max(
      0,
      Math.min(
        100,
        (Number(latest.pressure_pa) / THRESHOLD) * 100
      )
    )
  : 0;

const pressureDifferenceText =
  pressureDifference === null
    ? "--"
    : `${pressureDifference > 0 ? "+" : ""}${pressureDifference.toFixed(2)} Pa`;

const pressureStatus = latest
  ? Number(latest.pressure_pa) < THRESHOLD
    ? "BELOW CRITICAL LIMIT"
    : Number(latest.pressure_pa) === THRESHOLD
      ? "CRITICAL THRESHOLD REACHED"
      : "WITHIN THRESHOLD"
  : "WAITING FOR DATA";

  const pressureStatusClass =
  pressureDifference === null
    ? "stable-text"
    : pressureDifference <= 0
    ? "danger-text"
    : "normal-text";

const pressureStatusIcon =
  pressureDifference === null
    ? "●"
    : pressureDifference <= 0
    ? "⚠"
    : "▲";

const pressureDifferenceClass =
  pressureDifference === null
    ? "stable-text"
    : pressureDifference < 0
    ? "danger-text"
    : "normal-text";
 const dataIntegrity = weatherData.length > 0
  ? "DATA LOADED"
  : "NO DATA";

  const dataIntegrityClass = weatherData.length > 0
  ? "normal-text"
  : "danger-text";

  const stormWarning =
  latest !== null &&
  Number(latest.pressure_pa) < 705;
 console.log("Latest reading:", latest);
console.log("Storm warning:", stormWarning);

  const averagePressure = weatherData.length
    ? (
        weatherData.reduce(
          (sum, item) => sum + Number(item.pressure_pa),
          0
        ) / weatherData.length
      ).toFixed(2)
    : "--";

  const warningCount = weatherData.filter(
    (item) => Number(item.pressure_pa) < THRESHOLD
  ).length;

  const environmentalStatus =
    warningCount > 0
    ? "ELEVATED RISK"
    : "NOMINAL";

  const environmentalClass =
    warningCount > 0
    ? "danger-text"
    : "normal-text";

  const missionEvents = weatherData.map((item, index) => ({
  observation: index + 1,
  pressure: Number(item.pressure_pa),
  status:
    Number(item.pressure_pa) < 705
      ? "STORM DETECTED"
      : "NORMAL CONDITIONS",
  severity:
    Number(item.pressure_pa) < 705
      ? "critical"
      : "nominal",
})).reverse();
  const previous = weatherData.length >= 2
  ? weatherData[weatherData.length - 2]
  : null;

const pressureTrend = !previous
  ? "WAITING FOR DATA"
  : latest.pressure_pa > previous.pressure_pa
  ? "RISING"
  : latest.pressure_pa < previous.pressure_pa
  ? "FALLING"
  : "STABLE";
const pressureChange = previous
  ? (
      Number(latest.pressure_pa) -
      Number(previous.pressure_pa)
    ).toFixed(2)
  : "--";
const chartData = {
  labels: weatherData.map(
    (item, index) => `OBSERVATION ${index + 1}`
  ),

  datasets: [
    {
      label: "Atmospheric Pressure",

      data: weatherData.map(
        (item) => Number(item.pressure_pa)
      ),

      borderColor: "#c66b3d",
      backgroundColor: "rgba(198, 107, 61, 0.12)",
      borderWidth: 3,

      pointRadius: 5,
      pointHoverRadius: 9,
      pointBorderWidth: 2,
      pointBorderColor: "#ffffff",

      pointBackgroundColor: weatherData.map(
        (item) =>
          Number(item.pressure_pa) < THRESHOLD
            ? "#ff3333"
            : "#f0a35e"
      ),

      segment: {
        borderColor: (context) => {
          const start = context.p0.parsed.y;
          const end = context.p1.parsed.y;

          return start < THRESHOLD || end < THRESHOLD
            ? "#ef4444"
            : "#c66b3d";
        },
      },

      pointHoverBackgroundColor: "#ffffff",
      tension: 0.4,
      fill: true,
      cubicInterpolationMode: "monotone",
    },

    {
      label: "CRITICAL THRESHOLD — 705 Pa",

      data: weatherData.map(() => THRESHOLD),

      borderColor: "#ff3333",
      borderWidth: 2,
      borderDash: [8, 5],

      pointRadius: 0,
      pointHoverRadius: 0,
      fill: false,
    },
  ],
};
 const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1800,
    easing: "easeInOutQuart",
  },

  interaction: {
    intersect: false,
    mode: "index",
  },

  plugins: {
 annotation: {
  annotations: {
    criticalThreshold: {
      type: "line",
      yMin: 705,
      yMax: 705,
      borderColor: "#ff7043",
      borderWidth: 2,
      borderDash: [8, 5],
      label: {
        display: true,
        content: "CRITICAL LIMIT — 705 Pa",
        position: "end",
        backgroundColor: "#7c2d12",
        color: "#ffffff",
        font: {
          size: 11,
          weight: "bold",
        },
        padding: 6,
      },
    },
  },
},
  legend: {
    position: "top",
    labels: {
      color: "#cbd5e1",
      usePointStyle: true,
      pointStyle: "circle",
      padding: 20,
    },
  },

  tooltip: {
    backgroundColor: "#0b1424",
    titleColor: "#38bdf8",
    bodyColor: "#ffffff",
    borderColor: "#38bdf8",
    borderWidth: 1,
    padding: 14,
  },
},
  scales: {
    x: {
      title: {
        display: true,
        text: "OBSERVATION SEQUENCE",
        color: "#38bdf8",
        font: {
          size: 12,
          weight: "bold",
        },
      },

      ticks: {
        color: "#94a3b8",
      },

      grid: {
        color: "rgba(148,163,184,0.08)",
      },
    },

  y: {
  min: Math.floor(
    Math.min(...weatherData.map(item =>
      Number(item.pressure_pa)
    )) * 10
  ) / 10 - 0.1,

  max: Math.ceil(
    Math.max(...weatherData.map(item =>
      Number(item.pressure_pa)
    )) * 10
  ) / 10 + 0.1,

  title: {
    display: true,
    text: "ATMOSPHERIC PRESSURE (Pa)",
    color: "#f0a35e",
  },

  ticks: {
    stepSize: 0.1,
    precision: 1,
    color: "#d6b6a0",
    callback: (value) => `${Number(value).toFixed(1)} Pa`,
  },

  grid: {
    color: "rgba(198,107,61,0.15)",
  },
},
  },
};

  return (
    <main className="dashboard">

      <header className="mission-header">

  <div className="mission-identity">
    <div className="mission-designation">
      PLANETARY SCIENCE DIVISION
      <span> / MARS EXPLORATION</span>
    </div>

    <h1>
      MARS <span>//</span> MISSION CONTROL
    </h1>

    <p className="mission-subtitle">
      Atmospheric Monitoring & Environmental Intelligence
    </p>

    <div className="mission-meta">
      <span>MISSION ID: AREON-PRD-01</span>
      <span>PLANET: MARS</span>
      <span>MONITORING: PRESSURE</span>
    </div>
  </div>

  <div className="mission-header-status">
    <div className="system-status">
      <span className="status-dot"></span>
      SYSTEM ONLINE
    </div>

    <div className="mission-location">
      SOLAR ATMOSPHERIC OBSERVATION
    </div>
  </div>

  <div className="radar-container">
    <div className="radar-circle">
      <div className="radar-sweep"></div>
      <div className="radar-center"></div>
    </div>
    <span>ATMOSPHERIC SCAN ACTIVE</span>
  </div>

</header>

      {stormWarning && (
        <div className="storm-warning">
          <span className="warning-symbol">!</span>
          <div>
            <h2>STORM WARNING</h2>
            <p>
              Atmospheric pressure has dropped below
              the critical threshold of 705 Pa.
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-panel">
          INITIALIZING MISSION TELEMETRY...
        </div>
      ) : error ? (
        <div className="loading-panel error-panel">
          {error}
        </div>
      ) : (
        <>
          <div className="simulation-banner">
  <span className="simulation-indicator"></span>
  <strong>SIMULATED SCENARIO DATA</strong>
  <span>
    Illustrative mission values — NOT actual NASA telemetry
  </span>
</div>
           <div className="mission-progress-panel">
  <div className="progress-heading">
    <span>MISSION PROGRESSION</span>
    <strong>{missionProgressLabel}</strong>
  </div>

  <div className="progress-track">
    <div
      className="progress-fill"
      style={{
        width: `${(missionProgress / 3) * 100}%`,
      }}
    ></div>
  </div>

  <div className="progress-labels">
    <span>SOL 800</span>
    <span>SOL 850</span>
    <span>SOL 910</span>
  </div>
</div>

          <section className="telemetry-grid">

            <article className="telemetry-card primary-card">
              <p className="card-label">LATEST PRESSURE</p>
              <h2>
                {latest
                  ? Number(latest.pressure_pa).toFixed(2)
                  : "--"}
                <span> Pa</span>
              </h2>
              <p className="card-detail">
                Latest recorded atmospheric pressure
              </p>
            </article>

            <article className="telemetry-card">
              <p className="card-label">AVERAGE PRESSURE</p>
              <h2>{averagePressure} <span>Pa</span></h2>
              <p className="card-detail">Across available records</p>
            </article>

            <article className="telemetry-card">
              <p className="card-label">WARNING EVENTS</p>
              <h2 className={warningCount ? "danger-text" : ""}>
                {warningCount}
              </h2>
              <p className="card-detail">
                Records below 705 Pa
              </p>
            </article>

            <article className="telemetry-card">
              <p className="card-label">DATA RECORDS</p>
              <h2>{weatherData.length}</h2>
              <p className="card-detail">
                Atmospheric observations
              </p>
            </article>

          </section>
          <section className="live-telemetry">
  <div className="live-heading">
    <span className="live-indicator"></span>
    LIVE MISSION TELEMETRY
  </div>

  <div className="live-grid">

    <div className="live-item">
  <span className="live-label">LATEST MARTIAN SOL</span>
  <h2>
    {latest ? `SOL ${latest.sol}` : "--"}
  </h2>
  <p>Most recent atmospheric observation</p>
</div>
    <div className="live-item">
  <span className="live-label">OBSERVATION SEQUENCE</span>
  <h2>
    {weatherData.length > 0
      ? `${weatherData.length} RECORDS`
      : "--"}
  </h2>
  <p>
    {weatherData.length > 0
      ? `SOL ${weatherData[0].sol} to SOL ${latest.sol}`
      : "Waiting for observations"}
  </p>
</div>
   
   <div className="live-item">
  <span className="live-label">ATMOSPHERIC PRESSURE</span>

  <h2>
    {latest
      ? Number(latest.pressure_pa).toFixed(2)
      : "--"} Pa
  </h2>

  {/* PRESSURE CHANGE GOES HERE */}
  <p className="pressure-change">
    {previous
      ? `${Number(pressureChange) > 0 ? "+" : ""}${pressureChange} Pa since previous observation`
      : "Waiting for previous reading"}
  </p>
</div>
    <div className="live-item">
      <span className="live-label">PRESSURE TREND</span>
      <h2
      
  className={
    pressureTrend === "FALLING"
      ? "danger-text"
      : pressureTrend === "RISING"
      ? "normal-text"
      : "stable-text"
  }
>
  {pressureTrend}
 
</h2>
    </div>

    <div className="live-item">
      <span className="live-label">MISSION STATUS</span>
      <h2 className={stormWarning ? "danger-text" : "normal-text"}>
        {stormWarning ? "STORM ALERT" : "NOMINAL"}
      </h2>
    </div>
  </div>
</section>

<section className="mission-timeline">
  <div className="panel-heading">
    <div>
      <p className="eyebrow">SURVIVAL PROTOCOL / 72 HOURS</p>
      <h2>THREE-DAY MISSION TIMELINE</h2>
    </div>

    <span className="unit-label">3 SOLS / 3 PHASES</span>
  </div>

  <div className="active-sol-panel">
    <span className="live-indicator"></span>
    <div>
      <p className="eyebrow">CURRENTLY ACTIVE</p>
      <h2>
        {activeMissionDay
          ? `${activeMissionDay.phase} // SOL ${activeMissionDay.sol}`
          : latest
            ? `SOL ${latest.sol} // OUTSIDE MISSION DAYS`
            : "AWAITING TELEMETRY"}
      </h2>
    </div>
  </div>

  <div className="mission-days-grid">
    {missionDayRecords.map((day) => (
      <article
        className={`mission-day-card ${day.severity} ${
          activeMissionDay?.sol === day.sol ? "active-day" : ""
        }`}
        key={day.sol}
      >
        <p className="eyebrow">{day.phase}</p>

        <h3>SOL {day.sol}</h3>

        <h4>{day.condition}</h4>

        <div className={`severity-indicator ${day.severity}`}>
  <span className="severity-dot"></span>
  {day.severity === "nominal"
    ? "LOW SEVERITY"
    : day.severity === "warning"
      ? "MODERATE SEVERITY"
      : "SEVERE CONDITIONS"}
</div>
<div className={`intensity-meter ${day.severity}`}>
  <div className="intensity-track">
    <div className="intensity-fill"></div>
  </div>
  <span>
    {day.severity === "nominal"
      ? "LEVEL 1 / 3"
      : day.severity === "warning"
        ? "LEVEL 2 / 3"
        : "LEVEL 3 / 3"}
  </span>
</div>

        <p>{day.description}</p>

        <div className="day-divider"></div>

        <span>OBSERVATIONS</span>
        <strong>{day.recordCount}</strong>
        <span>MINIMUM PRESSURE</span>
<strong
  className={
    day.minPressure === null
      ? "pressure-pending"
      : day.minPressure < THRESHOLD
        ? "pressure-danger"
        : "pressure-safe"
  }
>
  {day.minPressure !== null
    ? `${day.minPressure.toFixed(2)} Pa`
    : "AWAITING DATA"}
</strong>

        <span>THRESHOLD STATUS</span>
        <strong>
          {day.status}
        </strong>

        {day.firstBreachIndex !== -1 && (
          <p className="breach-marker">
            FIRST BREACH: OBSERVATION {day.firstBreachIndex + 1}
          </p>
        )}
      </article>
    ))}
  </div>
</section>

<section className="comparison-panel">
  <h2>PRESSURE THRESHOLD ANALYSIS</h2>

  <div className="comparison-grid">
    <div className="comparison-item">
      <span>CURRENT PRESSURE</span>
      <h3>
        {latest
          ? `${Number(latest.pressure_pa).toFixed(2)} Pa`
          : "--"}
      </h3>
    </div>

    <div className="comparison-item">
      <span>CRITICAL THRESHOLD</span>
      <h3>705.00 Pa</h3>
    </div>

    <div className="comparison-item">
      <span>PRESSURE DIFFERENCE</span>
      <h3 className={pressureDifferenceClass}>
  {pressureDifferenceText}
</h3>
    </div>

    <div className="comparison-item">
      <span>ATMOSPHERIC STATUS</span>
      <h3 className={pressureStatusClass}>
  {pressureStatusIcon} {pressureStatus}
</h3>
    </div>
  </div>

<div className="pressure-gauge">

  <div className="gauge-heading">
    <span>PRESSURE LEVEL</span>
    <span>
      {latest
        ? `${Number(latest.pressure_pa).toFixed(2)} Pa`
        : "--"}
    </span>
  </div>
  <div className="telemetry-timestamp">
  LAST TELEMETRY UPDATE:{" "}
  {new Date().toLocaleTimeString()}
</div>  
  <div className={`gauge-status ${stormWarning ? "danger-text" : "normal-text"}`}>
  {stormWarning
    ? "⚠ CRITICAL — PRESSURE BELOW THRESHOLD"
    : "● NOMINAL — PRESSURE WITHIN LIMIT"}
</div>


  <div className={`gauge-track ${stormWarning ? "warning-active" : ""}`}>
    <div className="gauge-warning-zone"></div>
    <div className="gauge-threshold"></div>

    <div
  className={`gauge-marker ${
    latest && Number(latest.pressure_pa) < 705
      ? "gauge-critical"
      : "gauge-normal"
  }`}
  style={{
    left: `${
      latest
        ? Math.max(
            0,
            Math.min(
              100,
              ((Number(latest.pressure_pa) - 704) / 2) * 100
            )
          )
        : 50
    }%`,
  }}
></div>
  </div>

  <div className="gauge-labels">
    <span>704 Pa</span>
    <span>705 Pa — WARNING</span>
    <span>706 Pa</span>
  </div>
  <div
  className={
    latest && Number(latest.pressure_pa) < 705
      ? "gauge-status critical"
      : "gauge-status normal"
  }
>
  {latest && Number(latest.pressure_pa) < 705
    ? "⚠ CRITICAL — PRESSURE BELOW THRESHOLD"
    : "✓ NOMINAL — PRESSURE WITHIN SAFE RANGE"}
</div>
</div>

</section>
<section className="environment-panel">
  <div className="panel-heading">
    <div>
      <p className="eyebrow">PLANETARY ENVIRONMENT</p>
      <h2>ENVIRONMENTAL STATUS</h2>
    </div>

    <span className={`environment-badge ${environmentalClass}`}>
      {environmentalStatus}
    </span>
  </div>

  <div className="environment-grid">

    <div className="environment-item">
      <p>PRESSURE MONITORING</p>
      <h3>{stormWarning ? "BELOW THRESHOLD" : "WITHIN THRESHOLD"}</h3>
    </div>

    <div className="environment-item">
  <p>CURRENT STORM STATUS</p>
  <h3 className={stormWarning ? "danger-text" : "normal-text"}>
    {stormWarning
      ? "ACTIVE WARNING"
      : `CLEAR (${warningCount} PAST EVENTS)`}
  </h3>
</div>

    <div className="environment-item">
      <p>TOTAL WARNING EVENTS</p>
      <h3>{warningCount}</h3>
    </div>

    <div className="environment-item">
      <p>MONITORING RECORDS</p>
      <h3>{weatherData.length}</h3>
    </div>

  </div>
</section>

<section className="integrity-panel">
  <div className="panel-heading">
    <div>
      <p className="eyebrow">MISSION DATA SYSTEM</p>
      <h2>DATA INTEGRITY & SOURCE</h2>
    </div>

    <span className={dataIntegrityClass}>
      {dataIntegrity}
    </span>
  </div>

  <div className="integrity-grid">

    <div>
      <p>DATA SOURCE</p>
      <h3>weather_data.csv</h3>
    </div>

    <div>
      <p>VALID OBSERVATIONS</p>
      <h3>{weatherData.length}</h3>
    </div>

    <div>
      <p>LATEST MARTIAN SOL</p>
      <h3>{latest ? latest.sol : "--"}</h3>
    </div>

    <div>
      <p>DATA STATUS</p>
      <h3 className={dataIntegrityClass}>
        {dataIntegrity}
      </h3>
    </div>

  </div>
</section>

          <section className="chart-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">ENVIRONMENTAL TELEMETRY</p>
                <h2>ATMOSPHERIC PRESSURE ANALYSIS</h2>
              </div>
              <span className="unit-label">UNIT: Pa</span>
            </div>

            <div className="chart-container">
              <Line data={chartData} options={chartOptions} />
            </div>

            <div className="chart-footer">
              <span>— Pressure readings</span>
              <span className="threshold-label">
                - - Warning threshold: 705 Pa
              </span>
            </div>
          </section>
          <section className="event-panel">
  <div className="panel-heading">
    <div>
      <p className="eyebrow">MISSION ACTIVITY</p>
      <h2>MISSION EVENT LOG</h2>
    </div>
    <span className="unit-label">
      {missionEvents.length} EVENTS
    </span>
  </div>

  <div className="event-list">
    {missionEvents.map((event, index) => (
      <div className="event-row" key={index}>
        <div
          className={`event-indicator ${event.severity}`}
        ></div>

        <div className="event-details">
          <h3>{event.status}</h3>
          <p>
              OBSERVATION {event.observation} · Pressure: {event.pressure.toFixed(2)} Pa
          </p>
        </div>

        <span className={`event-status ${event.severity}`}>
          {event.severity === "critical" ? "CRITICAL" : "NOMINAL"}
        </span>
      </div>
    ))}
  </div>
</section>
 
          <footer className="mission-footer">
  <span>MARS MISSION CONTROL</span>
  <span>DATA SOURCE: LOCAL CSV DATASET</span>
  <span>FILE: weather_data.csv</span>
  <span>
    LATEST SOL: {latest ? latest.sol : "--"}
  </span>
</footer>
        </>
      )}
    </main>
  );
  
}

export default App;
