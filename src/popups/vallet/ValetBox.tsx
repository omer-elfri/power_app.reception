'use client';

import { twMerge } from "tailwind-merge";
import { useDataContext } from "../../hooks";
import { useRequest } from "../../hooks/useRequest";
import { useVisual } from "../../hooks/useVisual";

import BedRoom from "../../types/bedroom";
import Employer from "../../types/employer";
import { getString } from "../../tools";
import { PersonSex2 } from "../../components/PersonSex";

export default function ValetBox({ roomId:bedRoomId, cleaner, className }: {
  roomId: BedRoom.Id,
  cleaner: Employer.Type,
  className?: string,
}) {
  const { unPopup } = useVisual();
  const { cleaning_book } = useDataContext();
  const { clean_room } = useRequest();

  const roomsTotal = cleaning_book.getToday()
    .filter(clean => clean.valet_id === cleaner.id);
  const roomsDone = roomsTotal.filter(clean => clean.done);

  return (
    <div key={cleaner.id}
      className={twMerge("grid grid-rows-[1fr_auto] gap-2 p-4 bg-white rounded relative animate-1 transition-transform duration-700 ease-in-out hover:scale-105 cursor-pointer", className)}
      onClick={() => { clean_room(bedRoomId, cleaner.id as Employer.Id); unPopup(); }}>

      <div className="grid gris-cols-2 gap-1 w-12 absolute top-3 right-2 text-white p-2 rounded text-center font-bold">
        <p className="text-black bg-green-800/40">{getString(roomsDone.length)}</p>
        <p className="text-white bg-green-800">{getString(roomsTotal.length)}</p>
      </div>

      <div className="flex justify-center items-center min-h-30">
        <PersonSex2 sexe={cleaner.sexe} size={50} className="text-gray-600" />
      </div>

      <div className="flex flex-row justify-center pt-2 border-t-1 border-gray-400/50">
        <span className="font-bold text-[13px] uppercase text-center">{ cleaner.name }</span>
      </div>

    </div>
  );
}

