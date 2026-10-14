'use client'

import { twMerge } from "tailwind-merge";
import { useBedroom } from "../../hooks/useBedroom";
import BedRoom from "../../types/bedroom";

import FormAside from "../../components/FormAside";
import LabelInput from "../../components/LabelInput";
import MyButton from "../../components/MyButton";

import { FaExchangeAlt } from "react-icons/fa";
import { HiSwitchHorizontal } from "react-icons/hi";

export default function ChangeRoom({ room:bedRoom, className }: {
    room: BedRoom.Type,
    className?: string,
}) {
    const { bedRooms, bedRoomTab, check_move } = useBedroom();

    const submitHandler = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const roomId = e.target.roomId.value as BedRoom.Id;
        const description = e.target.description.value as BedRoom.Id;
        if (bedRooms[roomId].checkIn) throw Error(`La chambre ${roomId} est déjà occupée`);
        check_move(bedRoom.id, roomId, description);
    }

    return (
        <FormAside title="Changer de chambre" bar={false}
            icon={<HiSwitchHorizontal />} onSubmit={submitHandler}
            subClassName="flex flex-col gap-2" className={twMerge("", className)}
            right={
                <MyButton name='change_room' icon={<FaExchangeAlt />}
                    className="!py-1 bg-yellow-700/10 text-yellow-700 border-yellow-700 self-end">Déplacer
                </MyButton>
            }>

            <LabelInput name="roomId"
                options={ bedRoomTab.map(room => ({
                    k: room.id, disabled: !!room.checkIn })) }
            />

            <LabelInput label="Pourquoi ?" name="description" required>
                <textarea className="h-20" name="description" />
            </LabelInput>

        </FormAside>
    );
}
