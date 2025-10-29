import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [topic, setTopic] = useState("");
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const findExperts = async () => {
    if (loading) return; //  Prevent multiple concurrent requests
    if (!topic.trim()) {
      setError("Please enter a topic or skill.");
      return;
    }

    setLoading(true);
    setError("");
    setExperts([]);

    try {
      const response = await fetch("http://localhost:3000/experts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) throw new Error("Failed to fetch experts.");

      const data = await response.json();
      setExperts(data.experts || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      findExperts();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center py-10">
      {/* Static Header + Search */}
      <div className="w-full max-w-3xl sticky top-6 z-20">
        <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl p-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center tracking-tight">
            Find Your Perfect Expert
          </h1>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a topic or skill..."
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={findExperts}
              disabled={loading}
              className={`px-6 py-3 rounded-xl text-white font-semibold transition-all shadow-md ${
                loading
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg"
              }`}
            >
              {loading ? "Loading..." : "Find Experts"}
            </button>
          </div>

          {error && (
            <p className="text-center text-red-600 font-medium mt-3">{error}</p>
          )}
        </div>
      </div>

      {/* Expert Results */}
      <div className="w-full max-w-3xl mt-8 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-transparent px-2">
        {!loading && !error && experts.length === 0 && (
          <p className="text-center text-gray-500 mt-10 text-lg">
            No experts to display.
          </p>
        )}

        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 pb-8">
          {experts.map((expert, index) => (
            <div
              key={index}
              className="p-5 border border-gray-100 rounded-2xl shadow-sm bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all hover:scale-[1.02] duration-200"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                {expert.name}
              </h2>
              <p className="text-sm text-indigo-600 font-medium mb-1">
                {expert.category}
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                {expert.bio}
              </p>

              {expert.insight && (
                <p className="italic text-gray-600 mt-3 text-sm border-l-4 border-indigo-400 pl-3">
                  “
                  {typeof expert.insight === "string"
                    ? expert.insight
                    : expert.insight.insight || ""}
                  ”
                </p>
              )}

              <div className="flex justify-between items-center mt-3 text-sm text-gray-600">
                <span>⭐ {expert.rating}</span>
                <span>{expert.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
