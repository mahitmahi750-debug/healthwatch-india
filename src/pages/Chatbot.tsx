import { useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";

const SAMPLE_QA: Record<string, string> = {
  weather: "Cherrapunji is under a HIGH flash flood advisory for the next 24h. I recommend rescheduling waterfall treks and staying within Shillong city limits.",
  safe: "Currently safe zones near you: Shillong (LOW risk), Gangtok corridor (LOW risk), and Kaziranga main reserve trails (escorted).",
  hospital: "Nearest verified hospitals: Shillong Civil Hospital (3.2 km), Guwahati Medical College (98 km). Both accept tourist insurance.",
  default: "I'm your AI travel safety assistant. Ask me about safe routes, nearby hospitals, weather risk, or emergency procedures.",
};

const Chatbot = () => {
  const [msgs, setMsgs] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "Hello traveler! 👋 I monitor live safety data across Northeast India. How can I help today?" },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    const q = input.trim();
    const key = Object.keys(SAMPLE_QA).find((k) => q.toLowerCase().includes(k));
    const reply = SAMPLE_QA[key || "default"];
    setMsgs((m) => [...m, { role: "user", text: q }, { role: "bot", text: reply }]);
    setInput("");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-muted-foreground mb-2">
          <Sparkles className="h-3 w-3 text-primary" /> Multilingual · Geo-aware
        </div>
        <h1 className="text-3xl font-bold">AI <span className="text-gradient">Travel Assistant</span></h1>
      </div>

      <div className="glass rounded-2xl p-4 h-[60vh] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {msgs.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "bot" && (
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center shrink-0">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              <div className={`px-3.5 py-2.5 rounded-2xl max-w-[75%] text-sm ${
                m.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary rounded-bl-sm"
              }`}>{m.text}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask about safety, weather, hospitals…"
            className="flex-1 bg-secondary/60 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
          />
          <button onClick={send} className="px-4 rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground hover:opacity-90">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {["What's the weather risk?", "Show me safe areas", "Find nearest hospital"].map((s) => (
          <button key={s} onClick={() => setInput(s)} className="text-xs px-3 py-1.5 rounded-full glass hover:border-primary/40">{s}</button>
        ))}
      </div>
    </div>
  );
};

export default Chatbot;
