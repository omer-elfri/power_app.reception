'use client'

import { twMerge } from "tailwind-merge";
import { useBedroom } from "../../hooks/useBedroom";
import BedRoom from "../../types/bedroom";

import FormAside from "../../components/FormAside";
import LabelInput from "../../components/LabelInput";
import MyButton from "../../components/MyButton";

import { FaExchangeAlt } from "react-icons/fa";
import { HiSwitchHorizontal } from "react-icons/hi";
import { useDataContext } from "../../hooks";

export default function ChangeRoom({ room:bedRoom, className }: {
    room: BedRoom.Type,
    className?: string,
}) {
    const { addPopup } = useDataContext();
    const { bedRooms, bedRoomTab, check_move } = useBedroom();

    const submitHandler = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const roomId = e.target.roomId.value as BedRoom.Id;
        const description = e.target.description.value as BedRoom.Id;
        const toRoom = bedRooms[roomId];
        if (!bedRoom.customer)
            throw Error(`La chambre ${bedRoom.id} n'est pas occupée`);
        if (toRoom.customer)
            throw Error(`La chambre ${roomId} est déjà occupée`);
        check_move(bedRoom.customer.id, roomId, description);
        addPopup(['ROOM', roomId]);
    }

    return (
        <FormAside title="Changer de chambre"
            icon={<HiSwitchHorizontal />} onSubmit={submitHandler}
            subClassName="flex flex-col gap-2" className={twMerge("", className)}
            right={
                <MyButton name='change_room' icon={<FaExchangeAlt />}
                    className="!py-1 bg-yellow-700/10 text-yellow-700 border-yellow-700 self-end">Déplacer
                </MyButton>
            }>

            <LabelInput label="Envoyer à la chambre" name="roomId" options={
                bedRoomTab.map(room => ({ k: room.id,
                    value: `${room.id} ${room.customer?.name.toUpperCase() ?? ""}`,
                    disabled: bedRoom.customer ? !!room.customer : !room.customer,
                })) }
            />

            <LabelInput label="Pourquoi ?" name="description" required>
                <textarea className="h-20" name="description" />
            </LabelInput>

        </FormAside>
    );
}
