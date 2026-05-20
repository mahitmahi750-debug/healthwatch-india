import { useApp } from "@/lib/store";
import { Fingerprint, ShieldCheck, QrCode, Copy } from "lucide-react";
import { toast } from "sonner";

const Identity = () => {
  const { tourists } = useApp();
  const sample = tourists[0];

  const copy = (t: string) => {
    navigator.clipboard.writeText(t);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-muted-foreground mb-2">
          <Fingerprint className="h-3 w-3 text-primary" /> Polygon · Verifiable Credentials
        </div>
        <h1 className="text-3xl font-bold">Blockchain <span className="text-gradient">Digital Identity</span></h1>
        <p className="text-sm text-muted-foreground mt-1">Tamper-proof tourist passes anchored on chain. Verifiable via QR by any authority.</p>
      </div>

      {sample && (
        <div className="grid lg:grid-cols-[1fr,360px] gap-6">
          <div className="glass rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center">
                  <ShieldCheck className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground tracking-wider">Verified Tourist Pass</div>
                  <div className="font-semibold">SafeTour NFT · #{sample.id}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <Row label="Holder" value={sample.name} />
                <Row label="Nationality" value={sample.nationality} />
                <Row label="Check-in" value={new Date(sample.checkInDate).toLocaleDateString()} />
                <Row label="Status" value={sample.status} />
                <Row label="Safety Score" value={`${sample.safetyScore}/100`} />
                <Row label="Emergency" value={sample.emergencyContact} />
              </div>

              <div className="mt-6 space-y-3">
                <HashRow label="Wallet Address" value={sample.blockchainId} onCopy={copy} />
                <HashRow label="Passport Hash (SHA-256)" value={sample.passportHash} onCopy={copy} />
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <div className="h-48 w-48 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 grid place-items-center">
              <QrCode className="h-32 w-32 text-primary" />
            </div>
            <div className="mt-4 font-medium">Scan to verify</div>
            <div className="text-xs text-muted-foreground mt-1">Any tourism officer, hotel, or police kiosk can verify in &lt;2s.</div>
            <div className="mt-4 text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))] border border-[hsl(var(--success)/0.3)]">
              ● Anchored on Polygon
            </div>
          </div>
        </div>
      )}

      <div className="glass rounded-2xl p-5">
        <h3 className="font-semibold mb-3">All Verified Identities</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr className="border-b border-border/50">
                <th className="text-left py-2 px-3">ID</th>
                <th className="text-left py-2 px-3">Name</th>
                <th className="text-left py-2 px-3">Nationality</th>
                <th className="text-left py-2 px-3">Wallet</th>
                <th className="text-left py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {tourists.slice(0, 12).map((t) => (
                <tr key={t.id} className="border-b border-border/30 hover:bg-secondary/30">
                  <td className="py-2 px-3 font-mono text-xs">{t.id}</td>
                  <td className="py-2 px-3">{t.name}</td>
                  <td className="py-2 px-3 text-muted-foreground">{t.nationality}</td>
                  <td className="py-2 px-3 font-mono text-xs text-muted-foreground">{t.blockchainId.slice(0, 22)}…</td>
                  <td className="py-2 px-3">
                    <span className="text-xs px-2 py-0.5 rounded-md bg-[hsl(var(--success)/0.1)] text-[hsl(var(--success))] border border-[hsl(var(--success)/0.3)]">
                      VERIFIED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-[10px] uppercase text-muted-foreground tracking-wider">{label}</div>
    <div className="font-medium">{value}</div>
  </div>
);

const HashRow = ({ label, value, onCopy }: { label: string; value: string; onCopy: (v: string) => void }) => (
  <div className="bg-secondary/50 rounded-lg px-3 py-2 flex items-center gap-2">
    <div className="flex-1 min-w-0">
      <div className="text-[10px] uppercase text-muted-foreground tracking-wider">{label}</div>
      <div className="font-mono text-xs truncate">{value}</div>
    </div>
    <button onClick={() => onCopy(value)} className="text-muted-foreground hover:text-primary p-1">
      <Copy className="h-3.5 w-3.5" />
    </button>
  </div>
);

export default Identity;
