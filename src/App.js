import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Symptoms from "./pages/Symptoms";
import Diagnosis from "./pages/Diagnosis";
import CWALookup from "./pages/CWALookup";
import TreatmentGuide from "./pages/TreatmentGuide";
import MedicalReport from "./pages/MedicalReport";
import NotFound from "./pages/NotFound";
import EmergencyProtocol from "./pages/EmergencyProtocol";
import AnatomyNavigator from "./pages/AnatomyNavigator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/anatomy-navigator" element={<AnatomyNavigator />} />
          <Route path="/symptoms" element={<Symptoms />} />
          <Route path="/diagnosis" element={<Diagnosis />} />
          <Route path="/cwa-lookup" element={<CWALookup />} />
          <Route path="/treatment-guide" element={<TreatmentGuide />} />
          <Route path="/medical-report" element={<MedicalReport />} />
          <Route path="/emergency-protocol" element={<EmergencyProtocol />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
