'use client'

import React from "react";
import { useAnalysis } from "../../hooks/useAnalysis";

import PageTitle from "../../components/dynamic/PageTitle";
import FilterSection from "./Filter";
import SoldedAside from "./Solded";
import LineView from "./line_view";
import GridView from "./grid_view";

export type FormType = 'line' | 'grid';

export default function RoomsPage() {
    const { bedRoomTab } = useAnalysis();
    const [form, setForm] = React.useState<FormType>('line');
    const [filteredRooms, setFilteredRooms] = React.useState(bedRoomTab);

    const roomStages = React.useMemo(() => {
        return Object.entries(
            Object.groupBy(filteredRooms, room => room.stage)
        );
    }, [filteredRooms]);

    return (
        <div className="flex flex-col gap-3 pb-10">

            <PageTitle />

            <div className="grid grid-cols-[250px_1fr] items-start gap-5">

                <div className="flex flex-col gap-5 sticky top-18 self-start">
                    <FilterSection form={form} setForm={setForm}
                        datas={bedRoomTab} setDatas={setFilteredRooms} />
                    <SoldedAside className="min-h-40" />
                </div>

                { form === 'line'
                    ? <LineView roomStages={roomStages} />
                    : <GridView roomStages={roomStages} />
                }

            </div>

        </div>
    );
}
