const About = () => (
  <div className="max-w-3xl space-y-4">
    <h1 className="text-3xl font-bold">About <span className="text-gradient">SafeTour.AI</span></h1>
    <p className="text-muted-foreground">
      A unified intelligence layer for tourism safety in Northeast India — combining geo-fenced AI risk monitoring,
      real-time incident response, multilingual assistance, and blockchain-anchored digital identity.
    </p>
    <div className="glass rounded-2xl p-5 space-y-2 text-sm">
      <div><strong>Frontend:</strong> React + Tailwind + ShadCN + Leaflet + Recharts</div>
      <div><strong>Maps:</strong> OpenStreetMap (no key required)</div>
      <div><strong>Persistence:</strong> Local storage (demo). Production target: Lovable Cloud (Postgres + edge functions).</div>
      <div><strong>AI:</strong> Pluggable via Lovable AI Gateway (Gemini / GPT) for risk classification, chatbot, sentiment.</div>
      <div><strong>Blockchain:</strong> Simulated hashes & wallet IDs (production target: Polygon smart contracts).</div>
    </div>
    <p className="text-xs text-muted-foreground">
      This is a working prototype. Real-time SOS dispatch, on-chain anchoring, and IoT/wearable ingestion can be wired
      in next steps via Lovable Cloud edge functions.
    </p>
  </div>
);

export default About;
