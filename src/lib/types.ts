export interface WaterReading {
  id: string;
  village: string;
  ph: number;
  turbidity: number;
  temperature: number;
  timestamp: string;
}

export interface HealthReport {
  id: string;
  village: string;
  diarrheaCases: number;
  feverCases: number;
  vomitingCases: number;
  timestamp: string;
}

export interface RiskAssessment {
  village: string;
  level: "LOW" | "MEDIUM" | "HIGH";
  waterScore: number;
  healthScore: number;
  totalScore: number;
  timestamp: string;
}

export interface Alert {
  id: string;
  village: string;
  level: "MEDIUM" | "HIGH";
  message: string;
  timestamp: string;
  acknowledged: boolean;
}
