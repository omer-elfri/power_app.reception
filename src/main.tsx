import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { BedRoomProvider } from "./datas/context";

import InitComponent from "./Init";
import App from "./App";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BedRoomProvider>
      <BrowserRouter>
        <InitComponent />
        <App />
      </BrowserRouter>
    </BedRoomProvider>
  </React.StrictMode>,
);
