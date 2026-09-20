'use client';

import React from "react";
import { twMerge } from "tailwind-merge";
import { BedRoomType, useBedRoom } from "../../../datas/bedroom_context";

import { TiWiFi } from "react-icons/ti";
import { ImPower } from "react-icons/im";
import { sendNotification } from "@tauri-apps/plugin-notification";

export default function RoomBox({ room: bedRoom }: {
    room: BedRoomType,
}) {
    const { bedRooms, bedroomModal, setBedroomModal } = useBedRoom();

    const openEditTools = React.useCallback(async () => {


            sendNotification({
                title: `Chambre ${bedRoom.id}`,
                body: (bedRoom.power === "POWER_OK") ?
                        "Chambre alimentée" :
                    (bedRoom.power === "POWER_KO") ?
                        "Chambre éteinte" :
                    "Chambre déconnectée",
            });

        if (bedroomModal === bedRoom.id)
            setBedroomModal(null);
        else
            setBedroomModal(bedRoom.id);
    }, [bedroomModal, bedRoom]);

    const espConnected = (bedRooms[bedRoom.id].power != "DISCONNECTED");

    if (!espConnected) return (
        <div className={twMerge("flex flex-col cursor-pointer \
            aspect-square rounded p-2 relative bg-gray-200",
            (bedroomModal === bedRoom.id) ? "border-2 border-blue-400/50" : ""
        )} onClick={openEditTools}>
            <div className="flex flex-col justify-center items-center flex-1">
                <h1 className="font-bold text-[15px]">{bedRoom.id}</h1>
            </div>
        </div>
    );

    return (
        <div className={twMerge("flex flex-col \
            aspect-square rounded p-2 relative bg-gray-200 cursor-pointer",
            (bedroomModal === bedRoom.id) ? "border-2 border-blue-400/50" : ""
        )} onClick={openEditTools}>

            <div className="flex flex-row justify-between">
                <h1 className="font-bold text-[15px]">{bedRoom.id}</h1>
                <div className="flex flex-row gap-1">
                    { espConnected && <TiWiFi color="green" size="15" className="" /> }
                </div>
            </div>

            <div className="flex flex-col justify-center items-center flex-1">
                <ImPower className={twMerge("text-[20px] font-bold text-red-500/30",
                    (bedRoom.power === "POWER_OK") ? "text-red-500" :
                    (bedRoom.power === "POWER_KO") ? "text-gray-500/50" : "bg-gray-500"
                )} />
            </div>

        </div>
    );
}
