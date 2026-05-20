import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Circle, Popup, LayersControl } from "react-leaflet";
import L from "leaflet";
import { useApp } from "@/lib/store";
import { GEO_ZONES, NE_CENTER, SAFETY_SERVICES, riskColor } from "@/lib/data";
import RiskBadge from "@/components/RiskBadge";
import { Hospital, Shield, Tent, Info, Filter, MapPin, Siren } from "lucide-react";

// fix default icon paths in vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const touristIcon = (status: string) => {
  const color = status === "SOS" ? "#ef4444" : status === "ALERT" ? "#f59e0b" : "#22d3ee";
  return L.divIcon({
    className: "",
    html: `<div style="position:relative">
      <div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #0a0e1a;box-shadow:0 0 12px ${color}"></div>
      ${status === "SOS" ? `<div style="position:absolute;inset:-6px;border:2px solid ${color};border-radius:50%;animation:pulse-glow 1.5s infinite"></div>` : ""}
    </div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
};

const serviceIcon = (type: string) => {
  const map: Record<string, string> = {
    HOSPITAL: "#22d3ee",
    POLICE: "#a78bfa",
    SHELTER: "#34d399",
    TOURIST_HELP: "#fbbf24",
  };
  const c = map[type] || "#94a3b8";
  return L.divIcon({
    className: "",
    html: `<div style="width:18px;height:18px;border-radius:6px;background:${c}22;border:1.5px solid ${c};display:grid;place-items:center;font-size:10px;color:${c};font-weight:700">${type[0]}</div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
};

const SafetyMap = () => {
  const { tourists } = useApp();
  const [showZones, setShowZones] = useState(true);
  const [showServices, setShowServices] = useState(true);
  const [showTourists, setShowTourists] = useState(true);
  const [riskFilter, setRiskFilter] = useState<"ALL" | "HIGH" | "MEDIUM" | "LOW">("ALL");

  const filteredZones = useMemo(
    () => GEO_ZONES.filter((z) => riskFilter === "ALL" || z.riskLevel === riskFilter),
    [riskFilter]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-muted-foreground mb-2">
            <MapPin className="h-3 w-3 text-primary" /> Geo-Friendly Intelligence
          </div>
          <h1 className="text-3xl font-bold">AI <span className="text-gradient">Safety Map</span></h1>
          <p className="text-sm text-muted-foreground mt-1">
            Live tourist positions, geo-fenced risk zones, and nearby emergency services.
          </p>
        </div>

        <div className="glass rounded-xl p-3 flex flex-wrap items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-muted-foreground"><Filter className="h-3 w-3" /> Layers:</span>
          {[
            ["Zones", showZones, setShowZones],
            ["Services", showServices, setShowServices],
            ["Tourists", showTourists, setShowTourists],
          ].map(([label, val, set]: any) => (
            <button
              key={label}
              onClick={() => set(!val)}
              className={`px-2.5 py-1 rounded-md border transition ${
                val ? "bg-primary/15 border-primary/40 text-primary" : "border-border text-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
          <span className="h-4 w-px bg-border" />
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as any)}
            className="bg-secondary/60 border border-border rounded-md px-2 py-1 text-xs"
          >
            <option value="ALL">All risk</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 glass rounded-2xl overflow-hidden border border-border/60" style={{ height: "70vh", minHeight: 520 }}>
          <MapContainer center={NE_CENTER} zoom={7} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
            <LayersControl position="topright">
              <LayersControl.BaseLayer checked name="Dark">
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>
            </LayersControl>

            {showZones &&
              filteredZones.map((z) => (
                <Circle
                  key={z.id}
                  center={[z.center.lat, z.center.lng]}
                  radius={z.radiusKm * 1000}
                  pathOptions={{
                    color: riskColor(z.riskLevel),
                    fillColor: riskColor(z.riskLevel),
                    fillOpacity: 0.12,
                    weight: 1.5,
                  }}
                >
                  <Popup>
                    <div className="space-y-1">
                      <div className="font-semibold text-sm">{z.name}</div>
                      <div className="text-xs">{z.description}</div>
                      <div className="text-[10px] uppercase">{z.category}</div>
                    </div>
                  </Popup>
                </Circle>
              ))}

            {showServices &&
              SAFETY_SERVICES.map((s) => (
                <Marker key={s.id} position={[s.location.lat, s.location.lng]} icon={serviceIcon(s.type)}>
                  <Popup>
                    <div className="space-y-1">
                      <div className="font-semibold text-sm">{s.name}</div>
                      <div className="text-xs uppercase text-gray-500">{s.type}</div>
                      <div className="text-xs">📞 {s.phone}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}

            {showTourists &&
              tourists.map((t) => (
                <Marker key={t.id} position={[t.location.lat, t.location.lng]} icon={touristIcon(t.status)}>
                  <Popup>
                    <div className="space-y-1">
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-xs">🌍 {t.nationality} · {t.location.place}</div>
                      <div className="text-xs">Safety: <strong>{t.safetyScore}/100</strong></div>
                      <div className="text-xs">Status: <strong>{t.status}</strong></div>
                      <div className="text-[10px] font-mono mt-1 text-gray-500">{t.blockchainId.slice(0, 18)}…</div>
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>

        <aside className="space-y-4">
          <div className="glass rounded-2xl p-4">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Info className="h-4 w-4 text-primary" /> Map Legend</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#22d3ee] shadow-[0_0_8px_#22d3ee]" /> Active tourist</div>
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#f59e0b]" /> Alert state</div>
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#ef4444] animate-pulse" /> SOS active</div>
              <div className="h-px bg-border my-2" />
              <div className="flex items-center gap-2"><Hospital className="h-3.5 w-3.5 text-primary" /> Hospital</div>
              <div className="flex items-center gap-2"><Shield className="h-3.5 w-3.5 text-accent" /> Police</div>
              <div className="flex items-center gap-2"><Tent className="h-3.5 w-3.5 text-[hsl(var(--success))]" /> Shelter</div>
            </div>
          </div>

          <div className="glass rounded-2xl p-4">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Siren className="h-4 w-4 text-[hsl(var(--destructive))]" /> Active Risk Zones</h3>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {filteredZones.map((z) => (
                <div key={z.id} className="p-2.5 rounded-lg bg-secondary/50 border border-border/50">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-medium">{z.name}</div>
                    <RiskBadge level={z.riskLevel} />
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">{z.description}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SafetyMap;
