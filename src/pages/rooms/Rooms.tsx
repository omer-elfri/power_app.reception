"use client"

import React from "react";

import { room_ctg_datas } from "../../configs/room_ctg";
import BedRoom from "../../types/bedroom";
import { FormType, StageId, stages } from "../../types";

import SectionBox, { Title } from "../../components/SectionBox";
import RoomLine from "../../components/RoomLine"
import RoomBox from "../../components/RoomBox";
import { MdError, MdWarning } from "react-icons/md";
import { RoomInfos } from "./Infos";
import { employers_datas } from "../../configs/employer";

export default function RoomSection({ form, rooms, setRoomPopup }: {
    form: FormType,
    rooms: BedRoom.Type[],
    setRoomPopup: React.Dispatch<React.SetStateAction<BedRoom.Id | null>>,
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
            ) : roomStages.map(([stage, rooms]) => (
                <SectionBox key={stage} className="flex-1" subClassName="min-h-30 pb-3">
                    <Title name={stages[stage as StageId].name} bar notif={`${rooms.length} chambres`} />
                    <StageAside key={stage} form={form} rooms={rooms} setRoomPopup={setRoomPopup} />
                </SectionBox>
            )) }
        </div>
    );
}

function StageAside({ form, rooms:stageRooms, setRoomPopup }: {
    form: FormType,
    rooms: BedRoom.Type[],
    setRoomPopup: React.Dispatch<React.SetStateAction<BedRoom.Id | null>>,
}) {
    const getInfos = React.useCallback((room: BedRoom.Type): RoomInfos => {
        const powered = (room.power === 'ON') ? "Allumée" : "Éteinte";
        const isSolded = !!room.check_in;

        console.log("b")
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

    if (form === "line") return (
        <div className="flex flex-col gap-2"> { stageRooms.map((room) => (
            <RoomLine key={room.id} room={room} getInfos={getInfos} onClick={() => setRoomPopup(room.id)} /> )) }
        </div>
    );
    if (form === "grid") return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-x-3 gap-y-6 mt-5"> { stageRooms.map((room) => (
            <RoomBox key={room.id} room={room} getInfos={getInfos} onClick={() => setRoomPopup(room.id)} /> )) }
        </div>
    );
}

