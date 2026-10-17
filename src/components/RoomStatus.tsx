import { twMerge } from "tailwind-merge";

import BedRoom from "../types/bedroom";

export default function RoomStatus({ room:bedRoom }: {
    room: BedRoom.Type,
    className?: string,
}) {
    return (
        bedRoom.customer
        ?   <StatusLabel value="Vendue" className="text-green-700 bg-green-700/15" />
        : bedRoom.booked
        ?   <StatusLabel value="Réservée" className="text-purple-700 bg-purple-700/15" />
        :   <StatusLabel value="Libre" className="text-blue-700 bg-blue-700/15" />
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
