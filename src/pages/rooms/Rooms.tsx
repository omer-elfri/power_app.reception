"use client"

import React from "react";

import BedRoom from "../../types/bedroom";
import { useDataContext } from "../../datas/context";
import SectionBox from "../../components/SectionBox";

export default function RoomsSection({ setRoomPopup }: {
    setRoomPopup: React.Dispatch<React.SetStateAction<BedRoom.Id | null>>
}) {
    const { bedRooms } = useDataContext();

    const roomStages: [string, BedRoom.Type[]][] = React.useMemo(() => {
        const roomByStage = Object.groupBy(
            Object.values(bedRooms),
            room => room.stage );
        const tab = Object.entries(roomByStage)
            .sort(([stageA], [stageB]) => (
                parseInt(stageA) - parseInt(stageB)));
        return tab;
    }, [bedRooms]);

    return (
        <div className="flex flex-col justify-end gap-10 flex-1"> { roomStages.map(([stage, rooms]) => (<>
            <SectionBox
                title={<h2 className="uppercase font-bold text-[14px] py-1 px-2">Étage {stage}</h2>}
                className="py-3 bg-white/50" subClassName="gap-y-3">
                
                <hr className="text-gray-400/50" />

                <div key={stage} className="flex flex-col gap-2"> { rooms.map((room) => (
                    <RoomBox key={room.id} room={room} onClick={() => setRoomPopup(room.id)} />
                )) } </div>

            </SectionBox>
        </>)) } </div>
    );
}

function RoomBox({ room: bedRoom, onClick }: {
    room: BedRoom.Type,
    onClick: () => void,
}) {
    const [power, setPower] = React.useState(bedRoom.power);

    React.useEffect(() => {
        if (bedRoom.power !== 'NONE')
            setPower(bedRoom.power);
    }, [bedRoom.power]);

    const g = [
        "border-green-700",
        // "border-purple-700",
        "border-red-700",
        // "border-yellow-700",
        "border-blue-700",
    ];
    const e = g[parseInt(bedRoom.id) % g.length];

    return (
        <div className={"grid grid-cols-[auto] shadow rounded-md p-2 relative bg-gray-200 cursor-pointer " + e + " border-l-3"} onClick={onClick}>
            <p className="font-bold text-[15px]">{bedRoom.id}</p>
        </div>
    );
}
