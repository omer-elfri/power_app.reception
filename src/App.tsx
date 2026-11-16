'use client'

import React from "react";
import { twMerge } from "tailwind-merge";
import { Route, Routes } from "react-router-dom";
import { useVisual } from "./hooks/useVisual";

import LoginPage from "./pages/login";
import GlobalPage from "./pages/global";
import RoomsPage from "./pages/rooms";
import Alert from "./components/Alert";

import Popup from "./popups";
import RoomPopup from "./popups/[roomId]";
import ValletPopup from "./popups/vallet";
import SessionPopup from "./popups/user_session";
import ChangePassPopup from "./popups/user_session/change_pass";
import ReservationTab from "./popups/reservation";
import CleanTab from "./popups/clean";
import BedRoomTab from "./popups/bedroom";
import RestaurantTab from "./popups/restaurant";
import RoomRestoPopup from "./popups/restaurant/[id]";

export default function App() {
  const { loading } = useVisual();
  // useServer();

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

      <CurrentPopup />
      <ConnexionStatus />
      { loading && <Loading /> }
    </div>
  );
}

function Loading() {
  return (
    <div className="flex justify-center items-center p-3 fixed inset-0 bg-black/10 backdrop-blur-[2px] z-102">
      <p className="font-bold text-black text-[14px] uppercase">Chargement ...</p>
    </div>
  );
}

function CurrentPopup() {
  const { popupList } = useVisual();
  const popup = popupList.at(0);

  if (!popup) return;

  return <Popup>{
    popup[0] === 'BEDROOM' ? <BedRoomTab status={popup[1]} /> :
    popup[0] === 'CLEANING' ? <CleanTab /> :
    popup[0] === 'RESERVATION' ? <ReservationTab id={popup[1]} /> :
    popup[0] === 'RESTAURANT' ? <RestaurantTab id={popup[1]} /> :
    
    popup[0] === 'ROOM_RESTO' ? <RoomRestoPopup id={popup[1]} /> :
    popup[0] === 'ROOM' ? <RoomPopup roomId={popup[1]} /> :
    popup[0] === 'VALLET' ? <ValletPopup roomId={popup[1]} /> :
    popup[0] === 'CHANGE_PASS' ? <ChangePassPopup /> :
    popup[0] === 'USER' ? <SessionPopup /> : null }
  </Popup>
}

export function ConnexionStatus({ className }: {
    className?: string,
}) {
    const [online, setOnline] = React.useState(navigator.onLine);
    const [show, setShow] = React.useState(false);

    React.useEffect(() => {
        const onOnline = () => setOnline(true);
        const onOffline = () => setOnline(false);

        window.addEventListener('online', onOnline);
        window.addEventListener('offline', onOffline);

        return () => {
            window.removeEventListener('online', onOnline);
            window.removeEventListener('offline', onOffline);
        };
    }, []);

    React.useEffect(() => {
        setShow(true);
        if (!online) return;
        const id = setTimeout(() => setShow(false), 3000);
        return () => clearTimeout(id);
    }, [online]);

    return (
        <div className={twMerge("fixed bottom-5 left-0 right-0 flex justify-center pointer-events-none", className)}>
            <div className={twMerge(
                "px-5 py-3 min-w-[500px] text-center rounded font-bold uppercase",
                "backdrop-blur-md shadow transition-all duration-500 ease-in-out",
                online
                    ? "bg-green-800/30 text-green-800"
                    : "bg-yellow-800/30 text-yellow-800",
                show
                    ? "translate-y-0 opacity-100"
                    : "translate-y-[calc(100%+20px)] opacity-0"
            )}>
                {online ? "Connecté à internet" : "Aucune connexion à internet"}
            </div>
        </div>
    );
}

