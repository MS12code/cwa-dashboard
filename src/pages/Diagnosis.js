import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

const mockAgentData = [
  {
    agent: "VX Nerve Agent",
    type: "Chemical",
    matchedSymptoms: ["Blurred Vision", "Excessive Sweating", "Muscle Twitching"],
    risk: "High",
    action: "Administer atropine, decontaminate immediately.",
  },
  {
    agent: "Botulinum Toxin",
    type: "Biological",
    matchedSymptoms: ["Nausea", "Blurred Vision"],
    risk: "High",
    action: "Administer antitoxin, provide respiratory support.",
  },
];

export default function Diagnosis() {
  const location = useLocation();
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const symptomsParam = query.get("symptoms");
    if (symptomsParam) {
      const symptomArray = symptomsParam.split(",").map(decodeURIComponent);
      setSymptoms(symptomArray);
    }
  }, [location.search]);

  useEffect(() => {
    if (symptoms.length > 0) {
      const matched = mockAgentData.filter((agent) =>
        agent.matchedSymptoms.some((s) => symptoms.includes(s))
      );
      setResults(matched);
    }
  }, [symptoms]);

  const handleBack = () => navigate("/symptoms");

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Diagnosis Results</h1>
          <p className="text-slate-600 mt-1">
            Based on your selected symptoms, the system has identified possible agents of exposure.
          </p>
        </div>

        {symptoms.length === 0 ? (
          <Card className="bg-white border border-slate-300 shadow-sm mb-6">
            <CardHeader>
              <CardTitle className="text-lg text-slate-700">No symptoms selected</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 space-y-4">
              <p>
                You haven't selected any symptoms. Please return to the previous screen and select at least one symptom to continue the diagnosis process.
              </p>
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                ← Back to Symptom Selection
              </button>
            </CardContent>
          </Card>
        ) : (
          <>
            {results.map((result, index) => (
              <Card
                key={index}
                className="bg-white border border-slate-300 shadow-sm mb-6"
              >
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-slate-800">
                    {result.agent}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-600 space-y-2">
                  <p><strong>Type:</strong> {result.type}</p>
                  <p><strong>Matched Symptoms:</strong> {result.matchedSymptoms.join(", ")}</p>
                  <p><strong>Risk Level:</strong> {result.risk}</p>
                  <p><strong>Suggested Action:</strong> {result.action}</p>
                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => navigate("/cwa-lookup")}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    >
                      View in CWA Lookup →
                    </button>
                    <button
                      onClick={() =>
                        navigate(
                          `/treatment-guide?agent=${encodeURIComponent(result.agent)}&symptoms=${encodeURIComponent(symptoms.join(","))}`
                        )
                      }
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    >
                      View Treatment Guide →
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {results.length === 0 && (
              <div className="text-slate-500 italic">
                No matching agent found based on selected symptoms.
              </div>
            )}

            <div className="text-center pt-4">
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                ← Back to Symptom Selection
              </button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
