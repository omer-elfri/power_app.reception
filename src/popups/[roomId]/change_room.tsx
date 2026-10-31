'use client'

import { twMerge } from "tailwind-merge";
import { useRequest } from "../../hooks/useRequest";
import BedRoom from "../../types/bedroom";

import LabelInput from "../../components/LabelInput";
import MyButton from "../../components/MyButton";
import { FaExchangeAlt } from "react-icons/fa";

export default function ChangeRoom({ room:bedRoom, className }: {
    room: BedRoom.Type,
    className?: string,
}) {
    const { analysis, bedRoomTab } = useRequest();

    // const submitHandler = (e: React.SubmitEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     const roomId = e.target.roomId.value as BedRoom.Id;
    //     const description = e.target.description.value as string;
    //     const toRoom = bedRooms[roomId];
    //     if (!bedRoom.customer)
    //         throw Error(`La chambre ${bedRoom.id} n'est pas occupée`);
    //     if (toRoom.customer)
    //         throw Error(`La chambre ${roomId} est déjà occupée`);
    //     check_move(bedRoom.customer.id, roomId, description);
    //     addPopup(['ROOM', roomId]);
    // }

    return (
        <div className={twMerge("flex flex-row items-center gap-2 bg-white/60 px-3 py-3 font-bold rounded shadow-md w-full", className)}>
            <FaExchangeAlt size={10} />
            <label className="flex-1">Déplacer vers</label>
            <LabelInput name="roomId" options={
                bedRoomTab.map(room => ({
                    k: room.id.toString(),
                    value: `${room.id} ${room.customer?.name.toUpperCase() ?? ""}`,
                    disabled: !!bedRoom.customer,
                })) }
            />
            <MyButton name='change_room'
                disabled={bedRoom.customer && analysis.free.length === 0 || !bedRoom.customer && analysis.solded.length === 0}
                className="!py-1 bg-yellow-700/10 text-yellow-700 border-1 border-yellow-700 self-end !text-[10px]">Déplacer
            </MyButton>
        </div>


        // <FormAside bar={false} title="Déplacer vers" right={
        //     <>


        //         <MyButton name='change_room' icon={<FaExchangeAlt />}
        //             disabled={bedRoom.customer && analysis.free.length === 0 || !bedRoom.customer && analysis.solded.length === 0}
        //             className="!py-1 bg-yellow-700/10 text-yellow-700 border-1 border-yellow-700 self-end !text-[10px]">Déplacer
        //         </MyButton>

        //     </>
        // }
        //     icon={<HiSwitchHorizontal />} onSubmit={submitHandler}
        //     className={twMerge("", className)} subClassName="grid grid-cols-[1fr_auto] gap-2">

        // </FormAside>
    );
}
