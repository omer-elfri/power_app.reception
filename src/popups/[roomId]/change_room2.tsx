'use client'

import { twMerge } from "tailwind-merge";
import { useDataContext } from "../../hooks";
import { useBedroom } from "../../hooks/useBedroom";
import BedRoom from "../../types/bedroom";

import FormAside from "../../components/FormAside";
import LabelInput from "../../components/LabelInput";
import MyButton from "../../components/MyButton";

import { FaExchangeAlt } from "react-icons/fa";
import { HiSwitchHorizontal } from "react-icons/hi";

export default function ChangeRoom2({ room:bedRoom, className }: {
    room: BedRoom.Type,
    className?: string,
}) {
    const { addPopup } = useDataContext();
    const { analysis, bedRooms, bedRoomTab, check_move } = useBedroom();

    const submitHandler = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const roomId = e.target.roomId.value as BedRoom.Id;
        const description = e.target.description.value as string;
        const toRoom = bedRooms[roomId];
        if (!bedRoom.customer)
            throw Error(`La chambre ${bedRoom.id} n'est pas occupée`);
        if (toRoom.customer)
            throw Error(`La chambre ${roomId} est déjà occupée`);
        check_move(bedRoom.customer.id, roomId, description);
        addPopup(['ROOM', roomId]);
    }

    return (
        <FormAside title="Déplacer" right={
            <MyButton name='change_room' icon={<FaExchangeAlt />}
                disabled={bedRoom.customer && analysis.free.length === 0 || !bedRoom.customer && analysis.solded.length === 0}
                className="!py-1 bg-yellow-700/10 text-yellow-700 border-1 border-yellow-700 self-end !text-[10px]">Déplacer
            </MyButton>
        }
            icon={<HiSwitchHorizontal />} onSubmit={submitHandler}
            className={twMerge("", className)} subClassName="grid grid-cols-[1fr_auto] gap-2">

            <LabelInput name="roomId" label="Déplacer vers" options={
                bedRoomTab.map(room => ({
                    k: room.id.toString(),
                    value: `${room.id} ${room.customer?.name.toUpperCase() ?? ""}`,
                    disabled: !!bedRoom.customer,
                })) }
            />

        </FormAside>
    );
}
