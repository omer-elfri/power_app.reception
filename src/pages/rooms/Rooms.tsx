"use client"

import React from "react";

import { useDataContext } from "../../hooks";
import BedRoom from "../../types/bedroom";

import SectionBox, { Title } from "../../components/SectionBox";
import RoomLine from "../../components/RoomLine"
import RoomBox from "../../components/RoomBox";
import NoElem from "../../components/NoElem";
import { IoBed } from "react-icons/io5";
import { FormType } from ".";

export default function RoomSection({ form, rooms }: {
    form: FormType,
    rooms: BedRoom.Type[],
}) {
    const roomStages = React.useMemo(() => {
        return Object.entries( Object.groupBy(rooms, room => room.stage) );
    }, [rooms]);

    return (
        <NoElem list={roomStages}
            Icon={IoBed} size={100} text="Aucune correspondance"
            className="p-2 border-t-1 border-gray-500/50 text-[15px]">

            <div className="flex flex-col gap-5">
                { roomStages.map(([stage, rooms], i) => (
                    <StageAside key={stage}
                        form={form} stage={stage as BedRoom.StageId} rooms={rooms!}
                        className={ (i===roomStages.length-1) ? "flex-1" : "" }
                    />
                )) }
            </div>

        </NoElem>
    );
}

function StageAside({ form, stage, rooms, className }: {
    form: FormType,
    stage: BedRoom.StageId,
    rooms: BedRoom.Type[],
    className?: string,
}) {
    const { addPopup } = useDataContext();

    if (form === "line") return (
        <SectionBox className={className} subClassName="min-h-30 pb-3">
            <Title bar right={`${rooms.length} chambres`}>{stage}</Title>

            <div className="flex flex-col gap-2"> { rooms.map((room) =>
                <div key={room.id} className="shadow cursor-pointer hover:bg-blue-200/20" onClick={()=>addPopup(['ROOM', room.id])}>
                    <RoomLine room={room} className="hover:scale-95 animate-1 transition-transform duration-300 ease-in-out" />
                </div> ) }
            </div>
        </SectionBox>
    );

    return (
        <div className="flex flex-col gap-5">
            <Title className="border-1 border-gray-400/50 shadow-md px-5 py-3 rounded-sm bg-blue-100/30"
                right={`${rooms.length} chambres`}>{stage}
            </Title>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,150px))] gap-3">
                { rooms.map((room) => <RoomBox key={room.id}
                    room={room} className="cursor-pointer"
                    onClick={() => addPopup(['ROOM', room.id])}
                /> ) }
            </div>

        </div>);
}
