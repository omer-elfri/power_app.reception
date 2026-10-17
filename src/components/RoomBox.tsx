import { twMerge } from "tailwind-merge";
import BedRoom from "../types/bedroom";

import { MdError, MdWarning } from "react-icons/md";
import { HiLightningBolt } from "react-icons/hi";
import { GiBroom } from "react-icons/gi";
import { FaWifi } from "react-icons/fa";

export default function RoomBox({ room:bedRoom, className }: {
    room: BedRoom.Type,
    className?: string,
}) {
    return (
        <div className={twMerge("flex flex-col gap-x-2 gap-y-2 bg-white p-2 rounded-md relative border-1", className)}>

            <div className="flex flex-row gap-2 text-gray-700">
                <h2 className="flex-1 font-bold text-[13px]">{bedRoom.id}</h2>

                { !bedRoom.connected && <FaWifi size={14} /> }
                { bedRoom.cleaner && <GiBroom size={14} className="text-blue-600" /> }

                { (bedRoom.issue?.priority === 'high') ? 
                    <MdError size={15} className="text-red-600" /> :
                (bedRoom.issue?.priority === 'medium') ?
                    <MdWarning size={15} className="text-yellow-600" /> :
                (bedRoom.issue?.priority === 'low') ?
                    <MdWarning size={15} className="text-yellow-600" /> :
                null }
            </div>

            <div className="flex flex-col justify-center items-center gap-y-2 flex-1 min-h-10 pb-2">
                <HiLightningBolt size={18} className={bedRoom.power ? "text-red-600" : "text-gray-400/60"} />
            </div> <hr className="text-gray-400/50" />

            <div className="flex flex-row items-center gap-2">
                { bedRoom.customer
                ? <div className="aspect-square w-2 bg-red-600 rounded-full" />
                : <div className="aspect-square w-2 bg-gray-600/50 rounded-full" /> }
                <p className="flex flex-row gap-2 text-[10px] font-bold">
                    { bedRoom.customer?.name ?? "Disponible" }
                </p>
            </div>

        </div>
    );
}
