"use client"

import React from "react";

import { useBedRoom } from "../../hooks/bedroom";
import { FormType } from "../../types";

import PageTitle from "../../components/PageTitle";
import FilterSection from "./Filter";
import SoldedAside from "./Solded";
import RoomSection from "./Rooms";

export default function RoomsPage() {
    const { bedRoomTab } = useBedRoom();
    const [form, setForm] = React.useState<FormType>('line');
    const [filteredRooms, setFilteredRooms] = React.useState(bedRoomTab);

    return (
        <div className="flex flex-col gap-5 pb-10">

            <PageTitle />

            <div className="grid grid-cols-[250px_1fr] gap-5">

                <div className="flex flex-col gap-5 sticky top-3 self-start">
                    <FilterSection form={form} setForm={setForm}
                        datas={bedRoomTab} setDatas={setFilteredRooms} />
                    <SoldedAside />
                </div>

                <RoomSection form={form} rooms={filteredRooms} />
            </div>

        </div>
    );
}
