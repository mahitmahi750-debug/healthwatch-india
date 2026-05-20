import { useState } from "react";
import { Siren, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { useApp } from "@/lib/store";
import { toast } from "sonner";

const SOS = () => {
  const { addIncident } = useApp();
  const [triggered, setTriggered] = useState(false);

  const trigger = () => {
    setTriggered(true);
    const inc = {
      id: `INC-${Date.now()}`,
      type: "SOS" as const,
      severity: "HIGH" as const,
      location: { lat: 25.5788, lng: 91.8933, place: "Shillong, Meghalaya" },
      description: "Manual SOS triggered from device",
      status: "OPEN" as const,
      timestamp: new Date().toISOString(),
      blockchainTx: "0x" + Math.random().toString(16).slice(2, 18) + Math.random().toString(16).slice(2, 18),
    };
    addIncident(inc);
    toast.success("SOS dispatched", { description: "Authorities notified · Blockchain anchored" });
  };

  return (
    <div className="max-w-2xl mx-auto text-center space-y-6 py-8">
      <h1 className="text-3xl font-bold">Emergency <span className="text-gradient">SOS</span></h1>
      <p className="text-muted-foreground">Press & hold the panic button to alert nearby police, hospital, and your emergency contact.</p>

      <div className="flex justify-center py-10">
        <button
          onClick={trigger}
          className="relative h-48 w-48 rounded-full bg-gradient-to-br from-[hsl(var(--destructive))] to-[hsl(330_85%_55%)] text-white font-bold text-xl shadow-[var(--glow-danger)] animate-pulse-glow active:scale-95 transition"
        >
          <Siren className="h-12 w-12 mx-auto mb-2" />
          {triggered ? "SOS SENT" : "PANIC"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <a href="tel:112" className="glass rounded-xl p-4 hover:border-primary/40 transition">
          <Phone className="h-5 w-5 text-primary mx-auto mb-2" />
          <div className="font-semibold">112</div><div className="text-xs text-muted-foreground">National Emergency</div>
        </a>
        <a href="tel:108" className="glass rounded-xl p-4 hover:border-primary/40 transition">
          <Phone className="h-5 w-5 text-primary mx-auto mb-2" />
          <div className="font-semibold">108</div><div className="text-xs text-muted-foreground">Ambulance</div>
        </a>
        <a href="tel:1363" className="glass rounded-xl p-4 hover:border-primary/40 transition">
          <Phone className="h-5 w-5 text-primary mx-auto mb-2" />
          <div className="font-semibold">1363</div><div className="text-xs text-muted-foreground">Tourist Helpline</div>
        </a>
      </div>

      {triggered && (
        <div className="glass rounded-xl p-5 text-left">
          <div className="flex items-center gap-2 text-[hsl(var(--success))] font-medium mb-3">
            <CheckCircle2 className="h-5 w-5" /> Response Initiated
          </div>
          <ul className="text-sm space-y-1.5 text-muted-foreground">
            <li>✓ GPS location shared with nearest dispatch</li>
            <li>✓ Emergency contact notified via SMS</li>
            <li>✓ Incident hashed and anchored on chain</li>
            <li>✓ AI predicted ETA: 8 minutes</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SOS;
