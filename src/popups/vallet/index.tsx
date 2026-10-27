'use client';

import { PopupBody } from "..";
import { useDataContext } from "../../hooks";
import { useBedroom } from "../../hooks/useBedroom";
import BedRoom from "../../types/bedroom";
import Employer from "../../types/employer";
import { getString } from "../../tools";

import { Title } from "../../components/SectionBox";
import { PersonSex2 } from "../../components/PersonSex";
import { twMerge } from "tailwind-merge";

export default function ValletPopup({ roomId:bedRoomId, className }: {
  roomId: BedRoom.Id,
  className?: string,
}) {
  const { unPopup, cleaners, cleaning_book } = useDataContext();
  const { clean_room } = useBedroom();
    
  return (
    <PopupBody top={<Title className="text-white">
        <h1><span className="text-[20px]">CH {bedRoomId}</span> Choisissez un vallet</h1>
      </Title>}
      className={twMerge("bg-transparent", className)}
      subClassName="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-5 overflow-visible">

      { cleaners.map(cleaner => {
        const roomsTotal = cleaning_book.today.filter(clean => clean.valletId === cleaner.id);
        const roomsDone = roomsTotal.filter(clean => clean.done);
        return (
          <div key={cleaner.id} className="grid grid-rows-[1fr_auto] gap-2 p-4 bg-white rounded relative animate-1 cursor-pointer hover:scale-105 transition-transform duration-700 ease-in-out"
            onClick={() => { clean_room(bedRoomId, cleaner.id as Employer.Id); unPopup(); }}>

            <div className="grid gris-cols-2 gap-1 w-12 absolute top-3 right-2 text-white p-2 rounded text-center">
              <p className="text-white bg-green-800">{getString(roomsDone.length)}</p>
              <p className="text-white bg-red-800">{getString(roomsTotal.length)}</p>
            </div>

            <div className="flex justify-center items-center">
              <PersonSex2 sexe={cleaner.sexe} size={50} className="text-gray-600" />
            </div>

            <div className="flex flex-row justify-center px-2 pt-2 border-t-1 border-gray-400/50">
              <span className="font-bold text-[13px] uppercase text-center">{ cleaner.name }</span>
            </div>

          </div>
        )
      }
      )}
    </PopupBody>
  );
}
