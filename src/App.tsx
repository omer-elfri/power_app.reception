'use client'

import { Route, Routes } from "react-router-dom";
import { useDataContext } from "./hooks";

import LoginPage from "./pages/login";
import GlobalPage from "./pages/global";
import RoomsPage from "./pages/rooms";
import BookingPopup from "./popups/BookingPopup";
import CleaningPopup from "./popups/CleaningPopup";
import RoomPopup from "./popups/RoomPopup";

export default function App() {
  const { roomPopup, bookingPopup, cleaningPopup } = useDataContext();

  return (
    <div className="flex flex-col items-center w-screen max-h-screen px-5 py-2">

      <div className="flex flex-col w-full max-w-210">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/preview" element={<GlobalPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
        </Routes>
      </div>

      { roomPopup && <RoomPopup /> }
      { bookingPopup && <BookingPopup /> }
      { cleaningPopup && <CleaningPopup /> }

    </div>
  );
}
