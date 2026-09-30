"use client"

import React from "react";

import { useDataContext } from "../../datas/context";
import { FormType } from "../../types";
import BedRoom from "../../types/bedroom";

import PageTitle from "../../components/PageTitle";
import FilterSection from "./Filter";
import SoldedAside from "./Solded";
import RoomSection from "./Rooms";
import { Popup } from "./Infos";

export default function RoomsPage() {
    const { bedRooms } = useDataContext();
    const bedRoomTab = React.useMemo(() => Object.values(bedRooms), [bedRooms]) ;
    const [form, setForm] = React.useState<FormType>('line');
    const [filteredRooms, setFilteredRooms] = React.useState(bedRoomTab);
    const [roomPopup, setRoomPopup] = React.useState<BedRoom.Id | null>(null);

    return (
        <div className="flex flex-col gap-5 pb-10">

            <PageTitle />

            <div className="grid grid-cols-[250px_1fr] gap-5">

                <div className="flex flex-col gap-3 sticky top-3 self-start">
                    <FilterSection form={form} setForm={setForm}
                        datas={bedRoomTab} setDatas={setFilteredRooms}
                    />
                    <SoldedAside />
                </div>

                <RoomSection form={form} rooms={filteredRooms} setRoomPopup={setRoomPopup} />
            </div>

            { roomPopup && <Popup roomId={roomPopup} setRoomPopup={setRoomPopup} /> }

        </div>
    );
}
