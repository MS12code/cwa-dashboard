import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/dashboard-layout";
import { DashboardCard } from "../components/dashboard-card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  TestTube,
  Users,
  Clock,
  Activity,
  Stethoscope,
  Search,
  ArrowRight,
} from "lucide-react";

const recentCases = [
  {
    id: 1,
    symptoms: ["Headache", "Blurred Vision"],
    reportedAt: "2:15 PM",
  },
  {
    id: 2,
    symptoms: ["Shortness of Breath", "Drooling"],
    reportedAt: "11:32 AM",
  },
  {
    id: 3,
    symptoms: ["Nausea", "Skin Irritation"],
    reportedAt: "9:18 AM",
  },
];

const cwaAgents = [
  {
    name: "VX Nerve Agent",
    category: "Chemical",
  },
  {
    name: "Sarin (GB)",
    category: "Chemical",
  },
  {
    name: "Mustard Gas",
    category: "Chemical",
  },
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Medical Management of CWA
            </h1>
            <p className="text-drdo-gray-light mt-1">
              Chemical Warfare Agent Detection & Treatment System
            </p>
          </div>
          <div className="flex items-center gap-2 bg-drdo-primary/10 px-4 py-2 rounded-lg border border-drdo-primary/20">
            <div className="h-2 w-2 bg-drdo-primary rounded-full animate-pulse"></div>
            <span className="text-drdo-primary font-medium">System Active</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <DashboardCard
            title="Total CWA Agents"
            value={cwaAgents.length.toString()}
            icon={<TestTube className="h-6 w-6 text-drdo-primary" />}
            trend="up"
            trendValue="+2 this month"
          />
          <DashboardCard
            title="Response Time"
            value="< 2 min"
            icon={<Clock className="h-6 w-6 text-yellow-400" />}
          />
          <DashboardCard
            title="System Status"
            value="Online"
            icon={<Activity className="h-6 w-6 text-drdo-primary" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Cases */}
          <Card className="bg-drdo-blue/30 border-drdo-blue-light backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">
                Recent Cases
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4 space-y-4 text-drdo-gray-light">
              {recentCases.length === 0 ? (
                <div className="text-center py-6">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No cases recorded today</p>
                </div>
              ) : (
                recentCases.map((caseItem) => (
                  <div
                    key={caseItem.id}
                    className="flex justify-between items-center border-b border-drdo-blue-light/20 pb-2"
                  >
                    <div>
                      <p className="text-white font-medium">
                        Case #{caseItem.id}
                      </p>
                      <p className="text-sm">
                        Symptoms: {caseItem.symptoms.join(", ")}
                      </p>
                      <p className="text-xs mt-1 text-drdo-gray-light">
                        Reported at: {caseItem.reportedAt}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-drdo-primary hover:text-white"
                      onClick={() =>
                        navigate(
                          `/diagnosis?symptoms=${encodeURIComponent(
                            caseItem.symptoms.join(",")
                          )}`
                        )
                      }
                    >
                      View
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-drdo-blue/30 border-drdo-blue-light backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6 space-y-3">
              <Button
                className="w-full justify-start bg-drdo-primary hover:bg-drdo-secondary text-white h-12"
                size="lg"
                onClick={() => navigate("/symptoms")}
              >
                <Stethoscope className="h-5 w-5 mr-3" />
                Start Symptom Diagnosis
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-drdo-blue-light bg-drdo-blue/20 hover:bg-drdo-blue/40 text-white h-12"
                size="lg"
                onClick={() => navigate("/cwa-lookup")}
              >
                <Search className="h-5 w-5 mr-3" />
                Browse CWA Database
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Agent Listing */}
        <Card className="bg-drdo-blue/20 border-drdo-blue-light/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">
              Registered Chemical Agents
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-drdo-gray-light">
            {cwaAgents.map((agent, idx) => (
              <div
                key={idx}
                className="bg-white/5 p-4 rounded-lg border border-drdo-blue-light"
              >
                <p className="text-white font-medium">{agent.name}</p>
                <p className="text-xs">Category: {agent.category}</p>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
}
