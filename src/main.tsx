import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import "@daypicker/react/style.css";
import "./App.css";

import { DataProvider } from "./hooks";
import { AuthProvider } from "./hooks/useAuth";
import { BedRoomProvider } from "./hooks/useBedroom";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <DataProvider>
        <BedRoomProvider>
          <App />
        </BedRoomProvider>
      </DataProvider>
    </AuthProvider>
  </BrowserRouter>
  // {/* </React.StrictMode>, */}
);

