"use client"

import React from "react";

import BedRoom from "../../types/bedroom";
import { useDataContext } from "../../datas/context";
import { room_ctg_list } from "../../datas/types";

import PageTitle from "../../components/PageTitle";
import SectionBox, { Title } from "../../components/SectionBox";
import SoldRoom from "../../components/SoldRoom";
import RoomLine from "../../components/RoomLine"

import FilterSection from "./Filter";
import { Popup } from "./RoomInfos";
import { twMerge } from "tailwind-merge";
import { GiHamburgerMenu } from "react-icons/gi";
import { FiGrid } from "react-icons/fi";

export default function RoomsPage() {
    const { analysis, bedRooms } = useDataContext();
    const [roomPopup, setRoomPopup] = React.useState<BedRoom.Id | null>(null);

    const roomStages = React.useMemo(() => {
        return Object.values(BedRoom.Stage.stages).map(({ name }) => ({ stage: name,
            rooms: Object.values(bedRooms).filter((room) => (name === room.stage.name)),
        })).filter(({ rooms }) => (rooms.length > 0));
    }, [bedRooms, BedRoom.Stage.stages]);


    const f = (roomId: BedRoom.Id) => {
        const g = [
            "border-l-green-700",
            // "border-purple-700",
            "border-l-red-700",
            // "border-yellow-700",
            "border-l-blue-700",
        ];
        const e = g[parseInt(roomId) % g.length];
        return e;
    }

    const [form, setForm] = React.useState<'line' | 'grid'>('line');

    return (
        <div className="flex flex-col gap-5 pb-10">

            <PageTitle />

            <SectionBox className="pb-5">
                <Title name="Filtres" className="mb-2" notif={
                    <div className="flex flex-row gap-x-1">
                        <button className={twMerge("", (form==="line")?"text-white bg-green-600":"bg-gray-300/50")} onClick={() => setForm('line')}> <GiHamburgerMenu /> </button>
                        <button className={twMerge("", (form==="grid")?"text-white bg-blue-600":"bg-gray-300/50")} onClick={() => setForm('grid')}> <FiGrid /> </button>
                    </div>
                } />
                <FilterSection form={form} setForm={setForm} className="flex flex-row" />
            </SectionBox>

            <div className="grid grid-cols-[250px_1fr] items-start gap-5">

                <div className="flex flex-col gap-3 sticky top-3">
                    <SectionBox className="pb-5">
                        <Title name="Ventes" className="mb-2" notif={analysis.nbSolded} bar />
                        <div className="flex flex-col gap-3">
                            { room_ctg_list.map((room_ctg) => (
                                <SoldRoom key={room_ctg.id} name={room_ctg.name} subName={room_ctg.price.toString()} value={2} />
                            )) }
                        </div>
                    </SectionBox>
                </div>


                <div className="flex flex-col gap-3">{ roomStages.map(({ stage, rooms }) => (
                    <SectionBox key={stage} subClassName="min-h-30 pb-3">
                        <Title name={stage} bar notif={`${rooms.length} chambres`} />

                        { (form === "line") && (
                            <div className="flex flex-col gap-3"> { rooms.map((room) => (
                                <RoomLine key={room.id} className={f(room.id)} room={room} onClick={() => setRoomPopup(room.id)} />
                            )) } </div>
                        ) }

                        { (form === "grid") && (
                            <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-x-3 gap-y-6 mt-5"> { rooms.map((room) => (
                                <RoomBox key={room.id} room={room} setRoomPopup={setRoomPopup}  />
                            )) } </div>
                        ) }

                    </SectionBox>
                )) }</div>

            </div>

                

            { roomPopup && <Popup roomId={roomPopup} setRoomPopup={setRoomPopup} /> }

        </div>
    );
}

function GlobalSection({ hsRoomIds }: {
    hsRoomIds: BedRoom.Id[],
}) {
    return (
        <div className="flex flex-row items-center">

            <img src="bedroom_storyset.png" alt="bedroom storyset" className="aspect-square w-40" />

            <div className="flex flex-col gap-6 overflow-hidden">
                <div className="grid grid-cols-[repeat(4,1fr_auto)] max-lg:grid-cols-[repeat(3,1fr_auto)] max-md:grid-cols-[repeat(2,1fr_auto)] max-sm:grid-cols-[repeat(2,1fr_auto)] \
                    justify-center items-center gap-x-3 gap-y-5 w-[calc(100%+4px)] py-3">
                    { room_ctg_list.map((room_ctg) => (
                        <SoldRoom key={room_ctg.id} name={room_ctg.name} subName={room_ctg.price.toString()} value={2} />
                    )) }
                    {/* <SoldRoom name="Hors service" color="#a11" subName={hsRoomIds.join(", ")} value={hsRoomIds.length} bar={false} /> */}
                </div>
            </div>

        </div>
    );
}

function RoomBox({ room:bedRoom, setRoomPopup }: {
    room: BedRoom.Type,
    setRoomPopup: React.Dispatch<React.SetStateAction<BedRoom.Id | null>>,
}) {
    return (
        <div className="flex flex-col gap-x-2 gap-y-2 bg-blue-200/10 p-2 px-5 rounded-md relative pt-7 border-1 border-blue-600" onClick={() => setRoomPopup(bedRoom.id)}>
            <h2 className="px-2 py-1 rounded bg-blue-600 text-gray-200 absolute top-[-12px] text-[16px] font-bold">{bedRoom.id}</h2>
            <div className="flex flex-col">
                <h3 className="text-[12px] font-bold">{bedRoom.categories[0].name}</h3>
                <p className="text-[11px] text-gray-500">{bedRoom.id}</p>
            </div>
        </div>
    );
}
