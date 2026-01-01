import { useState, useEffect, lazy, Suspense } from "react";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const FeaturesPage = lazy(() => import("../src/components/features/features-page/FeaturesPage").then(m => ({ default: m.FeaturesPage })));
const DebugFeaturesAPI = lazy(() => import("./pages/DebugFeaturesApi"));
const DebugLandingAPI = lazy(() => import("./pages/DebugLandingApi"));
const ApiDebugger = lazy(() => import("./components/ApiDebugger"));

const Loader = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
    <div style={{ width: "50px", height: "50px", border: "5px solid #f3f3f3", borderTop: "5px solid #3B82F6", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}`}</style>
  </div>
);

function App() {
  const [currentView, setCurrentView] = useState<{
    type: "landing" | "features" | "debug-features" | "debug-landing" | "api-debug";
    slug?: string;
  }>({ type: "landing" });

  // Simple URL-based routing
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      // Debug pages
      if (path.includes("/api-debug") || hash.includes("#api-debug")) {
        setCurrentView({ type: "api-debug" });
        return;
      }
      
      if (path.includes("/debug-features") || hash.includes("#debug-features")) {
        setCurrentView({ type: "debug-features" });
        return;
      }
      
      if (path.includes("/debug-landing") || hash.includes("#debug-landing")) {
        setCurrentView({ type: "debug-landing" });
        return;
      }
      
      // Legacy debug route defaults to features
      if (path.includes("/debug") || hash.includes("#debug")) {
        setCurrentView({ type: "debug-features" });
        return;
      }

      // Check if we're on a features page
      if (path.includes("/features/") || hash.includes("#features/")) {
        // Extract slug from path or hash
        const slugMatch =
          path.match(/\/features\/([^\/]+)/) ||
          hash.match(/#features\/([^\/]+)/);

        if (slugMatch && slugMatch[1]) {
          setCurrentView({ type: "features", slug: slugMatch[1] });
        } else {
          setCurrentView({ type: "features", slug: "sales-marketing" });
        }
      } else {
        setCurrentView({ type: "landing" });
      }
    };

    checkRoute();

    // Listen for hash changes (for navigation without page reload)
    window.addEventListener("hashchange", checkRoute);
    window.addEventListener("popstate", checkRoute);

    return () => {
      window.removeEventListener("hashchange", checkRoute);
      window.removeEventListener("popstate", checkRoute);
    };
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      {currentView.type === "features" && <FeaturesPage slug={currentView.slug} />}
      {currentView.type === "debug-features" && <DebugFeaturesAPI />}
      {currentView.type === "debug-landing" && <DebugLandingAPI />}
      {currentView.type === "api-debug" && <ApiDebugger />}
      {currentView.type === "landing" && <LandingPage />}
    </Suspense>
  );
}

export default App;
