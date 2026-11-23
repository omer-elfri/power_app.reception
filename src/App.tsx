import { twMerge } from "tailwind-merge";
import { Route, Routes } from "react-router-dom";

import Alert from "./components/dynamic/Alert";
import CurrentPopup from "./components/dynamic/Popup";
import NetworkStatus from "./components/dynamic/NetworkStatus";
import Loading from "./components/dynamic/Loading";

import LoginPage from "./pages/login";
import GlobalPage from "./pages/global";
import RoomsPage from "./pages/rooms";

export default function App() {
  // useServer();

  return (
    <div className={twMerge("flex flex-col items-center w-screen max-h-screen px-5 pb-2 min-w-220")}>
      <Alert />

      <div className="flex flex-col w-full max-w-210">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/preview" element={<GlobalPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
        </Routes>
      </div>

      <CurrentPopup />
      <NetworkStatus />
      <Loading />
    </div>
  );
}

