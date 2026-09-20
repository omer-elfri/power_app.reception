import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BedRoomProvider } from "./datas/bedroom_context";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BedRoomProvider>
      <App />
    </BedRoomProvider>
  </React.StrictMode>,
);
