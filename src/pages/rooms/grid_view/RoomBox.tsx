import { twMerge } from "tailwind-merge";
import { useAnalysis } from "../../../hooks/useAnalysis";
import BedRoom from "../../../types/bedroom";
import { colors } from "../../../types";

import { MdError, MdWarning } from "react-icons/md";
import { HiLightningBolt } from "react-icons/hi";

export default function RoomBox({ room:bedRoom, onClick, className }: {
    room: BedRoom.Type,
    onClick: () => void,
    className?: string,
}) {
    const { isObsolet } = useAnalysis();

    return (
        <div className={twMerge("flex flex-col gap-x-2 gap-y-2 bg-white p-2 rounded-md relative border-1 border-gray-400",
            className, bedRoom.connected ? "shadow-md" : "opacity-50")} onClick={onClick}>

            <div className="flex flex-row gap-2">
                <h2 className="flex-1 font-bold text-[15px]">{bedRoom.id}</h2>

                <HiLightningBolt size={15} className={bedRoom.power ? "text-red-600" : "text-gray-400/60"} />

                { (bedRoom.issue?.priority === 'high') ? 
                    <MdError size={15} className="text-red-600" /> :
                (bedRoom.issue?.priority === 'medium') ?
                    <MdWarning size={15} className="text-yellow-600" /> :
                (bedRoom.issue?.priority === 'low') ?
                    <MdWarning size={15} className="text-yellow-600" /> :
                null }
            </div>

            <RoundedBull
                color={bedRoom.cleaning ? colors.cleaning : isObsolet(bedRoom.id) ? "bg-yellow-600" : ""}
                text={ bedRoom.cleaning?.valet?.name ?? (isObsolet(bedRoom.id) ? "Sale" : "Propre") }
            />
            <RoundedBull
                color={bedRoom.customer ? colors.sold : ""}
                text={ bedRoom.customer?.name.toUpperCase() ?? "Disponible" }
            />
        </div>
    );
}

function RoundedBull({ className, color, text }: {
    className?: string,
    color?: string,
    text: string,
}) {
    return (
        <div className={twMerge("flex flex-row items-center gap-2 border-t-1 border-gray-400/50 pt-[3px]", className)}>
            <div className={twMerge("aspect-square w-2 rounded-full bg-gray-600/30", color)} />
            <p className="text-[10px] text-gray-600 font-bold">{ text }</p>
        </div>
    );
}
