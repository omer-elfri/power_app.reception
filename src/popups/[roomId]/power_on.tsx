'use client'

import { twMerge } from "tailwind-merge";
import BedRoom from "../../types/bedroom";
import MyButton from "../../components/MyButton";
import { HiLightningBolt } from "react-icons/hi";

export default function PowerOn({ className }: {
    room: BedRoom.Type,
    className?: string,
}) {
    return (
        <div className={twMerge("flex flex-row items-center gap-2 \
            bg-white/60 px-3 py-3 font-bold rounded shadow-md w-full", className)}>

            <HiLightningBolt size={13} />
            <label className="flex-1">Alimentation</label>

            <MyButton name='power_on' onClick={() => {}}
                className="!py-1 bg-red-700/10 text-red-700 border-1 border-red-700 self-end !text-[10px]">Alimenter
            </MyButton>

        </div>
    );
}
