import { Route, Routes } from "react-router-dom";

import LoginPage from "./pages/login";
import GlobalPage from "./pages/global";
import RoomsPage from "./pages/rooms";

export default function App() {
  return (
    <div className="flex flex-col items-center w-screen max-h-screen px-5 py-2">
      <div className="flex flex-col w-full max-w-210">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<GlobalPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
        </Routes>
      </div>
    </div>
  );
}
