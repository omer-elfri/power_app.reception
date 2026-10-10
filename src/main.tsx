import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";

import { DataProvider } from "./hooks";
import { AuthProvider } from "./hooks/useAuth";
import { BedRoomProvider } from "./hooks/useBedroom";

import InitComponent from "./Init";
import App from "./App";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <BedRoomProvider>
            <InitComponent />
            <App />
          </BedRoomProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  // {/* </React.StrictMode>, */}
);

