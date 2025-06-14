import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function TreatmentGuide() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Treatment Guide</h1>
          <p className="text-drdo-gray-light mt-1">
            Medical protocols and treatment guidelines for chemical warfare
            exposure
          </p>
        </div>

        <Card className="bg-drdo-blue/30 border-drdo-blue-light backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-drdo-primary" />
              Treatment Protocols
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="flex items-center justify-center h-64 text-drdo-gray-light">
              <div className="text-center">
                <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Medical Treatment Guidelines</p>
                <p className="text-sm">
                  Evidence-based treatment protocols and medical guidelines for
                  chemical warfare agent exposure cases.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
