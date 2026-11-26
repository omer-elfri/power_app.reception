'use client'

import { twMerge } from "tailwind-merge";
import { useRequest } from "../../../hooks/useRequest";
import BedRoom from "../../../types/bedroom";
import { colors } from "../../../types";

import MyButton from "../../../components/MyButton";
import { HiLightningBolt } from "react-icons/hi";

export default function PowerOn({ room:bedRoom, className }: {
    room: BedRoom.Type,
    className?: string,
}) {
    const { switch_power } = useRequest();
    return (
        <div className={twMerge("flex flex-row items-center gap-2 \
            bg-white/60 px-3 py-3 font-bold rounded shadow-md w-full", className)}>

            <HiLightningBolt size={13} color={bedRoom.power ? colors.powered : "#888"} />
            <label className="flex-1">Alimentation</label>

            { bedRoom.power
            ?
                <MyButton onClick={async () => switch_power(bedRoom.id, false)}
                    className="!py-1 border-1 !text-[10px] \
                        bg-gray-700/10 text-gray-700 border-gray-700">Couper
                </MyButton>
            :
                <MyButton onClick={async () => switch_power(bedRoom.id, true)}
                    className="!py-1 border-1 !text-[10px] \
                        bg-red-700/10 text-red-700 border-red-700">Alimenter
                </MyButton>
            }

        </div>
    );
}
