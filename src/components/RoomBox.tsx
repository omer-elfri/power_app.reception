'use client';
import React from "react";

import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import BedRoom from "../types/bedroom";

import { TiWiFi } from "react-icons/ti";
import { ImPower } from "react-icons/im";

export default function RoomBox({ room: bedRoom }: {
    room: BedRoom.Type,
}) {
    const [power, setPower] = React.useState(bedRoom.power);
    const navigate = useNavigate();
    const connected = !(bedRoom.power === "NONE");

    React.useEffect(() => {
        if (bedRoom.power !== 'NONE')
            setPower(bedRoom.power);
    }, [bedRoom.power]);

    return (
        <div className="flex flex-col h-20 shadow rounded-md p-2 relative bg-gray-200 cursor-pointer border-l-3 border-green-700"
            onClick={() => navigate(`/rooms/${bedRoom.id}`)}>

            { (power !== 'NONE') ? ( <>
                
                <div className="flex flex-row justify-between">
                    <h1 className="font-bold text-[15px]">{bedRoom.id}</h1>
                    <div className="flex flex-row gap-1">
                        <TiWiFi size="15" className={twMerge("", connected ? "text-green-600" : "text-gray-400/50")} />
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center flex-1">
                    <ImPower className={twMerge("text-[20px] font-bold",
                        (power === "ON") ? "text-red-600" :
                        (power === "OFF") ? "text-gray-500/50" : "text-gray-500/30"
                    )} />
                </div>

            </> ) : (

                <div className="flex flex-col justify-center items-center flex-1">
                    <h1 className="font-bold text-[15px]">{bedRoom.id}</h1>
                </div>

            ) }

        </div>
    );
}
