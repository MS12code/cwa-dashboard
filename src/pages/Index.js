import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Stethoscope,
  Search,
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const [cwaAgents, setCwaAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgents = async () => {
      setLoadingAgents(true);
      setError(null);
      try {
        const res = await fetch(`${process.env.REACT_APP_BASE_API_URL}/get_all_agents`);
        if (!res.ok) throw new Error("Failed to fetch agents");
        const data = await res.json();
        setCwaAgents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingAgents(false);
      }
    };

    fetchAgents();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8 bg-gray-50">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Medical Management of CWA
            </h1>
            <p className="text-gray-600 mt-1">
              Chemical Warfare Agent Detection & Treatment System
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Quick Actions */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6 space-y-3">
              <Button
                className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white h-12"
                size="lg"
                onClick={() => navigate("/anatomy-navigator")}
              >
                <Stethoscope className="h-5 w-5 mr-3" />
                Start Symptom Diagnosis
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-800 h-12"
                size="lg"
                onClick={() => navigate("/cwa-lookup")}
              >
                <Search className="h-5 w-5 mr-3" />
                Browse CWA Database
              </Button>
            </CardContent>
          </Card>

          {/* Agent Listing */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Chemical Agents
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
              {loadingAgents && (
                <p className="text-center col-span-full text-gray-500">
                  Loading agents...
                </p>
              )}
              {error && (
                <p className="text-center col-span-full text-red-600">
                  Error: {error}
                </p>
              )}
              {!loadingAgents && !error && cwaAgents.length === 0 && (
                <p className="text-center col-span-full text-gray-500">
                  No agents found.
                </p>
              )}
              {!loadingAgents && !error && cwaAgents.map((agentName, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    navigate(
                      `/treatment-guide?agent=${encodeURIComponent(agentName)}`
                    )
                  }
                  className="bg-gray-100 p-4 rounded-lg border border-gray-200 text-left hover:bg-gray-200 transition"
                >
                  <p className="text-gray-800 font-medium">{agentName}</p>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
