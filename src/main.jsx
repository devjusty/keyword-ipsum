import React from "react";
import ReactDOM from "react-dom/client";
import ReactGA from "react-ga4";
import App from "./App.jsx";
import "./index.css";
import "./assets/fonts/RubikScribble-Regular.woff2";

ReactGA.initialize("G-6N3YKMQC57");

ReactDOM.createRoot(document.querySelector("#root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
