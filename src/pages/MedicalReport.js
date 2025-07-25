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

const mockAgentData = {
  "VX Nerve Agent": {
    symptoms: ["Blurred Vision", "Sweating", "Twitching"],
    action: "Administer atropine + decontaminate. Provide oxygen.",
    classification: "Chemical",
    risk: "High",
  },
  "Botulinum Toxin": {
    symptoms: ["Nausea", "Blurred Vision"],
    action: "Administer antitoxin + monitor respiration.",
    classification: "Biological",
    risk: "High",
  },
};

export default function MedicalReport() {
  const location = useLocation();
  const navigate = useNavigate();
  const [agent, setAgent] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [report, setReport] = useState(null);
  const [doctorName, setDoctorName] = useState("");
  const reportRef = useRef();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const agentParam = query.get("agent");
    const symptomsParam = query.get("symptoms");
    if (agentParam) setAgent(agentParam);
    if (symptomsParam) {
      const decoded = symptomsParam.split(",").map(decodeURIComponent);
      setSymptoms(decoded);
    }
  }, [location.search]);

  useEffect(() => {
    if (agent && mockAgentData[agent]) {
      const data = mockAgentData[agent];
      const caseId =
        "CASE-" + Math.random().toString(36).substr(2, 6).toUpperCase();
      setReport({
        agent,
        classification: data.classification,
        symptoms: data.symptoms,
        action: data.action,
        risk: data.risk,
        createdAt: new Date().toLocaleString(),
        caseId,
      });
    }
  }, [agent]);

  const handleBack = () => {
    if (symptoms.length > 0) {
      navigate(`/diagnosis?symptoms=${encodeURIComponent(symptoms.join(","))}`);
    } else {
      navigate("/diagnosis");
    }
  };

  const handleDownloadPDF = () => {
    if (!report) return;

    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Medical Report", 10, 10);
    doc.text(`Case ID: ${report.caseId}`, 10, 20);
    doc.text(`Agent: ${report.agent}`, 10, 30);
    doc.text(`Type: ${report.classification}`, 10, 40);
    doc.text(`Risk: ${report.risk}`, 10, 50);
    doc.text(`Symptoms: ${report.symptoms.join(", ")}`, 10, 60);
    doc.text(`Action: ${report.action}`, 10, 70);
    doc.text(`Doctor: ${doctorName || "N/A"}`, 10, 80);
    doc.text(`Created: ${report.createdAt}`, 10, 90);
    doc.save(`${report.caseId}.pdf`);
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6 bg-white text-black" ref={reportRef}>
        <div>
          <h1 className="text-3xl font-bold text-drdo-dark">Medical Report</h1>
          <p className="text-drdo-gray-dark mt-1">
            Case details and action plan.
          </p>
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
                  <strong>Classification:</strong> {report.classification}
                </p>
                <p>
                  <strong>Risk Level:</strong> {report.risk}
                </p>
                <p>
                  <strong>Symptoms:</strong> {report.symptoms.join(", ")}
                </p>
                <p>
                  <strong>Action:</strong> {report.action}
                </p>
                <p>
                  <strong>Generated On:</strong> {report.createdAt}
                </p>
              </div>
            ) : (
              <p>No report data available.</p>
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
