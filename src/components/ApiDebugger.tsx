import { useState } from "react";

const ApiDebugger = () => {
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  const testEndpoints = [
    "/mypages/",
    "/pages/",
    "/features-pages/",
    "/documents/",
    "/images/",
  ];

  const testEndpoint = async (endpoint: string) => {
    setLoading(true);
    try {
      const isDevelopment = import.meta.env.DEV;
      const baseApiUrl = isDevelopment
        ? "/blogs/api/v2"
        : "https://esign-admin.signmary.com/blogs/api/v2";

      const frontendUrl = isDevelopment
        ? "http://localhost:5173"
        : "https://w9hunter.com";

      const response = await fetch(`${baseApiUrl}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Frontend-Url": frontendUrl,
        },
      });

      const data = await response.json();
      setResults((prev) => ({
        ...prev,
        [endpoint]: {
          status: response.status,
          data: data,
          timestamp: new Date().toISOString(),
        },
      }));
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [endpoint]: {
          status: "ERROR",
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date().toISOString(),
        },
      }));
    }
    setLoading(false);
  };

  const testAllEndpoints = async () => {
    for (const endpoint of testEndpoints) {
      await testEndpoint(endpoint);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Wagtail API Debugger</h2>

      <div className="mb-4">
        <button
          onClick={testAllEndpoints}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test All Endpoints"}
        </button>
      </div>

      <div className="grid gap-4">
        {testEndpoints.map((endpoint) => (
          <div key={endpoint} className="border rounded p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">{endpoint}</h3>
              <button
                onClick={() => testEndpoint(endpoint)}
                className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
              >
                Test
              </button>
            </div>

            {results[endpoint] && (
              <div className="bg-gray-50 p-3 rounded text-sm">
                <div className="mb-2">
                  <span className="font-medium">Status: </span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      results[endpoint].status === 200
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {results[endpoint].status}
                  </span>
                </div>

                {results[endpoint].data && (
                  <div>
                    <span className="font-medium">Response: </span>
                    <pre className="mt-1 text-xs overflow-auto max-h-40">
                      {JSON.stringify(results[endpoint].data, null, 2)}
                    </pre>
                  </div>
                )}

                {results[endpoint].error && (
                  <div className="text-red-600">
                    <span className="font-medium">Error: </span>
                    {results[endpoint].error}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiDebugger;
