'use client'

import { Route, Routes } from "react-router-dom";
import { useServer } from "./hooks/useServer";
import { useDataContext } from "./hooks";

import LoginPage from "./pages/login";
import GlobalPage from "./pages/global";
import RoomsPage from "./pages/rooms";

import BookingPopup from "./popups/booking";
import CleaningPopup from "./popups/clean";
import RoomPopup from "./popups/[roomId]";
import ListPopup from "./popups/list";
import ValletPopup from "./popups/vallet";
import SessionPopup from "./popups/user_session";
import ChangePassPopup from "./popups/user_session/change_pass";

import Alert from "./Alert";

export default function App() {
  useServer();
  const { popupList, } = useDataContext();
  const popup = popupList[0];

  return (
    <div className="flex flex-col items-center w-screen max-h-screen px-5 py-2 min-w-200">

      <div className="flex flex-col w-full max-w-210">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/preview" element={<GlobalPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
        </Routes>
      </div>

      { popup && (
        popup[0] === 'CLEAN' ? <CleaningPopup roomId={popup[1]} /> :
        popup[0] === 'BOOKING' ? <BookingPopup bookId={popup[1]} /> :
        popup[0] === 'LIST' ? <ListPopup status={popup[1]} /> :
        popup[0] === 'ROOM' ? <RoomPopup roomId={popup[1]} /> :
        popup[0] === 'VALLET' ? <ValletPopup roomId={popup[1]} /> :
        popup[0] === 'CHANGE_PASS' ? <ChangePassPopup /> :
        popup[0] === 'USER' ? <SessionPopup /> : null
      ) }

      <Alert />

    </div>
  );
}

