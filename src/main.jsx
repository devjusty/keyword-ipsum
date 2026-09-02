import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

const gaTrackingId = import.meta.env.VITE_GA_TRACKING_ID;
if (gaTrackingId) {
  const loadAnalytics = () =>
    import("react-ga4").then(({ default: ReactGA }) => {
      ReactGA.initialize(gaTrackingId);
    });

  if ("requestIdleCallback" in globalThis) {
    globalThis.requestIdleCallback(loadAnalytics);
  } else {
    globalThis.setTimeout(loadAnalytics, 0);
  }
}

ReactDOM.createRoot(document.querySelector("#root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
