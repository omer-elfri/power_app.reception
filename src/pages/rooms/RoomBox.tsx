'use client';

import React from "react";
import { twMerge } from "tailwind-merge";
import { BedRoomType } from "../../datas/bedroom_context";

import { TiWiFi } from "react-icons/ti";
import { AiOutlineReload } from "react-icons/ai";
import { invoke } from "@tauri-apps/api/core";

export default function RoomBox({ room: bedRoom, loading, setLoading }: {
    room: BedRoomType,
    loading: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
}) {
    const switchPower = React.useCallback(async () => {
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

    if (bedRoom.power === "DISCONNECTED") return (
        <div className={twMerge("flex flex-col justify-center items-center \
            aspect-square w-30 rounded p-2 relative bg-gray-200")}>
            <p className="font-bold">{bedRoom.id}</p>
        </div>
    );

    return (
        <div className={twMerge("flex flex-col justify-center items-center \
            aspect-square w-30 rounded p-2 relative",
            loading ? "cursor-wait" : "cursor-pointer",
            bedRoom.power === "POWER_OK" ? "bg-green-200" :
            bedRoom.power === "POWER_KO" ? "bg-blue-200" : "bg-gray-200"
        )} onClick={switchPower}>

            <div className="flex flex-row gap-1 absolute top-2 right-2">
                <TiWiFi color="green" size="15" className="" />
                { loading && <AiOutlineReload size="15" className="" /> }
            </div>

            <p className="font-bold">{bedRoom.id}</p>

        </div>
    );
}
