import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import "@daypicker/react/style.css";
import "./App.css";

import { DataProvider } from "./hooks";
import { AuthProvider } from "./hooks/useAuth";
import { RequestProvider } from "./hooks/useRequest";
import { VisualProvider } from "./hooks/useVisual";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <BrowserRouter>
    <VisualProvider>
      <AuthProvider>
        <DataProvider>
          <RequestProvider>
            <App />
          </RequestProvider>
        </DataProvider>
      </AuthProvider>
    </VisualProvider>
  </BrowserRouter>
  // {/* </React.StrictMode>, */}
);

