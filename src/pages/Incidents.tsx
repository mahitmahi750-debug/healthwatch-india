import { useApp } from "@/lib/store";
import RiskBadge from "@/components/RiskBadge";

const Incidents = () => {
  const { incidents, updateIncident } = useApp();
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Incident <span className="text-gradient">Console</span></h1>
      <p className="text-sm text-muted-foreground">Live AI-classified incidents. Update status as responders engage.</p>
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="text-left py-3 px-4">ID</th>
              <th className="text-left py-3 px-4">Type</th>
              <th className="text-left py-3 px-4">Severity</th>
              <th className="text-left py-3 px-4">Location</th>
              <th className="text-left py-3 px-4">Time</th>
              <th className="text-left py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((i) => (
              <tr key={i.id} className="border-t border-border/40 hover:bg-secondary/30">
                <td className="py-3 px-4 font-mono text-xs">{i.id}</td>
                <td className="py-3 px-4">{i.type}</td>
                <td className="py-3 px-4"><RiskBadge level={i.severity} /></td>
                <td className="py-3 px-4 text-muted-foreground">{i.location.place}</td>
                <td className="py-3 px-4 text-xs text-muted-foreground">{new Date(i.timestamp).toLocaleString()}</td>
                <td className="py-3 px-4">
                  <select
                    value={i.status}
                    onChange={(e) => updateIncident(i.id, { status: e.target.value as any })}
                    className="bg-secondary border border-border rounded-md text-xs px-2 py-1"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="DISPATCHED">DISPATCHED</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Incidents;
