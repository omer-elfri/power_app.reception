"use client"

import React from "react";

import { room_ctg_datas } from "../../configs/room_ctg";
import BedRoom from "../../types/bedroom";
import { FormType, StageId, stages } from "../../types";

import SectionBox, { Title } from "../../components/SectionBox";
import RoomLine from "../../components/RoomLine"
import RoomBox from "../../components/RoomBox";
import { MdError, MdWarning } from "react-icons/md";
import { employers_datas } from "../../configs/employer";
import { useDataContext } from "../../datas/context";

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
        <div className="flex flex-col gap-3">
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

    const getInfos = React.useCallback((room: BedRoom.Type): RoomInfos => {
        const powered = (room.power) ? "Allumée" : (room.power === false) ? "Éteinte" : "...";
        const isSolded = !!room.check_in;

        const valletName = employers_datas[room.cleaning?.vallet ?? ""]?.name;
        const cleaning = !room.cleaning ? "Non" : !room.cleaning.end ? valletName : "Propre";
        const coming = room.coming;
        const clientName = room.check_in?.name ?? coming?.client ?? null;
        const issueIcon =
            room.issues.some(issue => issue.priority === 'high') ? 
                <MdError size={15} className="text-red-600" /> :
            room.issues.some(issue => issue.priority === 'medium') ?
                <MdWarning size={15} className="text-yellow-600" /> :
            room.issues.some(issue => issue.priority === 'low') ?
                <MdWarning size={15} className="text-yellow-600" /> :
            null;
        const categoryNames = room.categories
            .map((ctgId) => ({ id: ctgId, ...room_ctg_datas[ctgId] }) )
            .map(({ name }) => name ).join(", ");
        return ({ powered, isSolded, cleaning, coming, clientName, issueIcon, categoryNames });
        
    }, [room_ctg_datas]);

    return (
        <SectionBox className={className} subClassName="min-h-30 pb-3">
            <Title bar right={`${rooms.length} chambres`}>{stages[stage as StageId].name}</Title>

            { (form === "line")
            ?   <div className="flex flex-col gap-2"> { rooms.map((room) =>
                    <div key={room.id} className="cursor-pointer" onClick={()=>setRoomPopup(room.id)}>
                        <RoomLine room={room} getInfos={getInfos} />
                    </div> ) }
                </div>
            :   <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-x-3 gap-y-6 mt-5">
                    { rooms.map((room) => <div key={room.id} className="cursor-pointer" onClick={()=>setRoomPopup(room.id)}>
                        <RoomBox room={room} getInfos={getInfos} />
                    </div> ) }
                </div>
            }
        </SectionBox>
    );
}


export type RoomInfos = {
    powered: string,
    isSolded: boolean,
    cleaning: string,
    coming: BedRoom.ReservationType | null,
    clientName: string | null,
    issueIcon: React.ReactNode | null,
    categoryNames: string,
};
