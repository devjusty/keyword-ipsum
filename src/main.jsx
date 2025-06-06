import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ReactGA from "react-ga4";
import './index.css'
import "./assets/fonts/RubikScribble-Regular.woff2";

ReactGA.initialize("G-X3MZ25KN64");

ReactDOM.createRoot(document.querySelector('#root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
