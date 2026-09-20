import React from "react";
import { listen } from "@tauri-apps/api/event";
import { HiLockClosed } from "react-icons/hi";

import { useBedRoom } from "../../datas/bedroom_context";
import { BedRoomId, floorsTabRoomsIds, PageId, PowerStatus } from "../../datas/type";
import RoomBox from "./components/RoomBox";
import { PageMain } from "../../App";
import BedRoomModal from "./components/BedRoomModal";

export default function RoomsPage({ switchPage }: {
    switchPage: (pageId: PageId) => void
}) {
    const { bedRooms, updateBedRoom, bedroomModal } = useBedRoom();
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

    return ( <>

        <PageMain topClassName="flex-1" className="gap-10">

            <div className="flex flex-row justify-between items-center flex-wrap gap-3 border-b-1 border-gray-400/50 py-5">
                <h1 className="text-3xl font-bold">Rooms Page</h1>
                <button onClick={() => switchPage("GLOBAL")}
                    className="bg-blue-500 hover:bg-blue-700 text-white"
                >Go to Global Page</button>
            </div>

            <div className="flex flex-col gap-5 flex-1">
                { floorsTabRoomsIds.map(({floor, bedrooms}) => (

                    <div key={floor} className="grid grid-cols-[repeat(auto-fit,100px)] gap-2">
                        { bedrooms.map((roomId) => (

                            <RoomBox key={roomId}
                                room={bedRooms[roomId]}
                                loading={loading}
                                setLoading={setLoading}
                            />
                            
                        )) }
                    </div>

                )) }
            </div>
        </PageMain> 

        { bedroomModal && (
            <PageMain topClassName="">
                <BedRoomModal />
            </PageMain>
        ) }

        { !goodIp && <NoServer /> }

    </> );
}

function NoServer() {
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
