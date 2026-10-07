import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";

import { AuthProvider } from "./hooks/auth";
import { DataProvider } from "./hooks";
import { BedRoomProvider } from "./hooks/bedroom";
import { ReservationProvider } from "./hooks/reservation";

import InitComponent from "./Init";
import App from "./App";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <BedRoomProvider>
            <ReservationProvider>
                <InitComponent />
                <App />
            </ReservationProvider>
          </BedRoomProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  // {/* </React.StrictMode>, */}
);
