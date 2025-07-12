import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  const symptomsList = [
    "Nausea",
    "Headache",
    "Shortness of Breath",
    "Muscle Twitching",
    "Blurred Vision",
    "Excessive Sweating",
    "Skin Irritation",
    "Dilated Pupils",
  ];

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleDiagnose = () => {
    const queryString = selectedSymptoms.map(encodeURIComponent).join(",");
    navigate(`/diagnosis?symptoms=${queryString}`);
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Highly Intensive Symptoms</h1>
          <p className="text-drdo-gray-light mt-1">
            AI-powered symptom analysis and chemical warfare agent detection
          </p>
        </div>

        <Card className="bg-drdo-blue/30 border-drdo-blue-light backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white flex items-center gap-3">
              <Stethoscope className="h-6 w-6 text-drdo-primary" />
              Symptom Analysis Tool
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-drdo-gray-light mb-2">
              Select observed symptoms below. The system will analyze and help
              identify potential CWA exposure.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-white">
              {symptomsList.map((symptom, index) => (
                <label
                  key={index}
                  className="flex items-center gap-3 bg-drdo-blue-light/30 p-3 rounded-lg cursor-pointer hover:bg-drdo-blue-light/50 transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedSymptoms.includes(symptom)}
                    onChange={() => toggleSymptom(symptom)}
                    className="form-checkbox h-5 w-5 text-drdo-primary"
                  />
                  {symptom}
                </label>
              ))}
            </div>

            <div className="pt-6 text-center">
              <Button
                disabled={selectedSymptoms.length === 0}
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
