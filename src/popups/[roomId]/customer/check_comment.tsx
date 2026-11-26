'use client'

import { twMerge } from "tailwind-merge";
import BedRoom from "../../../types/bedroom";

import { AsideDiv } from "../../../components/AsideDiv";
import LabelInput from "../../../components/LabelInput";
import { FaRegComment } from "react-icons/fa";

export default function CheckInComment({ room:bedRoom, className }: {
    room: BedRoom.Type,
    className?: string,
}) {
    return (
        <AsideDiv icon={<FaRegComment />} title="Commentaire" className={twMerge("", className)} >

            <LabelInput type='textarea' label="Infos supplémentaires" name='description'
                className={twMerge("text-[11px] min-h-30 !border-gray-400 h-8")}
                inputClassName="bg-gray-300/20"
                defaultValue={bedRoom.customer?.description ?? bedRoom.booked?.description}
                // placeholder="IFU / entreprise / autre description"
            />

        </AsideDiv>
    );
}

