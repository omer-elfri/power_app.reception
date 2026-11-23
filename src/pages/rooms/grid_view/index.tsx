"use client"

import { twMerge } from "tailwind-merge";
import { useVisual } from "../../../hooks/useVisual";
import BedRoom from "../../../types/bedroom";

import RoomBox from "./RoomBox";
import { Title } from "../../../components/SectionBox";
import { IoBed } from "react-icons/io5";
import NoElem from "../../../components/NoElem";

export default function GridView({ roomStages, className }: {
    roomStages: [string, BedRoom.Type[]][],
    className?: string,
}) {
    const { addPopup } = useVisual();

    return (
    
        <NoElem list={roomStages}
            Icon={IoBed} size={100} text="Aucune correspondance"
            className="p-2 border-t-1 border-gray-500/50 text-[15px]">
            
            <div className="flex flex-col gap-3">
                { roomStages.map(([stage, rooms]) => (
                    <div key={stage} className={twMerge("flex flex-col gap-3", className)}>

                        <Title className="border-1 border-gray-400/50 shadow-md px-5 py-2 rounded-sm bg-blue-100/30"
                            right={`${rooms.length} chambres`}>{stage}
                        </Title>

                        <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,130px))] gap-3">
                            { rooms.map((room) => (
                                <RoomBox key={room.id}
                                    room={room} className="cursor-pointer"
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
