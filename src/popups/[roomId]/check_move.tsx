'use client'

import React from "react";
import { twMerge } from "tailwind-merge";
import { useRequest } from "../../hooks/useRequest";
import { useVisual } from "../../hooks/useVisual";
import BedRoom from "../../types/bedroom";

import LabelInput from "../../components/LabelInput";
import MyButton from "../../components/MyButton";
import { FaExchangeAlt } from "react-icons/fa";
import { useAnalysis } from "../../hooks/useAnalysis";

export default function CheckMove({ room:bedRoom, className }: {
    room: BedRoom.Type,
    className?: string,
}) {
    const { switchPopup } = useVisual();
    const [roomId, setRoomId] = React.useState<BedRoom.Id | null>(null);
      const { analysis, bedRoomTab } = useAnalysis();
    const { check_move } = useRequest();

    return (
        <form onSubmit={e => {
            e.preventDefault();
            const toRoomId = e.target.toRoomId.value;
            check_move(bedRoom.id, toRoomId);
            switchPopup(['ROOM', bedRoom.id]);
        }}
            className={twMerge("flex flex-row items-center gap-2 bg-white/60 px-3 py-3 font-bold rounded shadow-md w-full", className)}>
            <FaExchangeAlt size={10} />
            <label className="flex-1">Déplacer vers</label>

            <LabelInput value={roomId ?? ""} onChangeText={setRoomId} options={
                bedRoomTab.map(room => ({
                    k: room.id.toString(),
                    value: `${room.id} ${room.customer?.name.toUpperCase() ?? ""}`,
                    disabled: !!room.customer,
                })) } />

            <MyButton name='change_room'
                disabled={bedRoom.customer && analysis.free.length === 0 || !bedRoom.customer && analysis.solded.length === 0}
                className="!py-1 bg-yellow-700/10 text-yellow-700 border-1 border-yellow-700 self-end !text-[10px]">Déplacer
            </MyButton>

        </form>
    );
}
