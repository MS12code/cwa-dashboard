import { DashboardLayout } from "../components/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Search } from "lucide-react";

export default function CWALookup() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">CWA Lookup</h1>
          <p className="text-drdo-gray-light mt-1">
            Search and browse chemical warfare agent database
          </p>
        </div>

        <Card className="bg-drdo-blue/30 border-drdo-blue-light backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white flex items-center gap-3">
              <Search className="h-6 w-6 text-drdo-primary" />
              Agent Database
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="flex items-center justify-center h-64 text-drdo-gray-light">
              <div className="text-center">
                <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">CWA Database Search</p>
                <p className="text-sm">
                  Access comprehensive information about chemical warfare
                  agents, their properties, and detection methods.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
