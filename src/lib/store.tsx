import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { WaterReading, HealthReport, RiskAssessment, Alert } from "./types";
import {
  generateSeedWaterReadings,
  generateSeedHealthReports,
  predictRisk,
  generateAlerts,
  getUniqueVillages,
} from "./data";

interface AppState {
  waterReadings: WaterReading[];
  healthReports: HealthReport[];
  riskAssessments: RiskAssessment[];
  alerts: Alert[];
  addWaterReading: (r: Omit<WaterReading, "id" | "timestamp">) => void;
  addHealthReport: (r: Omit<HealthReport, "id" | "timestamp">) => void;
  acknowledgeAlert: (id: string) => void;
  refreshRisks: () => void;
}

const AppContext = createContext<AppState | null>(null);

function load<T>(key: string, fallback: () => T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch {}
  return fallback();
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [waterReadings, setWaterReadings] = useState<WaterReading[]>(() =>
    load("water_readings", generateSeedWaterReadings)
  );
  const [healthReports, setHealthReports] = useState<HealthReport[]>(() =>
    load("health_reports", generateSeedHealthReports)
  );
  const [alerts, setAlerts] = useState<Alert[]>(() => load("alerts", () => []));
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);

  const refreshRisks = useCallback(() => {
    const villages = getUniqueVillages(waterReadings, healthReports);
    const assessments = villages.map(v => predictRisk(waterReadings, healthReports, v));
    setRiskAssessments(assessments);
    const newAlerts = generateAlerts(assessments);
    if (newAlerts.length > 0) {
      setAlerts(prev => {
        const existing = new Set(prev.map(a => a.village + a.level));
        const fresh = newAlerts.filter(a => !existing.has(a.village + a.level));
        return [...fresh, ...prev].slice(0, 100);
      });
    }
  }, [waterReadings, healthReports]);

  useEffect(() => { refreshRisks(); }, [refreshRisks]);

  useEffect(() => { localStorage.setItem("water_readings", JSON.stringify(waterReadings)); }, [waterReadings]);
  useEffect(() => { localStorage.setItem("health_reports", JSON.stringify(healthReports)); }, [healthReports]);
  useEffect(() => { localStorage.setItem("alerts", JSON.stringify(alerts)); }, [alerts]);

  const addWaterReading = (r: Omit<WaterReading, "id" | "timestamp">) => {
    const reading: WaterReading = { ...r, id: `wr-${Date.now()}`, timestamp: new Date().toISOString() };
    setWaterReadings(prev => [reading, ...prev]);
  };

  const addHealthReport = (r: Omit<HealthReport, "id" | "timestamp">) => {
    const report: HealthReport = { ...r, id: `hr-${Date.now()}`, timestamp: new Date().toISOString() };
    setHealthReports(prev => [report, ...prev]);
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  return (
    <AppContext.Provider value={{ waterReadings, healthReports, riskAssessments, alerts, addWaterReading, addHealthReport, acknowledgeAlert, refreshRisks }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppData must be used within AppProvider");
  return ctx;
}
