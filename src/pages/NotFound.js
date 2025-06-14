import { DashboardLayout } from "../components/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <Card className="bg-drdo-blue/30 border-drdo-blue-light backdrop-blur-sm max-w-md mx-auto mt-16">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-yellow-400" />
              Page Not Found
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="text-center text-drdo-gray-light">
              <p className="mb-4">The page you're looking for doesn't exist.</p>
              <Link
                to="/"
                className="inline-block bg-drdo-primary hover:bg-drdo-secondary text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Return to Dashboard
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
