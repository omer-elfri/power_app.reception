'use client';

import { twMerge } from 'tailwind-merge';
import { useDataContext } from '../../hooks';

import { getFrenchDateTime, getHour } from '../../tools/date';
import { GiBroom } from "react-icons/gi";
import FormAside from '../../components/FormAside';
import MyButton from '../../components/MyButton';
import { CleanType } from '../../types/types';
import LabelValue from '../../components/LabelValue';
import { TypeWithTrace } from '../../hooks/useBook';
import NoElem from '../../components/NoElem';
import BedRoom from '../../types/bedroom';
import { useBedroom } from '../../hooks/useBedroom';

export default function CleaningBox({ clean, className, roomId:bedRoomId }: {
  clean: TypeWithTrace<CleanType> | null,
  roomId: BedRoom.Id,
  className?: string,
}) {
  const { addPopup, getCleaner } = useDataContext();
  const { bedRooms, cancel_cleaning } = useBedroom();
  const bedRoom = bedRooms[bedRoomId];

  const right = ( !bedRoom.cleaner ?
    <MyButton
      className='!text-[10px] bg-blue-500 text-white !px-2 !py-1 gap-x-1'
      onClick={() => addPopup(['VALLET', bedRoomId])}>Néttoyer
    </MyButton> :
    <MyButton
      className='!text-[10px] border-1 border-red-500 text-red-500 bg-transparant !px-2 !py-1 gap-x-1'
      onClick={() => cancel_cleaning(bedRoom.cleaner!.id)}>Annuler
    </MyButton>
  );

  return (
    <FormAside icon={<GiBroom size={13} className='text-blue-700' />} title="Dernier néttoyage" right={right}
      className={twMerge('relative', className)} subClassName='gap-2 min-h-15'>

      <NoElem list={clean ? [1]: []} text="Aucune information">
        <LabelValue label='Date'>{clean && getFrenchDateTime(clean.date)+' - '+getHour(clean.date)}</LabelValue>
        <LabelValue label='Vallet'>{clean && getCleaner(clean.valletId)?.name}</LabelValue>
        <LabelValue label='Fin'>{clean?.done ? getFrenchDateTime(clean.done)+' - '+getHour(clean.done) : 'en néttoyage'}</LabelValue>
        <LabelValue label='Commentaire' className='flex-wrap'>{clean?.description}</LabelValue>
      </NoElem>

    </FormAside>
  );
}

