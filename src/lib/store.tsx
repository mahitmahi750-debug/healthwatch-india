import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Incident, Tourist } from "./types";
import { generateIncidents, generateTourists } from "./data";

interface AppState {
  tourists: Tourist[];
  incidents: Incident[];
  addIncident: (inc: Incident) => void;
  updateIncident: (id: string, patch: Partial<Incident>) => void;
  resetSeed: () => void;
}

const Ctx = createContext<AppState | null>(null);
const LS_T = "sts.tourists.v1";
const LS_I = "sts.incidents.v1";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [tourists, setTourists] = useState<Tourist[]>(() => {
    try {
      const raw = localStorage.getItem(LS_T);
      if (raw) return JSON.parse(raw);
    } catch {}
    return generateTourists(28);
  });
  const [incidents, setIncidents] = useState<Incident[]>(() => {
    try {
      const raw = localStorage.getItem(LS_I);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });

  // seed incidents once we have tourists
  useEffect(() => {
    if (incidents.length === 0 && tourists.length) {
      setIncidents(generateIncidents(tourists, 12));
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    localStorage.setItem(LS_T, JSON.stringify(tourists));
  }, [tourists]);
  useEffect(() => {
    localStorage.setItem(LS_I, JSON.stringify(incidents));
  }, [incidents]);

  const value = useMemo<AppState>(
    () => ({
      tourists,
      incidents,
      addIncident: (inc) => setIncidents((prev) => [inc, ...prev]),
      updateIncident: (id, patch) =>
        setIncidents((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i))),
      resetSeed: () => {
        const t = generateTourists(28);
        setTourists(t);
        setIncidents(generateIncidents(t, 12));
      },
    }),
    [tourists, incidents]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useApp = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used within AppProvider");
  return v;
};
