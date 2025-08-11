import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Search } from "lucide-react";

export default function CWALookup() {
  const [agents, setAgents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://127.0.0.1:8000/get_all_agents");
        if (!res.ok) throw new Error("Failed to fetch agents");
        const data = await res.json();
        setAgents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const filteredAgents = agents.filter((agent) =>
    agent.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewTreatment = (agentName) => {
    navigate(`/treatment-guide?agent=${encodeURIComponent(agentName)}`);
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Chemical Agent Lookup</h1>
          <p className="text-gray-600 mt-1">
            Search and explore the chemical warfare agent database.
          </p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search agents by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-white text-gray-800 border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {loading && <p className="text-blue-600">Loading agents...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && filteredAgents.length === 0 && (
          <Card className="bg-white border border-gray-300 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                <Search className="h-6 w-6 text-blue-600" />
                No Agents Found
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 pb-6">
              No matching chemical agents found for “{searchQuery}”.
            </CardContent>
          </Card>
        )}

        {!loading && !error && filteredAgents.length > 0 && (
          <div className="space-y-6">
            {filteredAgents.map((agentName, idx) => (
              <Card
                key={idx}
                className="bg-white border border-gray-300 shadow-sm"
              >
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {agentName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <button
                    onClick={() => handleViewTreatment(agentName)}
                    className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                  >
                    View Treatment Guide →
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
