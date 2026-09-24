"use client"

import React from "react";
import { useNavigate } from "react-router-dom";
import BedRoom from "../../types/bedroom";
import { useDataContext } from "../../datas/context";

import PageTitle from "../../components/PageTitle";
import RoomBox from "../../components/RoomBox";
import { HiLockClosed } from "react-icons/hi";
import { IoMdHome } from "react-icons/io";

export default function RoomsPage() {
    const [ goodIp ] = React.useState(true);
    const { bedRooms } = useDataContext();
    const navigate = useNavigate();

    const roomStages: [string, BedRoom.Type[]][] = React.useMemo(() => {
        const roomByStage = Object.groupBy(
            Object.values(bedRooms),
            room => room.stage );
        const tab = Object.entries(roomByStage)
            .sort(([stageA], [stageB]) => (
                parseInt(stageA) - parseInt(stageB)));
        return tab;
    }, [bedRooms]);

    return ( <>

        <div className="flex flex-col gap-5 pb-10">

            <PageTitle name="Rooms Page">
                <button className="flex flex-row items-end bg-blue-500 hover:bg-blue-700 text-white" onClick={() => navigate("/")}>
                    <IoMdHome size={20} />
                    <span>Global Page</span>
                </button>
            </PageTitle>

            <div className="flex flex-col gap-5"> { roomStages.map(([stage, rooms]) => (
                <div key={stage} className="grid grid-cols-[repeat(auto-fit,200px)] gap-2"> { rooms.map((room) => (
                    <RoomBox key={room.id} room={room} />
                )) } </div>
            )) } </div>

        </div> 

        { !goodIp && <NoServer /> }

    </> );
}

function NoServer() {
    return (
        <div className="fixed inset-0 flex flex-col justify-center items-center bg-black/90 z-1 p-10 backdrop-blur-[2px]">
            <div className="flex flex-col items-center gap-10 uppercase text-center text-white">
                <p className="text-[30px] font-bold">Equipement illégible</p>
                <HiLockClosed className="text-red-300" size={120} />
                <p className="text-[17px]">Raffraichissez la page pour rééssayer</p>
            </div>
        </div>
    );
}
