'use client';

import { MdPerson } from "react-icons/md";
import Popup, { PopupBody } from "..";
import { Title } from "../../components/SectionBox";
import { useDataContext } from "../../hooks";
import { getString } from "../../tools";
import { useBedroom } from "../../hooks/useBedroom";
import BedRoom from "../../types/bedroom";

export default function ValletPopup({ roomId: bedRoomId }: {
  roomId: BedRoom.Id,
}) {
  const { cleaners, todayCleaned, unPopup } = useDataContext();
  const { clean_room } = useBedroom();
    
  return (
    <Popup className="">
      <PopupBody top={<Title className="text-white">Choisissez un vallet</Title>} className="bg-transparent" subClassName="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-5 overflow-visible">
        { cleaners.map(cleaner => {
          const roomsTotal = todayCleaned.filter(clean => (
            !clean.cancel && clean.valletId === cleaner.id));
          const roomsDone = roomsTotal.filter(clean => clean.done);
          return (
          <div key={cleaner.id} className="grid grid-rows-[1fr_auto] gap-2 p-4 bg-white rounded relative animate-1 cursor-pointer hover:scale-105 transition-transform duration-700 ease-in-out" onClick={() => {
            clean_room(bedRoomId, cleaner.id);
            unPopup();
          }}>

            <div className="grid gris-cols-2 gap-1 w-12 absolute top-3 right-2 text-white p-2 rounded text-center">

              <p className="text-white bg-green-800">{getString(roomsDone.length)}</p>
              <p className="text-white bg-red-800">{getString(roomsTotal.length)}</p>

            </div>

            <div className="flex justify-center items-center">
              { cleaner.name
                ? <MdPerson size={50} />
                : <MdPerson size={50} /> }
            </div>

            <div className="flex flex-row justify-center px-2 pt-2 border-t-1 border-gray-400/50">
              <span className="font-bold text-[13px] uppercase text-center">{ cleaner.name }</span>
            </div>

          </div>
        )})}
      </PopupBody>
    </Popup>
  );
}
