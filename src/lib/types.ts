export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface Tourist {
  id: string;
  name: string;
  nationality: string;
  passportHash: string; // simulated blockchain hash
  blockchainId: string; // e.g. 0x... tx hash
  checkInDate: string;
  location: { lat: number; lng: number; place: string };
  safetyScore: number; // 0-100
  status: "ACTIVE" | "ALERT" | "SOS" | "CHECKED_OUT";
  emergencyContact: string;
}

export interface GeoZone {
  id: string;
  name: string;
  center: { lat: number; lng: number };
  radiusKm: number;
  riskLevel: RiskLevel;
  category: "RESTRICTED" | "WEATHER" | "CROWD" | "CRIME" | "SAFE";
  description: string;
}

export interface Incident {
  id: string;
  type: "SOS" | "THEFT" | "MEDICAL" | "ACCIDENT" | "HARASSMENT" | "LOST" | "WEATHER";
  severity: RiskLevel;
  touristId?: string;
  location: { lat: number; lng: number; place: string };
  description: string;
  status: "OPEN" | "DISPATCHED" | "RESOLVED";
  timestamp: string;
  blockchainTx?: string;
}

export interface SafetyService {
  id: string;
  name: string;
  type: "HOSPITAL" | "POLICE" | "SHELTER" | "TOURIST_HELP";
  location: { lat: number; lng: number };
  phone: string;
}
