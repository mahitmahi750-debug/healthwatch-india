import { WaterReading, HealthReport, RiskAssessment, Alert } from "./types";

const VILLAGES = [
  "Majuli", "Mawlynnong", "Ziro", "Cherrapunji", "Haflong",
  "Tawang", "Mon", "Imphal East", "Ukhrul", "Champhai",
  "Aizawl South", "Tura", "Nongpoh", "Diphu", "Silchar"
];

export function generateSeedWaterReadings(): WaterReading[] {
  const readings: WaterReading[] = [];
  const now = Date.now();
  for (let i = 0; i < 30; i++) {
    const village = VILLAGES[Math.floor(Math.random() * VILLAGES.length)];
    readings.push({
      id: `wr-${i}`,
      village,
      ph: +(5.5 + Math.random() * 3.5).toFixed(1),
      turbidity: +(Math.random() * 15).toFixed(1),
      temperature: +(18 + Math.random() * 15).toFixed(1),
      timestamp: new Date(now - Math.random() * 7 * 86400000).toISOString(),
    });
  }
  return readings.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function generateSeedHealthReports(): HealthReport[] {
  const reports: HealthReport[] = [];
  const now = Date.now();
  for (let i = 0; i < 20; i++) {
    const village = VILLAGES[Math.floor(Math.random() * VILLAGES.length)];
    reports.push({
      id: `hr-${i}`,
      village,
      diarrheaCases: Math.floor(Math.random() * 25),
      feverCases: Math.floor(Math.random() * 20),
      vomitingCases: Math.floor(Math.random() * 15),
      timestamp: new Date(now - Math.random() * 7 * 86400000).toISOString(),
    });
  }
  return reports.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function predictRisk(waterReadings: WaterReading[], healthReports: HealthReport[], village: string): RiskAssessment {
  const villageWater = waterReadings.filter(r => r.village === village);
  const villageHealth = healthReports.filter(r => r.village === village);
  
  let waterScore = 0;
  if (villageWater.length > 0) {
    const latest = villageWater[0];
    if (latest.ph < 6.0 || latest.ph > 8.5) waterScore += 3;
    else if (latest.ph < 6.5 || latest.ph > 8.0) waterScore += 1;
    if (latest.turbidity > 10) waterScore += 3;
    else if (latest.turbidity > 5) waterScore += 1;
    if (latest.temperature > 30) waterScore += 2;
    else if (latest.temperature > 25) waterScore += 1;
  }

  let healthScore = 0;
  if (villageHealth.length > 0) {
    const latest = villageHealth[0];
    const totalCases = latest.diarrheaCases + latest.feverCases + latest.vomitingCases;
    if (totalCases > 30) healthScore += 4;
    else if (totalCases > 15) healthScore += 2;
    else if (totalCases > 5) healthScore += 1;
  }

  const totalScore = waterScore + healthScore;
  let level: "LOW" | "MEDIUM" | "HIGH";
  if (totalScore >= 6) level = "HIGH";
  else if (totalScore >= 3) level = "MEDIUM";
  else level = "LOW";

  return { village, level, waterScore, healthScore, totalScore, timestamp: new Date().toISOString() };
}

export function generateAlerts(assessments: RiskAssessment[]): Alert[] {
  return assessments
    .filter(a => a.level === "HIGH" || a.level === "MEDIUM")
    .map((a, i) => ({
      id: `alert-${Date.now()}-${i}`,
      village: a.village,
      level: a.level as "HIGH" | "MEDIUM",
      message: a.level === "HIGH"
        ? `⚠ High risk of water-borne disease detected in ${a.village}. Boil water before use. Seek medical attention if symptoms appear.`
        : `⚡ Moderate risk detected in ${a.village}. Monitor water quality and report any symptoms.`,
      timestamp: a.timestamp,
      acknowledged: false,
    }));
}

export function getUniqueVillages(waterReadings: WaterReading[], healthReports: HealthReport[]): string[] {
  const set = new Set<string>();
  waterReadings.forEach(r => set.add(r.village));
  healthReports.forEach(r => set.add(r.village));
  return Array.from(set).sort();
}

export { VILLAGES };
