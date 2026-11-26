'use client'

import React from "react";
import { twMerge } from "tailwind-merge";
import { useAnalysis } from "../../../hooks/useAnalysis";
import { useRequest } from "../../../hooks/useRequest";
import { useVisual } from "../../../hooks/useVisual";
import BedRoom from "../../../types/bedroom";

import LabelInput from "../../../components/LabelInput";
import MyButton from "../../../components/MyButton";
import { FaExchangeAlt } from "react-icons/fa";

export default function CheckMove({ room:bedRoom, className }: {
    room: BedRoom.Type,
    className?: string,
}) {
    const { switchPopup } = useVisual();
    const { analysis, bedRoomTab } = useAnalysis();
    const { check_move } = useRequest();
    const [roomId, setRoomId] = React.useState<BedRoom.Id | null>(null);

    const submitHandler = async () => {
        const toRoomId = roomId ?? bedRoomTab[0]?.id;
        if (!toRoomId) return;
        await check_move(bedRoom.id, toRoomId);
        switchPopup(['ROOM', bedRoom.id]);
    }

    const options = bedRoomTab.map(room => ({
        k: room.id.toString(),
        value: `${room.id} ${room.customer?.name.toUpperCase() ?? ""}`,
        disabled: !!room.customer,
    }));

    return (
        <div className={twMerge("flex flex-row items-center gap-2 bg-white/60 px-3 py-3 font-bold rounded shadow-md w-full", className)}>

            <FaExchangeAlt size={13} />
            <label className="flex-1">Changer de CH</label>

            <LabelInput value={roomId ?? ""} onChangeText={setRoomId} options={options} inputClassName="w-20" />

            <MyButton onClick={submitHandler}
                disabled={bedRoom.customer && analysis.free.length === 0 || !bedRoom.customer && analysis.solded.length === 0}
                className="!py-1 bg-yellow-700/10 text-yellow-700 border-1 border-yellow-700 self-end !text-[10px]"
            >Déplacer</MyButton>

        </div>
    );
}
