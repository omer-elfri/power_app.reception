import React from "react";
import { floorsTabRoomsIds, PageId } from "../../datas/type";
import { twMerge } from "tailwind-merge";
import { useBedRoom } from "../../datas/bedroom_context";
import RoomBox from "./RoomBox";
import { HiLockClosed } from "react-icons/hi";
// import { askConnexion } from "./network";

export default function GlobalPage({ switchPage }: {
    switchPage: (pageId: PageId) => void
}) {
    const { bedRooms, updateBedRoom } = useBedRoom();
    const [server, setServer] = React.useState<WebSocket | null>(null);

    React.useEffect(() => {
        console.log("UseEffect")
        // askConnexion(setServer, updateBedRoom);
        setServer;
        updateBedRoom;

        return () => {
            console.log("useEffect stopped");
            server?.close();
        };
    }, []);

    const StageGroup = React.useCallback(({ children }: {
        children: React.ReactNode[],
    }) => {
        return (
            <div className={twMerge("flex flex-row flex-wrap gap-2 \
                p-2 mx-5", server ? "bg-green-500/20" : "bg-red-500/20")}>
                { children }
            </div>
        );
    }, [server]);

    return (
        <div className="flex flex-col gap-5 p-2">

            <div className="flex flex-row justify-between items-center p-5 bg-gray-100">
                <h1 className="text-3xl font-bold text-red-500">Rooms Page</h1>
                <button onClick={() => switchPage("GLOBAL")}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >Go to Global Page</button>
            </div>

            { floorsTabRoomsIds.map(({floor, bedrooms}) => (
                <StageGroup key={floor}>
                    { bedrooms.map((roomId) => (
                        <RoomBox key={roomId}
                            room={bedRooms[roomId]}
                            server={server}
                        />
                    )) }
                </StageGroup>
            )) }

            { !server && <LoadingPopup /> }

        </div>
    );
}

function LoadingPopup() {
    return (
        <div className="fixed inset-0 flex flex-col justify-center items-center bg-black/90 z-1 p-10 backdrop-blur-[2px]">
            <div className="flex flex-col items-center gap-10 uppercase text-center text-white">
                <p className="text-[30px] font-bold">Serveur inaccessible !</p>
                <HiLockClosed className="text-red-300" size={120} />
                <p className="text-[17px]">Raffraichissez la page pour rééssayer</p>
            </div>
        </div>
    );
}
