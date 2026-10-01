import { twMerge } from "tailwind-merge";

import BedRoom from "../types/bedroom";
import { RoomInfos } from "../pages/rooms/Infoss";

import { HiLightningBolt } from "react-icons/hi";
import { GiBroom } from "react-icons/gi";
import { FaCalendarAlt } from "react-icons/fa";
import { MdPerson, MdPerson3 } from "react-icons/md";
import { colors } from "../types";

export default function RoomLine({ room:bedRoom, getInfos, className }: {
    room: BedRoom.Type,
    getInfos: (room: BedRoom.Type) => RoomInfos,
    className?: string,
}) {
    const infos = getInfos(bedRoom);

    return (
        <div className={twMerge("grid grid-cols-[35px_70px_1fr_80px_100px_30px] items-center gap-x-3 py-2 \
            shadow relative text-[11px] font-bold [&>div]:bg-red-40", className)} >

            <div className="flex flex-col">
                <span className="text-[14px]">{bedRoom.id}</span>
                <div className="self-center">{ infos.issueIcon }</div>
            </div>

            <div> {infos.categoryNames} </div>

            <div className={twMerge("flex flex-row items-center gap-2", infos.clientName ? "text-black" : "text-gray-400")}>
                { bedRoom.coming
                ? <FaCalendarAlt size={12} style={{color: colors.coming}} />
                : bedRoom.check_in ?
                    (bedRoom.check_in.sexe === 'Mme')
                    ? <MdPerson3 size={15} style={{color: colors.sold}} />
                    : <MdPerson size={15} style={{color: colors.sold}} />
                : <MdPerson size={15} /> }
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
                { infos.isSolded ?
                    <p className="px-2 py-1 uppercase text-[9px] text-green-700 bg-green-700/15 rounded-md">Vendu</p> :
                    <p className="px-2 py-1 uppercase text-[9px] text-blue-700 bg-blue-700/15 rounded-md">Libre</p> }
            </div>

        </div>
    );
}
