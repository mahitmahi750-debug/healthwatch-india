import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Map as MapIcon,
  ShieldAlert,
  Siren,
  Bot,
  Fingerprint,
  Settings2,
  Users,
  Activity,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { computeFleetStats } from "@/lib/data";

const NAV = [
  { to: "/", label: "Command Center", icon: LayoutDashboard },
  { to: "/map", label: "AI Safety Map", icon: MapIcon },
  { to: "/incidents", label: "Incidents", icon: ShieldAlert },
  { to: "/sos", label: "Emergency SOS", icon: Siren },
  { to: "/chatbot", label: "AI Assistant", icon: Bot },
  { to: "/identity", label: "Blockchain ID", icon: Fingerprint },
  { to: "/admin", label: "Admin Panel", icon: Users },
  { to: "/about", label: "About", icon: Settings2 },
];

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { tourists } = useApp();
  const stats = computeFleetStats(tourists);

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
        <div className="px-6 py-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center shadow-[var(--glow-primary)]">
              <ShieldAlert className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-wide text-gradient">SAFETOUR.AI</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Tourism Safety Grid
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.3)]"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight className="h-3.5 w-3.5 text-primary" />}
              </NavLink>
            );
          })}
        </nav>

        <div className="m-3 p-4 rounded-xl glass">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <Activity className="h-3.5 w-3.5 text-primary animate-pulse" />
            LIVE FLEET STATUS
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-semibold text-foreground">{stats.active}</div>
              <div className="text-[10px] uppercase text-muted-foreground">Safe</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-[hsl(var(--warning))]">{stats.alert}</div>
              <div className="text-[10px] uppercase text-muted-foreground">Alert</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-[hsl(var(--destructive))]">{stats.sos}</div>
              <div className="text-[10px] uppercase text-muted-foreground">SOS</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-border/60 backdrop-blur-xl bg-background/60 flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-30">
          <div className="lg:hidden flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center">
              <ShieldAlert className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-gradient">SAFETOUR.AI</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-[hsl(var(--success))] animate-pulse" />
              AI engine online
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" })}
            </div>
          </div>
        </header>

        {/* Mobile nav */}
        <nav className="lg:hidden flex gap-1 px-3 py-2 overflow-x-auto border-b border-border/60 bg-background/60">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs whitespace-nowrap",
                  active
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "text-muted-foreground hover:bg-secondary"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <main className="flex-1 p-4 lg:p-8 max-w-[1600px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
