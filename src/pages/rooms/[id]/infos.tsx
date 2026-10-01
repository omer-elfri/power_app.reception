'use client'

import BedRoom from "../../../types/bedroom";
import SectionBox, { Title } from "../../../components/SectionBox";
import { twMerge } from "tailwind-merge";
import { ImCross } from "react-icons/im";
import { useDataContext } from "../../../datas/context";

export default function InfosSection({ room:bedRoom, className }: {
    room: BedRoom.Type,
    className?: string,
}) {
    const { setRoomPopup } = useDataContext();

    return (
        <SectionBox className={twMerge("", className)} subClassName="overflow-auto" >

            <Title bar right={<ImCross size={13} className="text-red-700 cursor-pointer" onClick={() => setRoomPopup(null)} />} >
                <h1 className="font-bold text-[18px]">CH {bedRoom.id}</h1>
            </Title>

        </SectionBox>
    );
}
