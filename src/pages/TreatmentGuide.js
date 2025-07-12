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
      "Administer atropine (2-6 mg IV every 5–10 min).",
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
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Treatment Guide</h1>
          <p className="text-drdo-gray-light mt-1">
            Protocols for handling chemical warfare exposure.
          </p>
        </div>

        {!treatment ? (
          <p className="text-drdo-gray-light">No agent selected.</p>
        ) : (
          <Card className="bg-drdo-blue/30 border-drdo-blue-light backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-drdo-primary" />
                {selectedAgent} Treatment Protocol
              </CardTitle>
            </CardHeader>
            <CardContent className="text-drdo-gray-light space-y-4">
              <p><strong>Summary:</strong> {treatment.summary}</p>
              <ul className="list-disc list-inside space-y-1">
                {treatment.protocol.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleBack}
                  className="px-4 py-2 bg-drdo-primary text-white rounded-md"
                >
                  ← Back to Diagnosis
                </button>
                <button
                  onClick={goToReport}
                  className="px-4 py-2 bg-drdo-primary text-white rounded-md"
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
