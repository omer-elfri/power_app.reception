"use client"

import React from "react";
import BedRoom from "../../types/bedroom";
import { FormType } from ".";

import NoElem from "../../components/NoElem";
import LineView from "./line_view";
import GridView from "./grid_view";
import { IoBed } from "react-icons/io5";

export default function RoomSection({ form, rooms }: {
    form: FormType,
    rooms: BedRoom.Type[],
}) {
    const roomStages = React.useMemo(() => {
        return Object.entries(
            Object.groupBy(rooms, room => room.stage)
        );
    }, [rooms]);

    return (
        <NoElem list={roomStages}
            Icon={IoBed} size={100} text="Aucune correspondance"
            className="p-2 border-t-1 border-gray-500/50 text-[15px]">

            { form === 'line'
                ? <LineView roomStages={roomStages} />
                : <GridView roomStages={roomStages} />
            }

        </NoElem>
    );
}
