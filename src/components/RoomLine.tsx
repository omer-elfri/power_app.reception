import { twMerge } from "tailwind-merge";

import { room_ctg_datas } from "../configs/room_ctg";
import RoomStatus from "./RoomStatus";
import { useDataContext } from "../hooks";
import { colors } from "../types";

import BedRoom from "../types/bedroom";

import { HiLightningBolt } from "react-icons/hi";
import { GiBroom } from "react-icons/gi";
import { FaCalendarAlt } from "react-icons/fa";
import { MdError, MdWarning } from "react-icons/md";
import { PersonSex2 } from "./PersonSex";

export default function RoomLine({ room:bedRoom, className }: {
    room: BedRoom.Type,
    className?: string,
}) {
    const { getCleaningState, isObsolet } = useDataContext();
    const categoryNames = bedRoom.categories
        .map((ctgId) => ({ id: ctgId, ...room_ctg_datas[ctgId] }) )
        .map(({ name }) => name ).join(", ");
    const clientName = bedRoom.customer?.name ?? bedRoom.booked?.name ?? null;

    const cleaningState = getCleaningState(bedRoom.id);

    return (
        <div className={twMerge("grid grid-cols-[auto_70px_2fr_1fr_1fr_auto] items-center gap-x-5 py-2 \
            shadow relative text-[11px] font-bold [&>div]:bg-red-40", className)} >

            <div className="flex flex-col">
                <span className="text-[14px]">{bedRoom.id}</span>
                <div className="self-center">{
                    (bedRoom.issue?.priority === 'high') ? 
                        <MdError size={15} className="text-red-600" /> :
                    (bedRoom.issue?.priority === 'medium') ?
                        <MdWarning size={15} className="text-yellow-600" /> :
                    (bedRoom.issue?.priority === 'low') ?
                        <MdWarning size={15} className="text-yellow-600" /> :
                    null
                }</div>
            </div>

            <div> {categoryNames} </div>

            <div className={twMerge("flex flex-row items-center gap-2", bedRoom.customer ? "text-black" : "text-gray-400")}>
                { bedRoom.customer
                ? <PersonSex2 sexe={bedRoom.customer.sexe} size={15} />
                : !clientName ? <PersonSex2 size={15} /> : null }
                { bedRoom.booked && <FaCalendarAlt size={12} style={{color: colors.coming}} /> }
                <span className="flex-1 text-center">{clientName?.toUpperCase() ?? "libre"}</span>
            </div>

            <div className={twMerge("flex flex-row items-center gap-2", bedRoom.power ? "text-black" : "text-gray-400")}>
                <HiLightningBolt size={14} className={bedRoom.power ? "text-red-600" : ""} />
                <span className="">{bedRoom.power ? "Allumée" : "Éteinte"}</span>
            </div>

            <div className={twMerge("flex flex-row items-center gap-2", bedRoom.cleaner ? "text-black" : isObsolet(bedRoom.id) ? "text-red-600" : "text-gray-400")}>
                <GiBroom size={14} className={bedRoom.cleaner ? "text-blue-600" : ""} />
                <span className="">{cleaningState}</span>
            </div>

            <RoomStatus room={bedRoom} />

        </div>
    );
}

export function StatusLabel({ className, value }: {
    className?: string,
    value: string,
}) {
    return (
        <div className={twMerge("px-2 py-1 uppercase text-[9px] rounded-md", className)}>
            <span>{value}</span>
        </div>
    );
}
