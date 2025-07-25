import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { BookOpen } from "lucide-react";

const treatmentData = {
  "VX Nerve Agent": {
    summary: "VX is a potent nerve agent. Immediate action is critical.",
    protocol: [
      "PPE for responders.",
      "Remove victim from contaminated zone.",
      "Administer atropine (2–6 mg IV every 5–10 min).",
      "Pralidoxime (1–2 g IV over 15–30 min).",
      "Maintain airway, oxygen support.",
      "Decontaminate with soap + water.",
    ],
  },
  "Botulinum Toxin": {
    summary: "Botulinum toxin causes flaccid paralysis.",
    protocol: [
      "Supportive care + ventilation.",
      "Administer antitoxin (CDC supply).",
      "Hospitalization for observation.",
    ],
  },
};

export default function TreatmentGuide() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedAgent, setSelectedAgent] = useState("");
  const [symptomsString, setSymptomsString] = useState("");
  const [treatment, setTreatment] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const agent = query.get("agent");
    const symptomsParam = query.get("symptoms");
    if (agent) {
      setSelectedAgent(agent);
      setTreatment(treatmentData[agent]);
    }
    if (symptomsParam) {
      setSymptomsString(symptomsParam);
    }
  }, [location.search]);

  const handleBack = () => {
    navigate(`/diagnosis?symptoms=${encodeURIComponent(symptomsString)}`);
  };

  const goToReport = () => {
    navigate(
      `/medical-report?agent=${encodeURIComponent(
        selectedAgent
      )}&symptoms=${encodeURIComponent(symptomsString)}`
    );
  };

  return (
    <DashboardLayout>
      <div className="p-8 bg-slate-50 min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Treatment Guide</h1>
          <p className="text-slate-600 mt-1">
            Protocols for handling chemical warfare exposure.
          </p>
        </div>

        {!treatment ? (
          <p className="text-slate-600">No agent selected.</p>
        ) : (
          <Card className="bg-white border border-slate-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-slate-800 flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-blue-600" />
                {selectedAgent} Treatment Protocol
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-700 space-y-4">
              <p>
                <strong>Summary:</strong> {treatment.summary}
              </p>
              <ul className="list-disc list-inside space-y-1">
                {treatment.protocol.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleBack}
                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md border border-blue-300 hover:bg-blue-200 transition"
                >
                  ← Back to Diagnosis
                </button>
                <button
                  onClick={goToReport}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Generate Medical Report →
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
