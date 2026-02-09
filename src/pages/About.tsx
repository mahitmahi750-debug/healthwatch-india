import { Droplets, HeartPulse, AlertTriangle, Cpu, Globe } from "lucide-react";

export default function About() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">About This System</h1>
        <p className="text-muted-foreground text-sm mt-1">Smart Community Health Monitoring & Early Warning System</p>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Project Overview</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          This system is designed to provide low-cost, scalable digital health monitoring for rural communities
          in Northeast India. It tracks water quality parameters and community health symptoms to predict and
          provide early warnings for water-borne disease outbreaks such as cholera, typhoid, and dysentery.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { icon: Droplets, title: "Water Monitoring", desc: "Track pH, turbidity, and temperature from village water sources with IoT-compatible data entry." },
          { icon: HeartPulse, title: "Health Tracking", desc: "Field health workers report symptom cases including diarrhea, fever, and vomiting per village." },
          { icon: AlertTriangle, title: "Early Warnings", desc: "Automated risk assessment engine triggers alerts when disease outbreak risk is elevated." },
          { icon: Cpu, title: "Risk Prediction", desc: "Rule-based ML-simulated engine analyzes water quality and symptom data to predict outbreak risk." },
        ].map(item => (
          <div key={item.title} className="glass-card rounded-xl p-5 space-y-2">
            <item.icon className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-sm">{item.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-6 space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2"><Globe className="h-5 w-5 text-primary" /> Target Region</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Northeast India — covering states like Assam, Meghalaya, Nagaland, Manipur, Mizoram, Tripura, Arunachal Pradesh, and Sikkim.
          These regions face unique challenges with water-borne diseases due to geographical isolation, high rainfall,
          and limited healthcare infrastructure in rural areas.
        </p>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-2">
        <h2 className="text-lg font-semibold">Technology Stack</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {["React.js", "TypeScript", "Tailwind CSS", "Recharts", "Rule-based ML", "localStorage"].map(t => (
            <span key={t} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">{t}</span>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center pb-4">
        Built for rural community health resilience • Demo v1.0
      </p>
    </div>
  );
}
