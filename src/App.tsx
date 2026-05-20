import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/lib/store";
import AppLayout from "@/components/AppLayout";
import Index from "./pages/Index";
import SafetyMap from "./pages/SafetyMap";
import Incidents from "./pages/Incidents";
import SOS from "./pages/SOS";
import Chatbot from "./pages/Chatbot";
import Identity from "./pages/Identity";
import Admin from "./pages/Admin";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/map" element={<SafetyMap />} />
              <Route path="/incidents" element={<Incidents />} />
              <Route path="/sos" element={<SOS />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/identity" element={<Identity />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
