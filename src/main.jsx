import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import {installFavicon} from './ui/favicon.js';
import "./styles.css";
import "./ui/world-chrome.css";
import "./ui/loading-screen.css";
import "./ui/ending-sequence.css";
import "./ui/world-cursor.css";
import "./ui/detail-view.css";
import "./ui/artwork-view.css";
import "./ui/mobile-readers.css";

const stopFavicon=installFavicon(document,matchMedia('(prefers-color-scheme: dark)'),import.meta.env.BASE_URL);
if(import.meta.hot)import.meta.hot.dispose(stopFavicon);
createRoot(document.getElementById("root")).render(
  <App />,
);
