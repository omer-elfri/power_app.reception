"use client"

import React from "react";

import { useDataContext } from "../../hooks";
import { FormType, StageId, stages } from "../../types";
import BedRoom from "../../types/bedroom";

import SectionBox, { Title } from "../../components/SectionBox";
import RoomLine from "../../components/RoomLine"
import RoomBox from "../../components/RoomBox";
import NoElem from "../../components/NoElem";
import { IoBed } from "react-icons/io5";

export default function RoomSection({ form, rooms }: {
    form: FormType,
    rooms: BedRoom.Type[],
}) {
    const roomStages = React.useMemo(() => {
        const stageRooms = Object.groupBy(rooms, room => room.stage);
        const res = Object.entries(stageRooms)
            .sort(([stageA], [stageB]) => (
                parseInt(stageA) - parseInt(stageB)
            ));
        return res;
    }, [rooms, stages]);

    return (
        <NoElem list={roomStages}
            Icon={IoBed} size={100} text="Aucune correspondance"
            className="p-2 border-t-1 border-gray-500/50 text-[15px]">

            <div className="flex flex-col gap-5">
                { roomStages.map(([stage, rooms], i) => (
                    <StageAside key={stage}
                        form={form} stage={stage as StageId} rooms={rooms}
                        className={ (i===roomStages.length-1) ?"flex-1" :""}
                    />
                )) }
            </div>

        </NoElem>
    );
}

function StageAside({ form, stage, rooms, className }: {
    form: FormType,
    stage: StageId,
    rooms: BedRoom.Type[],
    className?: string,
}) {
    const { addPopup } = useDataContext();

    return (
        <SectionBox className={className} subClassName="min-h-30 pb-3">
            <Title bar right={`${rooms.length} chambres`}>{stages[stage as StageId].name}</Title>

            { (form === "line")
            ?   <div className="flex flex-col gap-2"> { rooms.map((room) =>
                    <div key={room.id} className="cursor-pointer"
                        onClick={()=>addPopup(['ROOM', room.id])}>
                        <RoomLine room={room} />
                    </div> ) }
                </div>
            :   <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,180px))] gap-x-3 gap-y-6 mt-5">
                    { rooms.map((room) =>
                        <div key={room.id} className="cursor-pointer"
                            onClick={()=>addPopup(['ROOM', room.id])}>
                            <RoomBox room={room} />
                        </div>
                    ) }
                </div>
            }
        </SectionBox>
    );
}
