'use client';

import { useCallback, useState } from "react";
import { twMerge } from "tailwind-merge";
import { BedRoomType } from "../datas/bedrooms";

import { TiWiFi } from "react-icons/ti";
import { AiOutlineReload } from "react-icons/ai";

export default function RoomBox({room: bedRoom, server}: {
    room: BedRoomType,
    server: WebSocket | null,
}) {
    const [loading, setLoading] = useState(false);

    const switchPower = useCallback(async () => {
        if (!server)
            return;
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newPower = (
            bedRoom.power === "POWER_OK" ? "POWER_KO" :
            bedRoom.power === "POWER_KO" ? "POWER_OK" :
            bedRoom.power
        );
        server.send(`CH-${bedRoom.id}:${newPower}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        setLoading(false);
    }, [bedRoom, setLoading, server]);


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
            bedRoom.power === "POWER_KO" ? "bg-blue-200" : ""
        )} onClick={switchPower}>

            <div className="flex flex-row gap-1 absolute top-2 right-2">
                <TiWiFi color="green" size="15" className="" />
                { loading && <AiOutlineReload size="15" className="" /> }
            </div>

            <p className="font-bold">{bedRoom.id}</p>

        </div>
    );
}
