import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/dashboard-layout";

export default function TreatmentGuide() {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedAgent, setSelectedAgent] = useState("");
  const [treatmentData, setTreatmentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const agent = query.get("agent");

    if (agent) {
      setSelectedAgent(agent);
      fetchTreatment(agent);
    }
  }, [location.search]);

  const fetchTreatment = async (agent) => {
    setLoading(true);
    setError(null);
    setTreatmentData(null);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BASE_API_URL}/get_agent_details?agent_name=${encodeURIComponent(
          agent
        )}`
      );
      if (!res.ok) {
        throw new Error(`Failed to fetch treatment details for ${agent}`);
      }
      const data = await res.json();
      if (!data || data.length === 0) {
        setError("No treatment data found for this agent.");
        setTreatmentData(null);
      } else {
        // Store the raw data array here
        setTreatmentData(data);
      }
    } catch (err) {
      setError(err.message);
      setTreatmentData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/cwa-lookup`);
  };

  return (
    <DashboardLayout>
      <div className="p-8 bg-slate-50 min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Treatment Guide</h1>
          <p className="text-slate-600 mt-1">
            Treatment protocols for the selected chemical warfare agent.
          </p>
        </div>

        {loading && <p className="text-blue-600">Loading treatment details...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && !treatmentData && (
          <p className="text-slate-600">No agent selected or no data available.</p>
        )}

        {!loading && !error && treatmentData && (
          <>
            <h2 className="text-xl font-semibold mb-6">{selectedAgent} Treatment Details</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-slate-300 rounded-md text-left">
                <thead className="bg-slate-100">
                  <tr>
                    {Object.keys(treatmentData[0]).map((key) => {
                      const formattedKey = key
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase());
                      return (
                        <th
                          key={key}
                          className="border border-slate-300 px-3 py-2 sticky top-0"
                        >
                          {formattedKey}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {treatmentData.map((entry, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
                    >
                      {Object.entries(entry).map(([key, value]) => {
                        // Format gender values 0/1 -> Female/Male
                        if (key === "gender") {
                          value = value === 0 ? "Female" : value === 1 ? "Male" : value;
                        }

                        // Format numbers to fixed decimals if needed
                        if (typeof value === "number") {
                          value = Number.isInteger(value) ? value : value.toFixed(2);
                        }

                        return (
                          <td
                            key={key}
                            className="border border-slate-300 px-3 py-2 align-top max-w-xs break-words"
                          >
                            {String(value)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md border border-blue-300 hover:bg-blue-200 transition"
              >
                ← Back to CWA Lookup
              </button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
