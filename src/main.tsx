import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BedRoomProvider } from "./datas/bedroom_context";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BedRoomProvider>
      <div className="w-full max-w-210 flex flex-col">
        <App />
      </div>
    </BedRoomProvider>
  </React.StrictMode>,
);
