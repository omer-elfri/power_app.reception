'use client';

import React from "react";
import { twMerge } from "tailwind-merge";
import { BedRoomType, useBedRoom } from "../../../datas/bedroom_context";

import { TiWiFi } from "react-icons/ti";
import { AiOutlineReload } from "react-icons/ai";
import { invoke } from "@tauri-apps/api/core";
import { PiPower } from "react-icons/pi";
import { ImPower } from "react-icons/im";

export default function RoomBox({ room: bedRoom, loading, setLoading }: {
    room: BedRoomType,
    loading: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
}) {
    const { bedRooms, bedroomModal, setBedroomModal } = useBedRoom();

    const switchPower = React.useCallback(async () => {

        setBedroomModal(bedRoom.id);

        return;

        const newPower = (
            bedRoom.power === "POWER_OK" ? "POWER_KO" :
            bedRoom.power === "POWER_KO" ? "POWER_OK" :
            "DISCONNECTED"
        );
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        await invoke("power_control", {
            roomId: bedRoom.id,
            power: newPower,
        });
    }, [bedRoom, setLoading]);

    const espConnected = (bedRooms[bedRoom.id].power != "DISCONNECTED");

    return (
        <div className={twMerge("flex flex-col \
            aspect-square rounded p-2 relative bg-gray-200",
            loading ? "cursor-wait" : "cursor-pointer",
            // bedRoom.power === "POWER_OK" ? "bg-green-200" :
            // bedRoom.power === "POWER_KO" ? "bg-blue-200" : "bg-gray-200",
            (bedroomModal === bedRoom.id) ? "border-2 border-blue-400/50" : ""
        )} onClick={switchPower}>

            <div className="flex flex-row justify-between">
                <h1 className="font-bold text-[15px]">{bedRoom.id}</h1>
                <div className="flex flex-row gap-1">
                    { espConnected && <TiWiFi color="green" size="15" className="" /> }
                    { loading && <AiOutlineReload size="15" className="" /> }
                </div>
            </div>

            <div className="flex flex-col justify-center items-center flex-1">
                { (bedRoom.power === "POWER_OK") &&
                    <ImPower className="text-[20px] font-bold text-red-500" /> }
                { (bedRoom.power === "POWER_KO") &&
                    <ImPower className="text-[20px] font-bold text-gray-500" /> }
                {/* <p className="font-bold">{bedRoom.id}</p> */}
            </div>

        </div>
    );
}
