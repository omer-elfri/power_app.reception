'use client';

import { twMerge } from 'tailwind-merge';
import { useDataContext } from '../../hooks';

import BedRoom from '../../types/bedroom';
import { getDuration, getFrenchDateTime } from '../../tools';
import { GiBroom } from "react-icons/gi";
import FormAside from '../../components/FormAside';
import { MyTr } from '../../components/MyTable';
import NoElem from '../../components/NoElem';

export default function CleaningBox({ room:bedRoom, className }: {
  room: BedRoom.Type,
  className?: string,
}) {
  const { addPopup, cleaning_book } = useDataContext();
  const roomCleaneds = cleaning_book.get.filter(clean =>
    !clean.cancel && clean.roomId === bedRoom.id);

  return (
    <FormAside title="Néttoyage" className={twMerge('relative', className)} subClassName=''
      right={<GiBroom size={15} onClick={() => addPopup(['CLEAN'])} className='text-blue-600 cursor-pointer' />}>

      <div className='grid grid-cols-[40px_1fr_40px] text-[11px] text-black text-center'>
        <p className=''>Date</p>
        <p className="">Vallet</p>
        <p className=''>Durée</p>
      </div>

      <NoElem list={roomCleaneds} text="Aucune information">

        <div className='flex flex-col border-t-1 border-gray-400/50'>
          { roomCleaneds.map(clean => <MyTr key={clean.id} color="bg-blue-400/20"
              className='grid-cols-[40px_1fr_40px] text-[11px] text-gray-700'>
            <p className=''>{getFrenchDateTime(clean.date)}</p>
            <p className=''>{clean.name}</p>
            <p className=''>{clean.done ? getDuration(clean.date, clean.done) : "..."}</p>
          </MyTr> ) }
        </div>

      </NoElem>

    </FormAside>
  );
}
