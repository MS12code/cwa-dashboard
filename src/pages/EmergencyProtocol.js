import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function EmergencyProtocol() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Emergency Protocol</h1>
          <p className="text-drdo-gray-light mt-1">
            Immediate steps to follow during chemical or biological exposure emergencies.
          </p>
        </div>

        <Card className="bg-red-900/30 border-red-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-red-300 flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-400" />
              Critical Emergency Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="text-red-100 space-y-4 pb-6">
            <ol className="list-decimal list-inside space-y-2">
              <li>Evacuate exposed individuals to a safe location immediately.</li>
              <li>Ensure all personnel use proper protective equipment (PPE).</li>
              <li>Isolate and secure the contaminated area.</li>
              <li>Call for emergency medical and hazmat response.</li>
              <li>Use CWA Lookup to identify the suspected chemical agent.</li>
              <li>Follow relevant protocols from the Treatment Guide.</li>
              <li>Document the case using the Medical Report system.</li>
            </ol>

            <div className="flex flex-wrap gap-4 pt-6">
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-drdo-primary text-white rounded-md"
              >
                ← Back to Dashboard
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
