import { twMerge } from "tailwind-merge";

import { colors } from "../types";
import BedRoom from "../types/bedroom";

import { HiLightningBolt } from "react-icons/hi";
import { GiBroom } from "react-icons/gi";
import { FaCalendarAlt } from "react-icons/fa";
import { MdError, MdPerson, MdPerson3, MdWarning } from "react-icons/md";
import { room_ctg_datas } from "../configs/room_ctg";
import { useDataContext } from "../hooks";

export default function RoomLine({ room:bedRoom, className }: {
    room: BedRoom.Type,
    className?: string,
}) {
    const { lastCleaneds } = useDataContext();
    const categoryNames = bedRoom.categories
        .map((ctgId) => ({ id: ctgId, ...room_ctg_datas[ctgId] }) )
        .map(({ name }) => name ).join(", ");
    const clientName = bedRoom.checkIn?.clientName ?? bedRoom.booked?.clientName ?? null;

    const cleaningState = (() => {
        const lastCleaned = lastCleaneds[bedRoom.id];
        if (!lastCleaned) return "...";
        const now = new Date(Date.now());
        const endDate = (('end' in lastCleaned) && lastCleaned.end) ?? lastCleaned.date;
        if (!endDate) return lastCleaned.valletName;
        const res = endDate.getTime() - now.getTime() > 3*24*60*60*1000;
        return !res ? "Propre" : "Non";
    })();

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

            <div className={twMerge("flex flex-row items-center gap-2", clientName ? "text-black" : "text-gray-400")}>
                { bedRoom.checkIn ?
                    (bedRoom.checkIn.sexe === 'Mme')
                    ? <MdPerson3 size={15} style={{color: colors.sold}} />
                    : <MdPerson size={15} style={{color: colors.sold}} />
                : <MdPerson size={15} /> }
                { bedRoom.booked && <FaCalendarAlt size={12} style={{color: colors.coming}} /> }
                <span className="flex-1 text-center">{clientName ?? "libre"}</span>
            </div>

            <div className={twMerge("flex flex-row items-center gap-2", bedRoom.power ? "text-black" : "text-gray-400")}>
                <HiLightningBolt size={14} className={bedRoom.power ? "text-red-600" : ""} />
                <span className="">{bedRoom.power ? "Allumée" : "Éteinte"}</span>
            </div>

            <div className={twMerge("flex flex-row items-center gap-2", bedRoom.cleaner ? "text-black" : "text-gray-400")}>
                <GiBroom size={14} className={bedRoom.cleaner ? "text-blue-600" : ""} />
                <span className="">{cleaningState}</span>
            </div>

            <div className="flex flex-row justify-end items-center flex-wrap gap-x-2 gap-y-1 font-bold">
                { bedRoom.checkIn
                ?   <StatusLabel value="Vendue" className="text-green-700 bg-green-700/15" />
                : bedRoom.booked
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
