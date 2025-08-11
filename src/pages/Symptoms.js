import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "../components/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Stethoscope } from "lucide-react";
import { Button } from "../components/ui/button";

export default function Symptoms() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [symptomsList, setSymptomsList] = useState([]);
  const [gender, setGender] = useState(""); // <-- Gender state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Parse system from URL query param ?system=Respiratory
  const queryParams = new URLSearchParams(location.search);
  const system = queryParams.get("system");

  useEffect(() => {
    if (!system) {
      setSymptomsList([]);
      return;
    }

    const fetchSymptoms = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_API_URL}/get_symptoms_by_system?human_system=${system}`
        );
        if (!response.ok) throw new Error("Failed to fetch symptoms");
        const data = await response.json();
        setSymptomsList(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSymptoms();
  }, [system]);

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleDiagnose = () => {
    const symptomsParam = selectedSymptoms.map(encodeURIComponent).join(",");
    navigate(
      `/diagnosis?symptoms=${symptomsParam}&system=${encodeURIComponent(
        system
      )}&gender=${encodeURIComponent(gender)}`
    );
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900">
            Fetched Symptoms for <b>{system ? `${system} System` : ""}</b>
          </h1>
          <p className="text-gray-500 mt-1">
            AI-powered symptom analysis and chemical warfare agent detection
          </p>
        </div>

        <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-3">
              <Stethoscope className="h-6 w-6 text-emerald-600" />
              Symptom Analysis Tool
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Gender dropdown */}
            <div>
              <label className="block text-gray-700 mb-2">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {loading && <p>Loading symptoms...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {!loading && !error && symptomsList.length === 0 && (
              <p>No System selected from the Anatomy Navigator module.</p>
            )}

            {!loading && !error && symptomsList.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {symptomsList.map((symptom, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 transition p-3 rounded-lg cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSymptoms.includes(symptom)}
                      onChange={() => toggleSymptom(symptom)}
                      className="form-checkbox h-5 w-5 text-emerald-600"
                    />
                    <span className="text-gray-700">{symptom}</span>
                  </label>
                ))}
              </div>
            )}

            <div className="pt-6 text-center">
              <Button
                disabled={
                  selectedSymptoms.length === 0 || !gender || !system
                }
                onClick={handleDiagnose}
              >
                Analyze Symptoms →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
