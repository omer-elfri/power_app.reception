import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import "@daypicker/react/style.css";
import "./App.css";

import { DataProvider } from "./hooks";
import { AuthProvider } from "./hooks/useAuth";
import { RequestProvider } from "./hooks/useRequest";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <DataProvider>
        <RequestProvider>
          <App />
        </RequestProvider>
      </DataProvider>
    </AuthProvider>
  </BrowserRouter>
  // {/* </React.StrictMode>, */}
);

