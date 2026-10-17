'use client'

import { Route, Routes } from "react-router-dom";
import { useDataContext } from "./hooks";

import LoginPage from "./pages/login";
import GlobalPage from "./pages/global";
import RoomsPage from "./pages/rooms";

import BookingPopup from "./popups/booking";
import CleaningPopup from "./popups/clean";
import RoomPopup from "./popups/[roomId]";
import ListPopup from "./popups/list";

export default function App() {
  const { popup } = useDataContext();

  return (
    <div className="flex flex-col items-center w-screen max-h-screen px-5 py-2">

      <div className="flex flex-col w-full max-w-210">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/preview" element={<GlobalPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
        </Routes>
      </div>

      { popup?.[0] === 'ROOM' && <RoomPopup roomId={popup[1]} /> }
      { popup?.[0] === 'CLEAN' && <CleaningPopup roomId={popup[1]} /> }
      { popup?.[0] === 'BOOKING' && <BookingPopup bookId={popup[1]} /> }
      { popup?.[0] === 'LIST' && <ListPopup status={popup[1]} /> }

    </div>
  );
}
