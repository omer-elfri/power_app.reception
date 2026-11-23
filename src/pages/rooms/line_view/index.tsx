"use client"

import { twMerge } from "tailwind-merge";
import { useVisual } from "../../../hooks/useVisual";
import BedRoom from "../../../types/bedroom";

import SectionBox, { Title } from "../../../components/SectionBox";
import RoomLine from "./RoomLine";

const gridStyle = "grid grid-cols-[30px_70px_2fr_1fr_80px_60px_20px] items-center gap-x-5 px-2";

export default function LineView({ roomStages, className }: {
    roomStages: [string, BedRoom.Type[]][],
    className?: string,
}) {
    const { addPopup } = useVisual();

    return (
        <div className="flex flex-col gap-3">

            <SectionBox className="py-2"
                subClassName={twMerge("font-bold text-[12px] text-center", gridStyle)}>
                <span>CH</span>
                <span>Catégorie</span>
                <span>Client</span>
                <span>Alimentée</span>
                <span>Vallet</span>
                <span>État</span>
                <span>!</span>
            </SectionBox>

            { roomStages.map(([stage, rooms]) => (
                <div key={stage} className="flex flex-col gap-3">

                    <Title className="border-1 border-gray-400/50 shadow-md px-5 py-2 rounded-sm bg-blue-100/30"
                        right={`${rooms.length} chambres`}>{stage}
                    </Title>

                    <SectionBox className={twMerge("py-1", className)} subClassName="min-h-30 py-0">
                        {/* <Title bar right={`${rooms.length} chambres`}>{stage}</Title> */}

                        <div className="flex flex-col">
                            { rooms.map((room) => (
                                <div key={room.id} className="shadow last:shadow-none cursor-pointer hover:bg-blue-200/20 py-1" onClick={()=>addPopup(['ROOM', room.id])}>
                                    <RoomLine room={room} className={twMerge("hover:scale-98 animate-1 transition-transform duration-500 ease-in-out py-2", gridStyle)} />
                                </div>
                            )) }
                        </div>
                    </SectionBox>

                </div>
            )) }
        </div>
    );
}
