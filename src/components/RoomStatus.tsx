import { twMerge } from "tailwind-merge";

import BedRoom from "../types/bedroom";

export default function RoomStatus({ room:bedRoom, label }: {
    room: BedRoom.Type,
    label?: string,
    className?: string,
}) {
    label ??=
        bedRoom.customer ? "Vendue"
        : bedRoom.booked ? "Réservée"
        // : bedRoom.cleaning ? "Néttoyage"
        : "Libre";
    return (
        label === "Néttoyage"
        ?   <StatusLabel value={label} className="text-blue-700 bg-blue-700/15" />
        : label === "Vendue"
        ?   <StatusLabel value={label} className="text-green-700 bg-green-700/15" />
        : label === "Réservée"
        ?   <StatusLabel value={label} className="text-purple-700 bg-purple-700/15" />
        : label === "Libre"
        ?   <StatusLabel value={label} className="text-gray-700 bg-gray-700/15" />
        : null
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
