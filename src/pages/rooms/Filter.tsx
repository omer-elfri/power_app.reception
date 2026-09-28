'use client'

import React from "react";

import { twMerge } from "tailwind-merge";
import { room_ctg_list, room_list } from "../../datas/types";
import BedRoom from "../../types/bedroom";

export default function FilterSection({ form, setForm, className }: {
    form: 'line' | 'grid',
    setForm: React.Dispatch<React.SetStateAction<'line' | 'grid'>>,
    className?: string,
}) {
    let roomCtgs: BedRoom.Category.Id[] = [];

    room_list.forEach((room) => {
        roomCtgs = [...roomCtgs, ...room.categories];
    })

    let floorTab: BedRoom.Stage.Id[] = room_list
        .map((room) => (room.stage))
        .sort((stageA, stageB) => (parseInt(stageA) - parseInt(stageB)));
    const floorList = [...new Set(floorTab)];

    const [status, setStatus] = React.useState('all');

    return (
        <div className={twMerge("flex flex-col gap-3", className)}>

            <input type="search" placeholder="Rechercher" className="flex-1 border-1 text-[11px] font-bold flex-1 rounded py-1 px-3" /> 

            <select name="stage" className="border-1 text-[11px] font-bold py-2 h-7">
                <option value="all">Tous les étages</option>
                { floorList.map((stageId) => (
                    <option key={stageId} value={stageId}>
                        { BedRoom.Stage.stages[stageId as BedRoom.Stage.Id].name }
                    </option>
                )) }
            </select>

            <select name="category" className="border-1 text-[11px] font-bold py-2 h-7">
                <option value="all">Tous les catégories</option>
                { room_ctg_list.map((roomCtg) => (
                    <option key={roomCtg.id} value={roomCtg.id}>{roomCtg.name}</option>
                )) }
            </select>

            <select name="status" onChange={e => {
                e.preventDefault();
                console.log("df", e.target.value);
                // setStatus(e.target.status);
            }} className="border-1 text-[11px] font-bold py-2 h-7">
                <option value="all">Tous les états</option>
                <option value="powered">Alimentée</option>
                <option value="solded">Vendues</option>
                <option value="free">Disponibles</option>
                <option value="cleaning">En néttoyage</option>
            </select>

        </div>
    );
}
