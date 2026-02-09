import { useState } from "react";
import { useAppData } from "@/lib/store";
import { VILLAGES } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Droplets, Plus } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

export default function WaterData() {
  const { waterReadings, addWaterReading } = useAppData();
  const [village, setVillage] = useState("");
  const [ph, setPh] = useState("");
  const [turbidity, setTurbidity] = useState("");
  const [temperature, setTemperature] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!village || !ph || !turbidity || !temperature) return;
    const phVal = parseFloat(ph);
    const turbVal = parseFloat(turbidity);
    const tempVal = parseFloat(temperature);
    if (isNaN(phVal) || isNaN(turbVal) || isNaN(tempVal)) return;
    if (phVal < 0 || phVal > 14) { toast({ title: "Invalid pH", description: "pH must be between 0-14", variant: "destructive" }); return; }
    if (turbVal < 0 || turbVal > 100) { toast({ title: "Invalid turbidity", description: "Turbidity must be 0-100 NTU", variant: "destructive" }); return; }

    addWaterReading({ village, ph: phVal, turbidity: turbVal, temperature: tempVal });
    toast({ title: "Reading added", description: `Water quality data for ${village} recorded.` });
    setPh(""); setTurbidity(""); setTemperature(""); setVillage("");
    setShowForm(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Droplets className="h-6 w-6 text-primary" /> Water Quality Data</h1>
          <p className="text-muted-foreground text-sm mt-1">Monitor and record water quality readings from village sources</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="sm" className="gap-1">
          <Plus className="h-4 w-4" /> Add Reading
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-sm">New Water Quality Reading</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="village">Village</Label>
              <Select value={village} onValueChange={setVillage}>
                <SelectTrigger><SelectValue placeholder="Select village" /></SelectTrigger>
                <SelectContent>{VILLAGES.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ph">pH Level (0-14)</Label>
              <Input id="ph" type="number" step="0.1" min="0" max="14" value={ph} onChange={e => setPh(e.target.value)} placeholder="e.g. 7.2" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="turbidity">Turbidity (NTU)</Label>
              <Input id="turbidity" type="number" step="0.1" min="0" max="100" value={turbidity} onChange={e => setTurbidity(e.target.value)} placeholder="e.g. 4.5" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="temp">Temperature (°C)</Label>
              <Input id="temp" type="number" step="0.1" value={temperature} onChange={e => setTemperature(e.target.value)} placeholder="e.g. 25" />
            </div>
          </div>
          <Button type="submit">Save Reading</Button>
        </form>
      )}

      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-3">Recent Readings ({waterReadings.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Village</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">pH</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Turbidity</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium hidden sm:table-cell">Temp (°C)</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {waterReadings.slice(0, 20).map(r => {
                const phDanger = r.ph < 6.0 || r.ph > 8.5;
                const turbDanger = r.turbidity > 10;
                return (
                  <tr key={r.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-2 px-3 font-medium">{r.village}</td>
                    <td className={`py-2 px-3 ${phDanger ? "text-destructive font-semibold" : ""}`}>{r.ph}</td>
                    <td className={`py-2 px-3 ${turbDanger ? "text-destructive font-semibold" : ""}`}>{r.turbidity} NTU</td>
                    <td className="py-2 px-3 hidden sm:table-cell">{r.temperature}°</td>
                    <td className="py-2 px-3 text-muted-foreground">{format(new Date(r.timestamp), "dd MMM, HH:mm")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
