import React from "react";
import { twMerge } from "tailwind-merge";

import BedRoom from "../types/bedroom";
import { TbCategoryMinus } from "react-icons/tb";

export default function RoomLine({ room: bedRoom, className, onClick }: {
    room: BedRoom.Type,
    onClick: () => void,
    className?: string,
}) {
    const [power, setPower] = React.useState(bedRoom.power);

    React.useEffect(() => {
        if (bedRoom.power !== 'NONE')
            setPower(bedRoom.power);
    }, [bedRoom.power]);

    const g = [
        "border-green-700",
        // "border-purple-700",
        "border-red-700",
        // "border-yellow-700",
        "border-blue-700",
    ];
    const e = g[parseInt(bedRoom.id) % g.length];

    return (
        <div className={twMerge("grid grid-cols-[35px_1fr_1fr_1fr_auto] [&>div]:pl-3 items-center gap-x-2 shadow py-2 pl-3 relative cursor-pointer " + e + " border-l-3 rounded-l text-[12px] font-bold", className)} onClick={onClick}>

            <div className="font-bold text-[14px] text-center">{bedRoom.id}</div>

            <div className="font-bold text-[11px]">{bedRoom.categories.map((category) => (
                <p key={category.id}>{category.name}</p>
            ))}</div>

            <div className="flex flex-row items-center gap-1">
                <TbCategoryMinus />
                <span className="">Réservé</span>
            </div>

            <div className="flex flex-row items-center gap-1">
                <TbCategoryMinus />
                <span className="">Alimenté</span>
            </div>

            <div className="flex flex-row justify-center font-bold">
                <p className="px-2 py-1 text-[9px] text-green-700 bg-green-700/15 rounded-md">VENDU</p>
            </div>

        </div>
    );
}
