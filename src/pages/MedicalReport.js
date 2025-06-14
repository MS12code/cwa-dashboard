import { DashboardLayout } from "../components/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { FileText } from "lucide-react";

export default function MedicalReport() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Medical Report</h1>
          <p className="text-drdo-gray-light mt-1">
            Generate and manage medical reports and case documentation
          </p>
        </div>

        <Card className="bg-drdo-blue/30 border-drdo-blue-light backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white flex items-center gap-3">
              <FileText className="h-6 w-6 text-drdo-primary" />
              Report Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="flex items-center justify-center h-64 text-drdo-gray-light">
              <div className="text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Medical Report System</p>
                <p className="text-sm">
                  Create comprehensive medical reports, case studies, and
                  documentation for chemical warfare incidents.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
