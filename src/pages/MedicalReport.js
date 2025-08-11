import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { DashboardLayout } from "../components/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { FileText } from "lucide-react";

export default function MedicalReport() {
  const location = useLocation();
  const navigate = useNavigate();
  const [agent, setAgent] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [gender, setGender] = useState("");
  const [system, setSystem] = useState("");
  const [medicines, setMedicines] = useState({});
  const [doctorName, setDoctorName] = useState("");
  const [report, setReport] = useState(null);
  const reportRef = useRef();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const agentParam = query.get("agent");
    const symptomsParam = query.get("symptoms");
    const genderParam = query.get("gender");
    const systemParam = query.get("system");
    const medicinesParam = query.get("medicines");

    if (agentParam) setAgent(agentParam);
    if (symptomsParam) {
      const decoded = symptomsParam.split(",").map(decodeURIComponent);
      setSymptoms(decoded);
    }
    if (genderParam) setGender(genderParam);
    if (systemParam) setSystem(systemParam);
    if (medicinesParam) {
      try {
        setMedicines(JSON.parse(decodeURIComponent(medicinesParam)));
      } catch {
        setMedicines({});
      }
    }
  }, [location.search]);

  useEffect(() => {
    if (agent) {
      const caseId = "CASE-" + Math.random().toString(36).substr(2, 6).toUpperCase();
      setReport({
        caseId,
        agent,
        symptoms,
        gender,
        system,
        medicines,
        createdAt: new Date().toLocaleString(),
      });
    }
  }, [agent, symptoms, gender, system, medicines]);

  const handleBack = () => {
    // Navigate back to diagnosis with current symptoms
    if (symptoms.length > 0) {
      navigate(
        `/diagnosis?` +
          `symptoms=${encodeURIComponent(symptoms.join(","))}` +
          `&gender=${encodeURIComponent(gender)}` +
          `&system=${encodeURIComponent(system)}`
      );
    } else {
      navigate("/diagnosis");
    }
  };

  const handleDownloadPDF = () => {
    if (!report) return;

    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Medical Report", 10, 15);

    doc.setFontSize(12);
    doc.text(`Case ID: ${report.caseId}`, 10, 30);
    doc.text(`Agent: ${report.agent}`, 10, 40);
    doc.text(`Gender: ${report.gender}`, 10, 50);
    doc.text(`System: ${report.system}`, 10, 60);
    doc.text(`Symptoms:`, 10, 70);
    report.symptoms.forEach((symptom, i) => {
      doc.text(`- ${symptom}`, 15, 80 + i * 10);
    });

    let yPos = 80 + report.symptoms.length * 10 + 10;
    doc.text("Recommended Medicines:", 10, yPos);
    yPos += 10;
    Object.entries(report.medicines)
      .filter(([_, dose]) => dose > 0)
      .forEach(([med, dose]) => {
        doc.text(`- ${med.replace(/_/g, " ")}: ${dose}`, 15, yPos);
        yPos += 10;
      });

    yPos += 10;
    doc.text(`Doctor: ${doctorName || "N/A"}`, 10, yPos);
    yPos += 10;
    doc.text(`Generated On: ${report.createdAt}`, 10, yPos);

    doc.save(`${report.caseId}.pdf`);
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6 bg-white text-black" ref={reportRef}>
        <div>
          <h1 className="text-3xl font-bold text-drdo-dark">Medical Report</h1>
          <p className="text-drdo-gray-dark mt-1">Case details and action plan.</p>
        </div>

        <Card className="bg-white border border-drdo-gray-light shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-drdo-dark flex items-center gap-3">
              <FileText className="h-6 w-6 text-drdo-primary" />
              Case Report
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-drdo-gray-dark">
            {report ? (
              <div className="space-y-2">
                <p>
                  <strong>Case ID:</strong> {report.caseId}
                </p>
                <p>
                  <strong>Agent:</strong> {report.agent}
                </p>
                <p>
                  <strong>Gender:</strong> {report.gender}
                </p>
                <p>
                  <strong>System:</strong> {report.system}
                </p>
                <p>
                  <strong>Symptoms:</strong> {report.symptoms.join(", ")}
                </p>
                <p>
                  <strong>Recommended Medicines:</strong>
                </p>
                <ul className="list-disc list-inside ml-4">
                  {Object.entries(report.medicines)
                    .filter(([_, dose]) => dose > 0)
                    .map(([med, dose], idx) => (
                      <li key={idx}>
                        {med.replace(/_/g, " ")}: {dose}
                      </li>
                    ))}
                </ul>
                <p>
                  <strong>Generated On:</strong> {report.createdAt}
                </p>
              </div>
            ) : (
              <p>No report data available. Please start from the Anatomy Navigator step by step to generate the Report.</p>
            )}

            <div className="pt-4 space-y-3">
              <input
                type="text"
                placeholder="Doctor's Full Name"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="px-4 py-2 rounded-md w-full text-black bg-white border border-drdo-gray-light shadow-sm focus:outline-none focus:ring-2 focus:ring-drdo-primary"
              />

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleBack}
                  className="px-4 py-2 bg-drdo-primary text-white rounded-md hover:bg-drdo-primary/90"
                >
                  ← Back to Diagnosis
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="px-4 py-2 bg-drdo-primary text-white rounded-md hover:bg-drdo-primary/90"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
