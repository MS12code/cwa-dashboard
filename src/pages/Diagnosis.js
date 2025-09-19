import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function Diagnosis() {
  const location = useLocation();
  const navigate = useNavigate();

  const [symptoms, setSymptoms] = useState([]);
  const [gender, setGender] = useState("");
  const [system, setSystem] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const symptomsParam = query.get("symptoms");
    const genderParam = query.get("gender");
    const systemParam = query.get("system");

    if (symptomsParam) {
      setSymptoms(symptomsParam.split(",").map(decodeURIComponent));
    }
    if (genderParam) setGender(genderParam);
    if (systemParam) setSystem(systemParam);
  }, [location.search]);

  useEffect(() => {
    if (symptoms.length > 0 && gender && system) {
      const fetchPrediction = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(`${process.env.REACT_APP_BASE_API_URL}/predict_agent`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              gender: gender,
              symptoms: symptoms.join(", "),
              human_system: system,
            }),
          });

          if (!res.ok) throw new Error("Failed to fetch prediction");

          const data = await res.json();
          setResult(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchPrediction();
    }
  }, [symptoms, gender, system]);

  const handleBack = () => {
    navigate(`/symptoms?system=${encodeURIComponent(system)}`);
  };

  const handleGenerateReport = () => {
    if (!result) return;

    // Prepare medicines JSON string for URL (encodeURIComponent)
    const medicinesParam = encodeURIComponent(JSON.stringify(result.medicine));

    const url = `/medical-report?` +
      `agent=${encodeURIComponent(result.predicted_agent)}` +
      `&symptoms=${encodeURIComponent(symptoms.join(", "))}` +
      `&gender=${encodeURIComponent(gender)}` +
      `&system=${encodeURIComponent(system)}` +
      `&medicines=${medicinesParam}`;

    navigate(url);
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Diagnosis Results</h1>
          <p className="text-slate-600 mt-1">
            Based on your selected symptoms, the system has identified possible agents of exposure.
          </p>
        </div>

        {loading && <p className="text-blue-600">Analyzing symptoms...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && symptoms.length === 0 && (
          <Card className="bg-white border border-slate-300 shadow-sm mb-6">
            <CardHeader>
              <CardTitle className="text-lg text-slate-700">No symptoms selected</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 space-y-4">
              <p>Please go back and select symptoms first.</p>
            </CardContent>
          </Card>
        )}

        {!loading && !error && result && (
          <Card className="bg-white border border-slate-300 shadow-sm mb-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800">
                Predicted Agent: <b>{result.predicted_agent}</b>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 space-y-2">
              <p><strong>Score:</strong> {(result.score * 100).toFixed(2)}%</p>
              <p><strong>System:</strong> {system}</p>
              <p><strong>Gender:</strong> {gender}</p>
              <p><strong>Symptoms:</strong> {symptoms.join(", ")}</p>

              <div className="mt-4">
                <h3 className="font-semibold text-slate-700 mb-2">Recommended Medicines:</h3>
                <ul className="list-disc pl-6">
                  {Object.entries(result.medicine)
                    .filter(([_, dose]) => dose > 0)
                    .map(([med, dose], idx) => (
                      <li key={idx}>
                        <strong>{med.replace(/_/g, " ")}:</strong> {dose}
                      </li>
                    ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {!loading && !error && symptoms.length > 0 && !result && (
          <div className="text-slate-500 italic">
            No prediction result available.
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            ← Back to Symptom Selection
          </button>

          {/* Show button only if result exists */}
          {result && (
            <button
              onClick={handleGenerateReport}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
            >
              Generate Medical Report →
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
