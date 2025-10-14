import React from "react";
import ReactDOM from "react-dom/client";
import ReactGA from "react-ga4";
import App from "./App.jsx";
import "./index.css";

// Initialize Google Analytics only if tracking ID is provided
const gaTrackingId = import.meta.env.VITE_GA_TRACKING_ID;
if (gaTrackingId) {
  ReactGA.initialize(gaTrackingId);
}

ReactDOM.createRoot(document.querySelector("#root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
