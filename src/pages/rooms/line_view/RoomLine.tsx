import { twMerge } from "tailwind-merge";
import BedRoom from "../../../types/bedroom";

import { CleaningState, CustomerState } from "../../../components/RoomStatus";
import { HiLightningBolt } from "react-icons/hi";
import { MdError, MdWarning } from "react-icons/md";

export default function RoomLine({ room:bedRoom, className }: {
    room: BedRoom.Type,
    className?: string,
}) {
    return (
        <div className={twMerge("relative text-[11px] font-bold [&>div]:bg-red-40", className)} >

            <div className="flex flex-col">
                <span className="text-[14px]">{bedRoom.id}</span>
            </div>

            <div>{bedRoom.category.name}</div>

            <div className={twMerge("flex flex-row justify-center gap-2", bedRoom.power ? "text-black" : "text-gray-400")}>
                <HiLightningBolt size={14} className={bedRoom.power ? "text-red-600" : ""} />
                {/* <span className="">{bedRoom.power ? "Allumée" : "Éteinte"}</span> */}
            </div>

            <div className="flex flex-row justify-center">
                { bedRoom.clean?.valet?.name }
            </div>

            <div className="flex flex-row justify-center">
                <CleaningState room={bedRoom} />
            </div>

            <div className="flex flex-row justify-center">
                { ( bedRoom.customer?.name ?? bedRoom.booked?.name ?? "" ).toUpperCase() }
            </div>

            <div className="flex flex-row justify-center">
                <CustomerState room={bedRoom} />
            </div>

            <div className="flex flex-row justify-end">
                {
                    (bedRoom.issue?.priority === 'high') ? 
                        <MdError size={15} className="text-red-600" /> :
                    (bedRoom.issue?.priority === 'medium') ?
                        <MdWarning size={15} className="text-yellow-600" /> :
                    (bedRoom.issue?.priority === 'low') ?
                        <MdWarning size={15} className="text-yellow-600" /> :
                    null
                }
            </div>

        </div>
    );
}
