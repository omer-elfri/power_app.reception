import { twMerge } from "tailwind-merge";

import { colors } from "../types";
import { RoomState } from "../hooks/room";

import { HiLightningBolt } from "react-icons/hi";
import { GiBroom } from "react-icons/gi";
import { FaCalendarAlt } from "react-icons/fa";
import { MdPerson, MdPerson3 } from "react-icons/md";

export default function RoomLine({ room:bedRoom, className }: {
    room: RoomState,
    className?: string,
}) {
    const { infos } = bedRoom;

    return (
        <div className={twMerge("grid grid-cols-[35px_70px_1fr_80px_100px_30px] items-center gap-x-3 py-2 \
            shadow relative text-[11px] font-bold [&>div]:bg-red-40", className)} >

            <div className="flex flex-col">
                <span className="text-[14px]">{bedRoom.id}</span>
                <div className="self-center">{ infos.issueIcon }</div>
            </div>

            <div> {infos.categoryNames} </div>

            <div className={twMerge("flex flex-row items-center gap-2", infos.clientName ? "text-black" : "text-gray-400")}>
                { bedRoom.client ?
                    (bedRoom.client.sexe === 'Mme')
                    ? <MdPerson3 size={15} style={{color: colors.sold}} />
                    : <MdPerson size={15} style={{color: colors.sold}} />
                : null }
                { bedRoom.coming && <FaCalendarAlt size={12} style={{color: colors.coming}} /> }
                <span className="flex-1 text-center">{infos.clientName ?? "libre"}</span>
            </div>

            <div className={twMerge("flex flex-row items-center gap-2", bedRoom.power ? "text-black" : "text-gray-400")}>
                <HiLightningBolt size={14} className={bedRoom.power ? "text-red-600" : ""} />
                <span className="">{infos.powered}</span>
            </div>

            <div className={twMerge("flex flex-row items-center gap-2", bedRoom.cleaning ? "text-black" : "text-gray-400")}>
                <GiBroom size={14} className={bedRoom.cleaning ? "text-blue-600" : ""} />
                <span className="">{infos.cleaning}</span>
            </div>

            <div className="flex flex-row justify-end items-center flex-wrap gap-x-2 gap-y-1 font-bold">
                { infos.isSolded
                ?   <StatusLabel value="Vendue" className="text-green-700 bg-green-700/15" />
                : bedRoom.coming
                ?   <StatusLabel value="Réservée" className="text-purple-700 bg-purple-700/15" />
                :   <StatusLabel value="Libre" className="text-blue-700 bg-blue-700/15" /> }
            </div>

        </div>
    );
}

function StatusLabel({ className, value }: {
    className?: string,
    value: string,
}) {
    return (
        <div className={twMerge("px-2 py-1 uppercase text-[9px] rounded-md", className)}>
            <span>{value}</span>
        </div>
    );
}
