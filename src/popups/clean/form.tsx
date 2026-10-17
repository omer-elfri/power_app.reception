'use client';

import React from "react";
import { twMerge } from "tailwind-merge";

import { useDataContext } from "../../hooks";
import { useBedroom } from "../../hooks/useBedroom";
import Employer from "../../types/employer";
import BedRoom from "../../types/bedroom";

import MyButton from "../../components/MyButton";
import LabelInput from "../../components/LabelInput";
import { roomIds } from "../../configs/room";

export default function CleaningForm({ roomId: defaultRoomId, className }: {
  roomId?: BedRoom.Id,
  className?: string,
}) {
  const { cleaners, obsoletRooms } = useDataContext();
  const { bedRooms, bedRoomTab, clean_room } = useBedroom();
  const [roomId, setRoomId] = React.useState(defaultRoomId ?? roomIds[0]);
  const valletSelected = cleaners.reduce((selected, cleaner) =>
    cleaner.rooms.length < selected.rooms.length ? cleaner : selected, cleaners[0]);
  const [valletId, setValletId] = React.useState<Employer.Id>(valletSelected.id);

  React.useEffect(() => {
    setValletId(valletSelected.id as Employer.Id);
  }, [valletSelected]);

  const cleanHandler = React.useCallback(async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const roomId: BedRoom.Id = e.target.roomId.value;
    const valletId: Employer.Id = e.target.valletId.value;
    clean_room(roomId, valletId);
  }, [roomId, valletId, clean_room]);

  return (
    <div className="flex flex-col gap-3 ">
      <h2 className="font-bold text-[12px]">Assigner une chambre</h2>

      <form onSubmit={cleanHandler} className={twMerge("flex flex-col gap-2 rounded-md p-3 \
        shadow-[inset_0_2px_4px_4px__rgba(0,0,0,0.15)]", className)}>

        { obsoletRooms.length > 0 && (
          <div className="flex flex-col gap-2 font-bold bg-red-700/10 px-3 py-2 rounded text-start">
            <h2 className="text-[12px]">Ces chambres sont obsolètes</h2>
            <p className="text-[10px]">{obsoletRooms.join(", ")}</p>
          </div>
        ) }

        <LabelInput label="Chambre" name="roomId" value={roomId} required
          onChangeText={text => setRoomId(text as BedRoom.Id)}
          options={ bedRoomTab.map(room => ({
            k: room.id, value: `${room.id} ${room.cleaner?.name ?? room.customer?.name ?? ""}`,
            disabled: !!room.cleaner })) }
        />

        <LabelInput label="Vallet" name="valletId" value={valletId} required
          onChangeText={text => setValletId(text as Employer.Id)}
          options={ cleaners.map(elem => ({ k: elem.id, value: `${elem.name} - ${elem.rooms.length}` })) }
        />

        <MyButton name="clean_ch" disabled={roomId ? !!bedRooms[roomId].cleaner : true}
          className="self-end bg-blue-700/20 text-blue-700 border-1 border-blue-700 !py-[2px] mt-3">Néttoyer
        </MyButton>

      </form>
    
    </div>
  );
}

