import { DashboardLayout } from "../components/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Stethoscope } from "lucide-react";

export default function SymptomDiagnosis() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Symptom Diagnosis</h1>
          <p className="text-drdo-gray-light mt-1">
            AI-powered symptom analysis and chemical warfare agent detection
          </p>
        </div>

        <Card className="bg-drdo-blue/30 border-drdo-blue-light backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white flex items-center gap-3">
              <Stethoscope className="h-6 w-6 text-drdo-primary" />
              Symptom Analysis Tool
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="flex items-center justify-center h-64 text-drdo-gray-light">
              <div className="text-center">
                <Stethoscope className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Symptom Diagnosis Tool</p>
                <p className="text-sm">
                  This advanced diagnostic tool will help analyze symptoms and
                  identify potential chemical warfare agent exposure.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
