import { twMerge } from "tailwind-merge";

import { HiLightningBolt } from "react-icons/hi";
import { GiBroom } from "react-icons/gi";
import { FaWifi } from "react-icons/fa";
import BedRoom from "../types/bedroom";
import { getInfos } from "../tools";

export default function RoomBox({ room:bedRoom, className }: {
    room: BedRoom.Type,
    className?: string,
}) {
    const infos = getInfos(bedRoom);

    return (
        <div className={twMerge("flex flex-col gap-x-2 gap-y-2 bg-white p-2 px-5 rounded-md relative pt-7 border-1", className)}>

            <h2 className="px-2 py-1 rounded absolute top-[-12px] text-[16px] font-bold bg-white border-1">{bedRoom.id}</h2>
            <div className="flex flex-row gap-2 flex-wrap justify-end absolute top-2 left-18 right-2 text-gray-400">
                { !bedRoom.connected && <FaWifi size={14} /> }
                {  <GiBroom size={14} className="text-blue-600" /> }
                <HiLightningBolt size={14} className={bedRoom.power ? "text-red-600" : ""} />
                { infos.issueIcon }
            </div>

            <div className="flex flex-col gap-y-2 flex-1">
                <h3 className="text-[12px] font-bold">{infos.categoryNames}</h3>

                <div className="grid grid-cols-[1fr_auto] gap-x-2 text-[11px] \
                    [&>h3]:text-black [&>h3]:font-bold [&>h3]:text-[9px] \
                    [&>p]:text-end [&>p]:text-gray-500">

                </div>

            </div> <hr className="text-gray-400/50" />

            <div className="flex flex-row items-center gap-2">
                { infos.isSolded
                ? <div className="aspect-square w-2 bg-red-600 rounded-full" />
                : <div className="aspect-square w-2 bg-green-600 rounded-full" /> }
                <p className="flex flex-row gap-2 text-[10px] font-bold">
                    { bedRoom.client?.name ?? "Disponible" }
                </p>
            </div>

        </div>
    );
}
