import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Droplets, HeartPulse, AlertTriangle, Info, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/water", label: "Water Data", icon: Droplets },
  { to: "/health", label: "Health Data", icon: HeartPulse },
  { to: "/alerts", label: "Alerts", icon: AlertTriangle },
  { to: "/about", label: "About", icon: Info },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Droplets className="h-7 w-7 text-sidebar-primary" />
            <div>
              <h1 className="text-sm font-bold leading-tight">Community Health</h1>
              <p className="text-[10px] text-sidebar-foreground/60">NE India Water Monitor</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary font-medium"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`
              }
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border text-[10px] text-sidebar-foreground/40">
          Smart Health Monitor v1.0
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="md:hidden flex items-center justify-between p-4 bg-sidebar text-sidebar-foreground border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-sidebar-primary" />
            <span className="font-bold text-sm">Health Monitor</span>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {/* Mobile nav dropdown */}
        {mobileOpen && (
          <div className="md:hidden bg-sidebar text-sidebar-foreground border-b border-sidebar-border p-3 space-y-1">
            {links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                    isActive ? "bg-sidebar-accent text-sidebar-primary font-medium" : "text-sidebar-foreground/70"
                  }`
                }
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </NavLink>
            ))}
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
