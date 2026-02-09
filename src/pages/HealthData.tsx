import { useState } from "react";
import { useAppData } from "@/lib/store";
import { VILLAGES } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HeartPulse, Plus } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

export default function HealthData() {
  const { healthReports, addHealthReport } = useAppData();
  const [village, setVillage] = useState("");
  const [diarrhea, setDiarrhea] = useState("");
  const [fever, setFever] = useState("");
  const [vomiting, setVomiting] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!village) return;
    const d = parseInt(diarrhea) || 0;
    const f = parseInt(fever) || 0;
    const v = parseInt(vomiting) || 0;
    if (d < 0 || f < 0 || v < 0) return;

    addHealthReport({ village, diarrheaCases: d, feverCases: f, vomitingCases: v });
    toast({ title: "Report submitted", description: `Health data for ${village} recorded.` });
    setDiarrhea(""); setFever(""); setVomiting(""); setVillage("");
    setShowForm(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><HeartPulse className="h-6 w-6 text-primary" /> Community Health Data</h1>
          <p className="text-muted-foreground text-sm mt-1">Report symptom cases from health workers in the field</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="sm" className="gap-1">
          <Plus className="h-4 w-4" /> Add Report
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-sm">New Health Report</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Village</Label>
              <Select value={village} onValueChange={setVillage}>
                <SelectTrigger><SelectValue placeholder="Select village" /></SelectTrigger>
                <SelectContent>{VILLAGES.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Diarrhea Cases</Label>
              <Input type="number" min="0" value={diarrhea} onChange={e => setDiarrhea(e.target.value)} placeholder="0" />
            </div>
            <div className="space-y-1.5">
              <Label>Fever Cases</Label>
              <Input type="number" min="0" value={fever} onChange={e => setFever(e.target.value)} placeholder="0" />
            </div>
            <div className="space-y-1.5">
              <Label>Vomiting Cases</Label>
              <Input type="number" min="0" value={vomiting} onChange={e => setVomiting(e.target.value)} placeholder="0" />
            </div>
          </div>
          <Button type="submit">Submit Report</Button>
        </form>
      )}

      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-3">Recent Reports ({healthReports.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Village</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Diarrhea</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Fever</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Vomiting</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium hidden sm:table-cell">Total</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {healthReports.slice(0, 20).map(r => {
                const total = r.diarrheaCases + r.feverCases + r.vomitingCases;
                return (
                  <tr key={r.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-2 px-3 font-medium">{r.village}</td>
                    <td className="py-2 px-3">{r.diarrheaCases}</td>
                    <td className="py-2 px-3">{r.feverCases}</td>
                    <td className="py-2 px-3">{r.vomitingCases}</td>
                    <td className={`py-2 px-3 hidden sm:table-cell font-semibold ${total > 30 ? "text-destructive" : total > 15 ? "text-warning" : ""}`}>{total}</td>
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
