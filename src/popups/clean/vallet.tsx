'use client';

import { twMerge } from "tailwind-merge";

import { useDataContext } from "../../hooks";

import { employers_datas } from "../../configs/employer";
import Employer from "../../types/employer";
import { getString } from "../../tools";

import { MdPerson, MdPerson3 } from "react-icons/md";

export default function ValletAside() {
  const { cleaners } = useDataContext();

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-bold text-[12px]">Table des vallets</h2>

      <div className="flex flex-col shadow-[inset_0_2px_4px_4px__rgba(0,0,0,0.15)] rounded-md p-2">
        { cleaners.map((cleaner, i) =>
          <ValletLine key={cleaner.id} cleanerId={cleaner.id as Employer.Id}
            className={ (i !== cleaners.length-1) ? "border-b-1" : ""} />
        ) }
      </div>

    </div>
  );
}

function ValletLine({ cleanerId, className }: {
  cleanerId: Employer.Id,
  className?: string,
}) {
  const { cleanedToday } = useDataContext();
  const cleaner = employers_datas[cleanerId];
  const roomsTotal = cleanedToday
    .filter(clean => clean.valletId === cleanerId);
  const roomsDoing = roomsTotal.filter(clean => !('done' in clean || 'cancel' in clean));

  return (
    <div className={twMerge("grid grid-cols-[auto_1fr_auto] items-center gap-x-3 p-2 py-3 rounded border-gray-300", className)}>

      <div className="flex justify-center items-center row-span-3 size-9 bg-gray-400/20 rounded-full">
        { cleaner.sexe === 'Mr'
        ? <MdPerson className="text-green-900" size={18} />
        : <MdPerson3 className="text-green-900" size={18} /> }
      </div>

      <h2 className="col-span-2 font-bold text-[12px] text-gray-800">{cleaner.name}</h2>

      <p className="col-span-2 font-bold text-[12px]"> {getString(roomsDoing.length)} / {getString(roomsTotal.length)} </p>

      <p className={twMerge("font-bold text-[10px]")}>
        { roomsDoing.map(clean => clean.roomId).join(', ') || '...' }
      </p>

      <p className={twMerge("font-bold text-[10px] px-[5px] py-[1px] rounded-md border-1",
          (roomsDoing.length > 0) ? "bg-blue-400/15 border-blue-700" : "bg-green-400/15 border-green-700" )}>
        { roomsDoing.length > 0 ? 'Occupée' : 'Libre' }
      </p>

    </div>
  );
}
