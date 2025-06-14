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
  BookOpen,
  Zap,
} from "lucide-react";

export default function Index() {
  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              DRDO CWA Dashboard
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <DashboardCard
            title="Total CWA Agents"
            value="5"
            icon={<TestTube className="h-6 w-6 text-drdo-primary" />}
            trend="up"
            trendValue="+2 this month"
          />
          <DashboardCard
            title="Cases Today"
            value="0"
            icon={<Users className="h-6 w-6 text-blue-400" />}
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
            <CardContent className="pb-6">
              <div className="flex items-center justify-center h-32 text-drdo-gray-light">
                <div className="text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No cases recorded today</p>
                </div>
              </div>
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
              >
                <Stethoscope className="h-5 w-5 mr-3" />
                Start Symptom Diagnosis
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-drdo-blue-light bg-drdo-blue/20 hover:bg-drdo-blue/40 text-white h-12"
                size="lg"
              >
                <Search className="h-5 w-5 mr-3" />
                Browse CWA Database
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-drdo-blue-light bg-drdo-blue/20 hover:bg-drdo-blue/40 text-white h-12"
                size="lg"
              >
                <BookOpen className="h-5 w-5 mr-3" />
                Treatment Guidelines
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-drdo-blue/20 border-drdo-blue-light/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Activity className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-drdo-gray-light">
                    Database Status
                  </p>
                  <p className="font-semibold text-white">Connected</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-drdo-blue/20 border-drdo-blue-light/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-drdo-gray-light">Last Updated</p>
                  <p className="font-semibold text-white">2:57 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-drdo-blue/20 border-drdo-blue-light/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-drdo-gray-light">Active Users</p>
                  <p className="font-semibold text-white">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
