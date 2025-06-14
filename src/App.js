import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SymptomDiagnosis from "./pages/SymptomDiagnosis";
import CWALookup from "./pages/CWALookup";
import TreatmentGuide from "./pages/TreatmentGuide";
import MedicalReport from "./pages/MedicalReport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/diagnosis" element={<SymptomDiagnosis />} />
          <Route path="/symptoms" element={<SymptomDiagnosis />} />
          <Route path="/cwa-lookup" element={<CWALookup />} />
          <Route path="/treatment-guide" element={<TreatmentGuide />} />
          <Route path="/medical-report" element={<MedicalReport />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
