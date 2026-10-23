'use client';

import { twMerge } from "tailwind-merge";

import Employer from "../../types/employer";
import { getString } from "../../tools";
import { PersonSex2 } from "../../components/PersonSex";
import { useDataContext } from "../../hooks";

export default function ValletAside() {
  const { cleaners } = useDataContext();

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-bold text-[12px]">Table des vallets</h2>

      <div className="flex flex-col shadow-[inset_0_2px_4px_4px__rgba(0,0,0,0.15)] rounded-md p-2">
        { cleaners.map((cleaner, i) =>
          <ValletLine key={cleaner.id} cleanerId={cleaner.id as Employer.Id}
            className={ (i !== cleaners.length-1) ? "border-b-1" : ""}
          />
        ) }
      </div>

    </div>
  );
}

export function ValletLine({ cleanerId, className }: {
  cleanerId: Employer.Id,
  className?: string,
}) {
  const { cleaning_book, employer_table } = useDataContext();
  const cleaner = employer_table.getId(cleanerId);
  const roomsTotal = cleaning_book.today.filter(clean => clean.valletId === cleanerId);
  const roomsDone = roomsTotal.filter(clean => clean.done);

  if (!cleaner) return null;

  return (
    <div className={twMerge("grid grid-cols-[auto_1fr_auto] items-center gap-x-3 p-2 py-3 rounded border-gray-300", className)}>

      <div className="flex justify-center items-center row-span-2 size-9 bg-gray-400/20 rounded-full">
        <PersonSex2 sexe={cleaner.sexe} size={18} className="text-green-900" />
      </div>

      <h2 className="font-bold text-[12px] text-gray-800 col-span-2">{cleaner.name}</h2>

      <p className="font-bold text-[12px]"> {getString(roomsDone.length)} / {getString(roomsTotal.length)} </p>

      <p className={twMerge("font-bold text-[10px] px-[5px] py-[1px] rounded-md border-1 mt-1",
          (roomsDone.length < roomsTotal.length) ? "bg-blue-400/15 border-blue-700" : "bg-green-400/15 border-green-700" )}>
        { roomsDone.length < roomsTotal.length ? 'Occupée' : 'Libre' }
      </p>

    </div>
  );
}
