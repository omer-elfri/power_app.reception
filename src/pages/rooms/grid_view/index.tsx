'use client'

import { twMerge } from "tailwind-merge";
import { useVisual } from "../../../hooks/useVisual";
import BedRoom from "../../../types/bedroom";

import RoomBox from "./RoomBox";
import { Title } from "../../../components/SectionBox";
import { BiBed } from "react-icons/bi";
import NoElem from "../../../components/NoElem";

export default function GridView({ roomStages, className }: {
    roomStages: [string, BedRoom.Type[]][],
    className?: string,
}) {
    const { addPopup } = useVisual();

    return (
    
        <NoElem list={roomStages}
            Icon={BiBed} size={80} text="Aucune correspondance"
            className="sticky-0 p-2 h-120 border-t-1 border-gray-500/50 text-[13px]">
            
            <div className={twMerge("flex flex-col gap-3", className)}>
                { roomStages.map(([stage, rooms]) => (
                    <div key={stage} className="flex flex-col gap-3">

                        <Title className="border-1 border-gray-400/50 shadow-md px-5 py-2 rounded-sm bg-blue-100/30"
                            right={`${rooms.length} chambres`}>{stage}
                        </Title>

                        <div className="grid grid-cols-4 gap-3">
                            { rooms.map((room) => (
                                <RoomBox key={room.id}
                                    room={room} className="cursor-pointer hover:scale-102"
                                    onClick={() => addPopup(['ROOM', room.id])}
                                />
                            )) }
                        </div>

                    </div>
                )) }
            </div>

        </NoElem>
    );
}
