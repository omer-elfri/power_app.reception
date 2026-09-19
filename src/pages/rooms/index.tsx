import React from "react";
import { listen } from "@tauri-apps/api/event";
import { HiLockClosed } from "react-icons/hi";

import { useBedRoom } from "../../datas/bedroom_context";
import { BedRoomId, floorsTabRoomsIds, PageId, PowerStatus } from "../../datas/type";
import RoomBox from "./RoomBox";

export default function RoomsPage({ switchPage }: {
    switchPage: (pageId: PageId) => void
}) {
    const { bedRooms, updateBedRoom } = useBedRoom();
    const [loading, setLoading] = React.useState(false);
    const [goodIp] = React.useState(true);

    React.useEffect(() => { // reponse du serveur
        const unlisten = listen<{
            room_id: BedRoomId;
            power: PowerStatus;
        }>("power-status", (event) => {
            const { room_id:roomId, power } = event.payload;
            updateBedRoom(roomId, { power });
            setLoading(false);
        });
        return () => {
            unlisten.then((fn) => fn());
        };
    }, []);

    return (
        <div className="flex flex-col gap-5 p-2">

            <div className="flex flex-row justify-between items-center p-5">
                <h1 className="text-3xl font-bold">Rooms Page</h1>
                <button onClick={() => switchPage("GLOBAL")}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >Go to Global Page</button>
            </div>

            { floorsTabRoomsIds.map(({floor, bedrooms}) => (
                <div key={floor} className="flex flex-row flex-wrap gap-2 p-2 mx-5 bg-green-500/20">
                    { bedrooms.map((roomId) => (
                        <RoomBox key={roomId}
                            room={bedRooms[roomId]}
                            loading={loading}
                            setLoading={setLoading}
                        />
                    )) }
                </div>
            )) }

            { !goodIp && <LoadingPopup /> }

        </div>
    );
}

function LoadingPopup() {
    return (
        <div className="fixed inset-0 flex flex-col justify-center items-center bg-black/90 z-1 p-10 backdrop-blur-[2px]">
            <div className="flex flex-col items-center gap-10 uppercase text-center text-white">
                <p className="text-[30px] font-bold">Equipement illégible</p>
                <HiLockClosed className="text-red-300" size={120} />
                <p className="text-[17px]">Raffraichissez la page pour rééssayer</p>
            </div>
        </div>
    );
}
