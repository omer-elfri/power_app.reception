'use client';

import React from "react";
import { twMerge } from "tailwind-merge";

import { useRequest } from "../../hooks/useRequest";
import Employer from "../../types/employer";
import BedRoom from "../../types/bedroom";

import MyButton from "../../components/MyButton";
import LabelInput from "../../components/LabelInput";
import { useDataContext } from "../../hooks";

export default function CleaningForm({ roomId: defaultRoomId, className }: {
  roomId?: BedRoom.Id,
  className?: string,
}) {
  const { cleanerCleans, bedroom_table } = useDataContext();
  const { analysis, bedRooms, bedRoomTab, clean_room } = useRequest();
  const [roomId, setRoomId] = React.useState(defaultRoomId ?? bedroom_table.list[0].id);
  const bedRoom = bedRooms[roomId];

  const valetSelected = cleanerCleans.reduce((selected, cleaner) => (
    cleaner.rooms.length < selected.rooms.length ? cleaner : selected
  ), cleanerCleans[0]);
  const [valetId, setValetId] = React.useState(valetSelected.id as Employer.Id);

  React.useEffect(() => {
    setValetId(valetSelected.id as Employer.Id);
  }, [valetSelected]);

  const cleanHandler = React.useCallback(async (e:  React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const roomId: BedRoom.Id = e.target.roomId.value;
    const valetId: Employer.Id = e.target.valetId.value;
    clean_room(roomId, valetId);
  }, [roomId, valetId, clean_room]);

  return (
    <div className="flex flex-col gap-3 ">
      <h2 className="font-bold text-[12px]">Assigner une chambre</h2>

      <form onSubmit={cleanHandler} className={twMerge("flex flex-col gap-2 rounded-md p-3 \
        shadow-[inset_0_2px_4px_4px__rgba(0,0,0,0.15)]", className)}>

        { analysis.cleaning.obsolets.length > 0 && (
          <div className="flex flex-col gap-2 font-bold bg-red-700/10 px-3 py-2 rounded text-start">
            <h2 className="text-[12px]">Ces chambres sont obsolètes</h2>
            <p className="text-[10px]">{analysis.cleaning.obsolets.map(room => room.name).join(", ")}</p>
          </div>
        ) }

        <LabelInput label="Chambre" name="roomId" value={roomId} required
          onChangeText={setRoomId}
          options={ bedRoomTab.map(room => ({
            k: room.id, value: `${room.id} ${room.clean?.valet.name ?? room.customer?.name ?? ""}`,
            disabled: !!room.clean })) }
        />

        <LabelInput label="Vallet" name="valetId" value={valetId.toString()} required
          onChangeText={text => setValetId(parseInt(text) as Employer.Id)}
          options={ cleanerCleans.map(elem => ({ k: elem.id.toString(), value: `${elem.name} - ${elem.rooms.length}` })) }
        />

        <MyButton name="clean_ch" disabled={roomId ? !!bedRoom.clean : true}
          className="self-end bg-blue-700/20 text-blue-700 border-1 border-blue-700 !py-[2px] mt-3">Néttoyer
        </MyButton>

      </form>
    
    </div>
  );
}

