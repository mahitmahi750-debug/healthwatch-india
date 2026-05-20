import { GeoZone, Incident, RiskLevel, SafetyService, Tourist } from "./types";

// Centered around Northeast India (Shillong / Guwahati / Tawang corridor)
const PLACES = [
  { place: "Shillong, Meghalaya", lat: 25.5788, lng: 91.8933 },
  { place: "Guwahati, Assam", lat: 26.1445, lng: 91.7362 },
  { place: "Tawang, Arunachal Pradesh", lat: 27.5859, lng: 91.8594 },
  { place: "Kaziranga National Park", lat: 26.5775, lng: 93.1714 },
  { place: "Cherrapunji, Meghalaya", lat: 25.2702, lng: 91.7323 },
  { place: "Imphal, Manipur", lat: 24.817, lng: 93.9368 },
  { place: "Aizawl, Mizoram", lat: 23.7271, lng: 92.7176 },
  { place: "Kohima, Nagaland", lat: 25.6701, lng: 94.1077 },
  { place: "Gangtok, Sikkim", lat: 27.3389, lng: 88.6065 },
  { place: "Agartala, Tripura", lat: 23.8315, lng: 91.2868 },
];

const NATIONALITIES = ["Indian", "USA", "UK", "Germany", "Japan", "France", "Australia", "Canada", "Singapore", "UAE"];
const FIRST = ["Arjun", "Maya", "Liam", "Sophia", "Yuki", "Hans", "Chloe", "Noah", "Aanya", "Marco", "Priya", "Olivia", "Kenji", "Emma", "Ravi"];
const LAST = ["Sharma", "Patel", "Smith", "Müller", "Tanaka", "Dubois", "Brown", "Khan", "Singh", "Rossi", "Lee", "Garcia"];

const rand = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const pad = (n: number) => n.toString(16).padStart(2, "0");
const hash = (len = 40) => "0x" + Array.from({ length: len }, () => pad(Math.floor(Math.random() * 256))).join("").slice(0, len);

export const generateTourists = (n = 24): Tourist[] => {
  return Array.from({ length: n }).map((_, i) => {
    const p = rand(PLACES);
    const jitter = () => (Math.random() - 0.5) * 0.4;
    const safety = Math.round(40 + Math.random() * 60);
    const status: Tourist["status"] =
      safety < 50 ? (Math.random() > 0.7 ? "SOS" : "ALERT") : "ACTIVE";
    return {
      id: `T-${1000 + i}`,
      name: `${rand(FIRST)} ${rand(LAST)}`,
      nationality: rand(NATIONALITIES),
      passportHash: hash(64),
      blockchainId: hash(40),
      checkInDate: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
      location: { lat: p.lat + jitter(), lng: p.lng + jitter(), place: p.place },
      safetyScore: safety,
      status,
      emergencyContact: `+91 9${Math.floor(100000000 + Math.random() * 899999999)}`,
    };
  });
};

export const GEO_ZONES: GeoZone[] = [
  { id: "z1", name: "Cherrapunji Flash Flood Zone", center: { lat: 25.2702, lng: 91.7323 }, radiusKm: 8, riskLevel: "HIGH", category: "WEATHER", description: "Heavy monsoon rainfall — flash flood risk in next 24h." },
  { id: "z2", name: "Tawang High-Altitude Advisory", center: { lat: 27.5859, lng: 91.8594 }, radiusKm: 12, riskLevel: "MEDIUM", category: "WEATHER", description: "Snowfall + low oxygen above 3000m. Carry medical kit." },
  { id: "z3", name: "Kaziranga Wildlife Buffer", center: { lat: 26.5775, lng: 93.1714 }, radiusKm: 6, riskLevel: "MEDIUM", category: "RESTRICTED", description: "Off-trail movement prohibited — wildlife encounter risk." },
  { id: "z4", name: "Imphal Border Sensitive Zone", center: { lat: 24.817, lng: 93.9368 }, radiusKm: 10, riskLevel: "HIGH", category: "CRIME", description: "Travel advisory — escorted convoys recommended after dusk." },
  { id: "z5", name: "Shillong Tourist Safe Zone", center: { lat: 25.5788, lng: 91.8933 }, radiusKm: 5, riskLevel: "LOW", category: "SAFE", description: "Active police patrols, 24/7 tourist helpdesk." },
  { id: "z6", name: "Guwahati Festival Crowd", center: { lat: 26.1445, lng: 91.7362 }, radiusKm: 3, riskLevel: "MEDIUM", category: "CROWD", description: "High crowd density — pickpocket alerts active." },
  { id: "z7", name: "Gangtok Safe Corridor", center: { lat: 27.3389, lng: 88.6065 }, radiusKm: 4, riskLevel: "LOW", category: "SAFE", description: "Verified tourism circuit with patrols." },
];

export const SAFETY_SERVICES: SafetyService[] = [
  { id: "s1", name: "Shillong Civil Hospital", type: "HOSPITAL", location: { lat: 25.572, lng: 91.886 }, phone: "108" },
  { id: "s2", name: "Guwahati Medical College", type: "HOSPITAL", location: { lat: 26.155, lng: 91.768 }, phone: "108" },
  { id: "s3", name: "Tawang District Hospital", type: "HOSPITAL", location: { lat: 27.586, lng: 91.86 }, phone: "108" },
  { id: "s4", name: "Shillong Sadar Police", type: "POLICE", location: { lat: 25.581, lng: 91.893 }, phone: "112" },
  { id: "s5", name: "Imphal West Police HQ", type: "POLICE", location: { lat: 24.815, lng: 93.935 }, phone: "112" },
  { id: "s6", name: "Kaziranga Tourist Helpdesk", type: "TOURIST_HELP", location: { lat: 26.577, lng: 93.171 }, phone: "1363" },
  { id: "s7", name: "Cherrapunji Relief Shelter", type: "SHELTER", location: { lat: 25.271, lng: 91.733 }, phone: "1077" },
];

export const generateIncidents = (tourists: Tourist[], n = 10): Incident[] => {
  const TYPES: Incident["type"][] = ["SOS", "THEFT", "MEDICAL", "ACCIDENT", "HARASSMENT", "LOST", "WEATHER"];
  return Array.from({ length: n }).map((_, i) => {
    const t = rand(tourists);
    const type = rand(TYPES);
    const severity: RiskLevel = type === "SOS" || type === "ACCIDENT" ? "HIGH" : type === "LOST" ? "LOW" : "MEDIUM";
    return {
      id: `INC-${2000 + i}`,
      type,
      severity,
      touristId: t.id,
      location: { ...t.location },
      description: `${type} reported near ${t.location.place}`,
      status: Math.random() > 0.6 ? "RESOLVED" : Math.random() > 0.5 ? "DISPATCHED" : "OPEN",
      timestamp: new Date(Date.now() - Math.random() * 3 * 86400000).toISOString(),
      blockchainTx: hash(64),
    };
  });
};

export const computeFleetStats = (tourists: Tourist[]) => {
  const total = tourists.length;
  const active = tourists.filter((t) => t.status === "ACTIVE").length;
  const alert = tourists.filter((t) => t.status === "ALERT").length;
  const sos = tourists.filter((t) => t.status === "SOS").length;
  const avgSafety = total ? Math.round(tourists.reduce((a, t) => a + t.safetyScore, 0) / total) : 0;
  return { total, active, alert, sos, avgSafety };
};

export const riskColor = (level: RiskLevel) =>
  level === "HIGH" ? "hsl(var(--risk-high))" : level === "MEDIUM" ? "hsl(var(--risk-medium))" : "hsl(var(--risk-low))";

export const NE_CENTER: [number, number] = [26.2, 92.0];
