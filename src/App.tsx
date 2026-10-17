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
import { twMerge } from "tailwind-merge";
import { MdWarning } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";

export default function App() {
  const { alert, popupList } = useDataContext();

  return (
    <div className="flex flex-col items-center w-screen max-h-screen px-5 py-2">

      <div className="flex flex-col w-full max-w-210">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/preview" element={<GlobalPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
        </Routes>
      </div>

      { popupList.map(popup => (
        popup[0] === 'CLEAN' ? <CleaningPopup key={popup[0]} roomId={popup[1]} /> :
        popup[0] === 'BOOKING' ? <BookingPopup key={popup[0]} bookId={popup[1]} /> :
        popup[0] === 'LIST' ? <ListPopup key={popup[0]} status={popup[1]} /> :
        popup[0] === 'ROOM' ? <RoomPopup key={popup[0]} roomId={popup[1]} /> : null
      )) }

      {/* { popup?.[0] === 'ROOM' && <RoomPopup roomId={popup[1]} /> }
      { popup?.[0] === 'CLEAN' && <CleaningPopup roomId={popup[1]} /> }
      { popup?.[0] === 'BOOKING' && <BookingPopup bookId={popup[1]} /> }
      { popup?.[0] === 'LIST' && <ListPopup status={popup[1]} /> } */}

      { alert && (
        <div className={twMerge("fixed grid grid-cols-[auto_1fr] items-center gap-3 top-5 z-110 px-5 py-3 max-w-[80vw] text-center rounded text-[12px] font-bold flex-1",
          alert[0] === 'success' ? "bg-white/80 text-green-800" :
          alert[0] === 'error' ? "bg-white/80 text-red-800" : "")}>
            { alert[0] === 'success' && <FaCheckCircle size={30} className="" /> }
            { alert[0] === 'error' && <MdWarning size={30} className="" /> }
            <span>{alert[1]}</span>
        </div>
      ) }

    </div>
  );
}
