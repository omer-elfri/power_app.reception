import { twMerge } from "tailwind-merge";
import { useAnalysis } from "../../../hooks/useAnalysis";

import RoomStatus from "../../../components/RoomStatus";
import { PersonSex2 } from "../../../components/PersonSex";
import { colors } from "../../../types";
import BedRoom from "../../../types/bedroom";

import { HiLightningBolt } from "react-icons/hi";
import { GiBroom } from "react-icons/gi";
import { FaCalendarAlt } from "react-icons/fa";
import { MdError, MdWarning } from "react-icons/md";

export default function RoomLine({ room:bedRoom, className }: {
    room: BedRoom.Type,
    className?: string,
}) {
    const { isObsolet } = useAnalysis();
    const clientName = bedRoom.customer?.name ?? bedRoom.booked?.name ?? null;

    const cleaningState = (() => {
        if (!bedRoom.clean) return "...";
        if (bedRoom.cleaning) return bedRoom.cleaning.valet?.name ?? "...";
        if (isObsolet(bedRoom.id)) return "Sale";
        return "Propre";
    })();

    const issueIcon = (
        (bedRoom.issue?.priority === 'high') ? 
            <MdError size={15} className="text-red-600" /> :
        (bedRoom.issue?.priority === 'medium') ?
            <MdWarning size={15} className="text-yellow-600" /> :
        (bedRoom.issue?.priority === 'low') ?
            <MdWarning size={15} className="text-yellow-600" /> :
        null
    );

    return (
        <div className={twMerge("relative text-[11px] font-bold [&>div]:bg-red-40", className)} >

            <div className="flex flex-col">
                <span className="text-[14px]">{bedRoom.id}</span>
            </div>

            <div> {bedRoom.category.name} </div>

            <div className={twMerge("flex flex-row items-center gap-2", bedRoom.customer ? "text-black" : "text-gray-400")}>
                { bedRoom.customer
                ? <PersonSex2 sexe={bedRoom.customer.sexe} size={15} />
                : !clientName ? <PersonSex2 size={15} /> : null }
                { bedRoom.booked && <FaCalendarAlt size={12} style={{color: colors.coming}} /> }
                <span className="flex-1 text-center">{clientName?.toUpperCase() ?? "libre"}</span>
            </div>

            <div className={twMerge("flex flex-row justify-center gap-2", bedRoom.power ? "text-black" : "text-gray-400")}>
                <HiLightningBolt size={14} className={bedRoom.power ? "text-red-600" : ""} />
                <span className="">{bedRoom.power ? "Allumée" : "Éteinte"}</span>
            </div>

            <div className={twMerge("flex flex-row justify-center gap-2", bedRoom.cleaning ? "text-black" : "")}>
                <GiBroom size={14} className={bedRoom.cleaning ? "text-blue-600" : isObsolet(bedRoom.id) ? "text-yellow-600" : "text-gray-400"} />
                <span className="">{cleaningState}</span>
            </div>

            <div className="flex flex-row justify-center">
                <RoomStatus room={bedRoom} />
            </div>

            <div className="flex flex-row justify-end">{issueIcon}</div>

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
