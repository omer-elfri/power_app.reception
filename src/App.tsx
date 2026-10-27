'use client'

import { twMerge } from "tailwind-merge";
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

import Alert from "./components/Alert";
import React from "react";
import { supabase } from "./tools/supabase";
import Popup from "./popups";

export default function App() {
  useServer();
  const { popupList } = useDataContext();
  const popup = popupList[0];
  
  React.useEffect(() => {
    const today = new Date();
    (async () => {
      const { data, error } = await supabase
        .from('bedrooms').select('*')
        // .lte('date', today.toISOString());
      if (error) throw error;
      console.log("supabase", data);
    })();
  }, [supabase]);

  const [q, setQ] = React.useState(true);
  React.useEffect(() => {
    const id = setTimeout(() => setQ(false), 2000);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className={twMerge("flex flex-col items-center w-screen max-h-screen px-5 py-2 min-w-200")}>

      <Alert />

      <div className="flex flex-col w-full max-w-210">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/preview" element={<GlobalPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
        </Routes>
      </div>



      { popup && <Popup>{
        popup[0] === 'CLEAN' ? <CleaningPopup roomId={popup[1]} /> :
        popup[0] === 'BOOKING' ? <BookingPopup bookId={popup[1]} /> :
        popup[0] === 'LIST' ? <ListPopup status={popup[1]} /> :
        popup[0] === 'ROOM' ? <RoomPopup roomId={popup[1]} /> :
        popup[0] === 'VALLET' ? <ValletPopup roomId={popup[1]} /> :
        popup[0] === 'CHANGE_PASS' ? <ChangePassPopup /> :
        popup[0] === 'USER' ? <SessionPopup /> : null }
      </Popup> }

      {/* <div className="fixed bottom-5 bg-yellow-800/30 backdrop-blur-md px-5 py-3 min-w-[500px] text-center text-white rounded font-bold uppercase">
        <span className="w-full text-yellow-800">Aucune connexion à internet</span>
      </div> */}

      <div className={twMerge("fixed bg-green-800/30 backdrop-blur-md px-5 py-3 min-w-[500px] text-center text-white rounded font-bold uppercase \
        shadow animate-1 cursor-pointer hover:scale-102 transition-transform duration-200 ease-in-out", q ? "bottom-[20px]" : "bottom-[-100px]")}>
        <span className="w-full text-green-800">Connecté à internet</span>
      </div>

    </div>
  );
}

