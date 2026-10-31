'use client'

import React from "react";
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
import Popup from "./popups";
import { useAuth } from "./hooks/useAuth";
// import { supabase } from "./tools/supabase";
// import { parseDates } from "./tools/date";

export default function App() {
  const { loading } = useAuth();
  useServer();
  // const { bedroom_table, employer_table } = useDataContext();

  // React.useEffect(() => {
  //     (async () => {
  //         const { data } = await supabase
  //             .from('employer_table').select('*')
  //             .overlaps('rules', ['receptionnist', 'cleaner']);
  //         if (!data) return null;
  //         const res = parseDates(data);
  //         employer_table.set(res);
  //     })();
  // }, []);

  // React.useEffect(() => {
  //     (async () => {
  //         const { data } = await supabase
  //             .from('bedroom_table')
  //             .select(`*,
  //               category:bedroom_ctg_table(*),
  //               cleans:cleaning_book(*),
  //               customer:customer_book(*,
  //                 restaurant:restaurant_book(*)
  //               ),
  //               reservations:reservation_book(*),
  //               restaurations:restaurant_book(*)
  //             `);
  //         // console.log("data", data);
  //         if (!data) return null;


  //         bedroom_table.set(tableData => (
  //           data.map(elem => ({
  //             connected: false,
  //             power: null,
  //             ...tableData.find(({ id }) => id === elem.id),
  //             ...elem,
  //           }))
  //         ))
  //     })();
  // }, []);

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

      { loading && (
        <div className="flex justify-center items-center p-3 fixed inset-0 bg-black/10 backdrop-blur-[2px] z-102">
          <p className="font-bold text-black text-[14px] uppercase">Chargement ...</p>
        </div>
      ) }

    </div>
  );
}

function CurrentPopup() {
  const { popupList } = useDataContext();
  const popup = popupList[0];

  if (!popup) return null;
  return <Popup>{
    popup[0] === 'CLEAN' ? <CleaningPopup roomId={popup[1]} /> :
    popup[0] === 'BOOKING' ? <BookingPopup bookId={popup[1]} /> :
    popup[0] === 'LIST' ? <ListPopup status={popup[1]} /> :
    popup[0] === 'ROOM' ? <RoomPopup roomId={popup[1]} /> :
    popup[0] === 'VALLET' ? <ValletPopup roomId={popup[1]} /> :
    popup[0] === 'CHANGE_PASS' ? <ChangePassPopup /> :
    popup[0] === 'USER' ? <SessionPopup /> : null }
  </Popup>
}


// export function ConnexionStatus({ className }: {
//   className?: string,
// }) {
//   const [q, setQ] = React.useState(true);

//   React.useEffect(() => {
//     const id = setTimeout(() => setQ(false), 2000);
//     return () => clearTimeout(id);
//   }, []);

//   return (
//     <div className={twMerge("flex flex-col items-center", className)}>

//       {/* <div className="fixed bottom-5 bg-yellow-800/30 backdrop-blur-md px-5 py-3 min-w-[500px] text-center text-white rounded font-bold uppercase">
//         <span className="w-full text-yellow-800">Aucune connexion à internet</span>
//       </div> */}

//       <div className={twMerge("fixed bg-green-800/30 backdrop-blur-md px-5 py-3 min-w-[500px] text-center text-white rounded font-bold uppercase \
//         shadow animate-1 cursor-pointer hover:scale-102 transition-transform duration-200 ease-in-out", q ? "bottom-[20px]" : "bottom-[-100px]")}>
//         <span className="w-full text-green-800">Connecté à internet</span>
//       </div>

//     </div>
//   );
// }


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
                // show
                //     ? "translate-y-0 opacity-100"
                //     : "translate-y-[150%] opacity-0",
                show
                    ? "translate-y-0 opacity-100"
                    : "translate-y-[calc(100%+20px)] opacity-0"
            )}>
                {online ? "Connecté à internet" : "Aucune connexion à internet"}
            </div>
        </div>
    );
}

