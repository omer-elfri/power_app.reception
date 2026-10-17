'use client';

import { twMerge } from 'tailwind-merge';
import { useDataContext } from '../../hooks';
import { employers_datas } from '../../configs/employer';

import BedRoom from '../../types/bedroom';
import { getFrenchDateTime } from '../../tools';
import { MdWarning } from "react-icons/md";
import { GiBroom } from "react-icons/gi";
import FormAside from '../../components/FormAside';
import MyTable, { MyTr } from '../../components/MyTable';
import NoElem from '../../components/NoElem';

export default function CleaningBox({ room:bedRoom, className }: {
  room: BedRoom.Type,
  className?: string,
}) {
  const { obsoletRooms, setPopup, cleaning_book } = useDataContext();
  const isObsolet = obsoletRooms.includes(bedRoom.id);
  const roomCleaneds = cleaning_book.get.filter(clean => !clean.cancel && clean.roomId === bedRoom.id);

  return (
    <FormAside title="Néttoyage" className={twMerge('relative', className)}
      right={<GiBroom size={15} onClick={() => setPopup(['CLEAN'])} className='text-blue-600 cursor-pointer' />}>

      { isObsolet && <div className='grid grid-cols-[auto_1fr] items-center gap-2 py-1 px-2 rounded bg-yellow-600/20'>
        <MdWarning size={18} className="text-yellow-600" title="A besoin de néttoyage" />
        <p className='text-gray-800 text-[11px]'>Cette chambre à besoin d'être néttoyer</p>
      </div> }

      <NoElem list={roomCleaneds} text="Aucune information">

        <MyTable datas={roomCleaneds}>
          { clean => <MyTr key={clean.id} color="bg-blue-400/20"
              className='grid-cols-[40px_1fr_40px] text-[11px] text-gray-700'>
            <p>{getFrenchDateTime(clean.date)}</p>
            <p className="text-black">{employers_datas[clean.valletId].name}</p>
            <p>{clean.done ? getFrenchDateTime(clean.done) : '...'}</p>
          </MyTr> }
        </MyTable>

      </NoElem>

    </FormAside>
  );
}
