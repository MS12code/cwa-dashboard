import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Search } from "lucide-react";

const cwaAgents = [
  {
    name: "VX Nerve Agent",
    category: "Chemical",
    description:
      "VX is a highly toxic nerve agent that interferes with the nervous system.",
    symptoms: ["Muscle Twitching", "Sweating", "Blurred Vision"],
    treatment:
      "Administer atropine and pralidoxime, decontaminate immediately.",
  },
  {
    name: "Sarin (GB)",
    category: "Chemical",
    description:
      "Sarin is a volatile nerve agent that affects breathing and muscle control.",
    symptoms: ["Shortness of Breath", "Headache", "Drooling"],
    treatment: "Administer atropine, ventilatory support required.",
  },
  {
    name: "Mustard Gas",
    category: "Chemical",
    description:
      "Mustard gas causes severe chemical burns and blistering of skin and lungs.",
    symptoms: ["Skin Irritation", "Eye Pain", "Nausea"],
    treatment:
      "Irrigate eyes and skin, symptomatic treatment, no specific antidote.",
  },
];

export default function CWALookup() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredAgents = cwaAgents.filter((agent) =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewTreatment = (agent) => {
    const agentName = encodeURIComponent(agent.name);
    const symptoms = encodeURIComponent(agent.symptoms.join(","));
    navigate(`/treatment-guide?agent=${agentName}&symptoms=${symptoms}`);
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

        {filteredAgents.length === 0 ? (
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
        ) : (
          filteredAgents.map((agent, index) => (
            <Card
              key={index}
              className="mb-6 bg-white border border-gray-300 shadow-sm"
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {agent.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-2">
                <p><strong>Category:</strong> {agent.category}</p>
                <p><strong>Description:</strong> {agent.description}</p>
                <p><strong>Symptoms:</strong> {agent.symptoms.join(", ")}</p>
                <p><strong>Treatment:</strong> {agent.treatment}</p>
                <button
                  onClick={() => handleViewTreatment(agent)}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                >
                  View Treatment Guide →
                </button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
