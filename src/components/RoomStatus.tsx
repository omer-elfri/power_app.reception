import { twMerge } from "tailwind-merge";
import BedRoom from "../types/bedroom";
import { colors } from "../types";
import { useAnalysis } from "../hooks/useAnalysis";

export default function RoomStatus({ room:bedRoom, }: {
    room: BedRoom.Type,
    className?: string,
}) {
    const { isObsolet } = useAnalysis();
    return (
        bedRoom.customer ?
            <StatusLabel value="Vendue" style={{ color: colors.sold, backgroundColor: colors.sold+"15" }} />
        : bedRoom.booked ?
            <StatusLabel value="Réservée" style={{ color: colors.coming, backgroundColor: colors.coming+"15" }} />
        : bedRoom.cleaning ?
            <StatusLabel value="Néttoyage" style={{ color: colors.cleaning, backgroundColor: colors.cleaning+"15", }} />
        : isObsolet(bedRoom.id) ?
            <StatusLabel value="Sale" className="text-yellow-700 bg-yellow-700/10" />
        :   <StatusLabel value="Libre" className="text-gray-700 border-1 border-gray-700/45" />
    );
}

export function CleaningState({ room:bedRoom, }: {
    room: BedRoom.Type,
    className?: string,
}) {
    const { isObsolet } = useAnalysis();
    return (
        bedRoom.cleaning ?
            <StatusLabel value="Néttoyage" style={{ color: colors.cleaning, backgroundColor: colors.cleaning+"15", }} />
        : isObsolet(bedRoom.id) ?
            <StatusLabel value="Sale" className="text-yellow-700 bg-yellow-700/10" />
        : <StatusLabel value="Propre" className="text-gray-700 border-1 border-gray-700/45" />
    );
}

export function CustomerState({ room:bedRoom, }: {
    room: BedRoom.Type,
    className?: string,
}) {
    return (
        bedRoom.customer ?
            <StatusLabel value="Vendue" style={{ color: colors.sold, backgroundColor: colors.sold+"15" }} />
        : bedRoom.booked ?
            <StatusLabel value="Réservée" style={{ color: colors.coming, backgroundColor: colors.coming+"15" }} />
        :   <StatusLabel value="Libre" className="text-gray-700 border-1 border-gray-700/45" />
    );
}

export function StatusLabel({ className, style, value }: {
    className?: string,
    style?: React.CSSProperties;
    value: string,
}) {
    return (
        <div className={twMerge("px-2 py-1 uppercase text-[9px] rounded-md", className)} style={style}>
            <span>{value}</span>
        </div>
    );
}
