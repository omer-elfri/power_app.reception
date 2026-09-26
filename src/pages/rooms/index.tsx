"use client"

import React from "react";

import PageTitle from "../../components/PageTitle";
import FilterSection from "./Filter";
import RoomsSection from "./Rooms";
import InfosSection from "./InfoSection";
import BedRoom from "../../types/bedroom";

export default function RoomsPage() {
    const [roomPopup, setRoomPopup] = React.useState<BedRoom.Id | null>(null);
    return (
        <div className="flex flex-col gap-5 pb-10">
            <PageTitle />
            <FilterSection />
            <div className="grid grid-cols-[1fr_auto] items-start gap-5">
                <RoomsSection setRoomPopup={setRoomPopup} />
                { roomPopup && <InfosSection roomPopup={roomPopup} /> }
            </div>
        </div>
    );
}
