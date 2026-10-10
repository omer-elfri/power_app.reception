"use client"

import React from "react";

import { useDataContext } from "../../hooks";
import { FormType, StageId, stages } from "../../types";
import BedRoom from "../../types/bedroom";

import SectionBox, { Title } from "../../components/SectionBox";
import RoomLine from "../../components/RoomLine"
import RoomBox from "../../components/RoomBox";

export default function RoomSection({ form, rooms }: {
    form: FormType,
    rooms: BedRoom.Type[],
}) {
    const roomStages = React.useMemo(() => {
        const d = Object.groupBy(rooms, (room) => room.stage);
        const res = Object.entries(d)
            .sort(([stageA], [stageB]) => (
                parseInt(stageA) - parseInt(stageB)
            ));
        return res;
    }, [rooms, stages]);

    return (
        <div className="flex flex-col gap-5">
            { (roomStages.length === 0) ? (
                <div className="min-h-100 flex justify-center items-center px-2 border-t-1 border-gray-500/50">
                    <p className="font-bold text-gray-400">Aucune correspondance</p>
                </div>
            ) : roomStages.map(([stage, rooms], i) => (
                <StageAside key={stage}
                    form={form} stage={stage as StageId} rooms={rooms}
                    className={ (i===roomStages.length-1) ?"flex-1" :""}
                />
            )) }
        </div>
    );
}

function StageAside({ form, stage, rooms, className }: {
    form: FormType,
    stage: StageId,
    rooms: BedRoom.Type[],
    className?: string,
}) {
    const { setRoomPopup } = useDataContext();

    return (
        <SectionBox className={className} subClassName="min-h-30 pb-3">
            <Title bar right={`${rooms.length} chambres`}>{stages[stage as StageId].name}</Title>

            { (form === "line")
            ?   <div className="flex flex-col gap-2"> { rooms.map((room) =>
                    <div key={room.id} className="cursor-pointer" onClick={()=>setRoomPopup(room.id)}>
                        <RoomLine room={room} />
                    </div> ) }
                </div>
            :   <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-x-3 gap-y-6 mt-5">{ rooms.map((room) =>
                    <div key={room.id} className="cursor-pointer" onClick={()=>setRoomPopup(room.id)}>
                        <RoomBox room={room} />
                    </div> ) }
                </div>
            }
        </SectionBox>
    );
}
