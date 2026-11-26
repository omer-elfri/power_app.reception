'use client'

import { twMerge } from "tailwind-merge";
import { useVisual } from "../../../hooks/useVisual";
import BedRoom from "../../../types/bedroom";

import SectionBox, { Title } from "../../../components/SectionBox";
import RoomLine from "./RoomLine";
import NoElem from "../../../components/NoElem";
import { BiBed } from "react-icons/bi";

const gridStyle = "grid grid-cols-[30px_70px_40px_1fr_80px_1fr_60px_20px] items-center gap-x-3 px-2";

export default function LineView({ roomStages, className }: {
    roomStages: [string, BedRoom.Type[]][],
    className?: string,
}) {
    const { addPopup } = useVisual();

    return (
        <div className={twMerge("flex flex-col gap-3", className)}>

            <SectionBox className="py-2 bg-white"
                subClassName={twMerge("font-bold text-[12px] text-center", gridStyle)}>
                <span>CH</span>
                <span>Catégorie</span>
                <span>Power</span>
                <span>Vallet</span>
                <span>Entretien</span>
                <span>Client</span>
                <span>État</span>
                <span>!</span>
            </SectionBox>

            <NoElem list={roomStages}
                Icon={BiBed} size={80} text="Aucune correspondance"
                className="p-2 h-120 text-[13px]">
                
                { roomStages.map(([stage, rooms]) => (
                    <div key={stage} className="flex flex-col gap-3">

                        <Title className="border-1 border-gray-400/50 shadow-md px-5 py-2 rounded-sm bg-blue-100/30"
                            right={`${rooms.length} chambres`}>{stage}
                        </Title>

                        <SectionBox className="py-1" subClassName="py-0">
                            {/* <Title bar right={`${rooms.length} chambres`}>{stage}</Title> */}

                            <div className="flex flex-col">
                                { rooms.map(room => (
                                    <div key={room.id} className={twMerge("shadow last:shadow-none cursor-pointer hover:bg-blue-200/20 py-1",
                                        (room.connected || true) ? "" : "opacity-50")} onClick={()=>addPopup(['ROOM', room.id])}>
                                        <RoomLine room={room} className={twMerge("[&>*]bg-red-400 \
                                            hover:scale-95 animate-1 transition-transform duration-500 ease-in-out py-2", gridStyle)}
                                        />
                                    </div>
                                )) }
                            </div>
                        </SectionBox>

                    </div>
                )) }

            </NoElem>
        </div>
    );
}
