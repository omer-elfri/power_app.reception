import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BedRoomProvider } from "./datas/bedroom_context";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <div className="w-full h-full flex justify-center items-center bg-gray-100">
      <BedRoomProvider>
        <div className="w-full max-w-210 flex flex-col">
          <App />
        </div>
      </BedRoomProvider>
    </div>
  </React.StrictMode>,
);
