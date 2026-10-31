'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useDataContext } from '../../hooks';
import { useRequest } from '../../hooks/useRequest';
import BedRoom from '../../types/bedroom';
import { getFrenchDate, getHour } from '../../tools/date';

import { AsideDiv } from '../../components/FormAside';
import MyButton from '../../components/MyButton';
import LabelValue from '../../components/LabelValue';
import NoElem from '../../components/NoElem';
import { GiBroom } from "react-icons/gi";
import { ImCross } from 'react-icons/im';
import { FaCheck } from 'react-icons/fa';

export default function CleaningBox({ className, roomId:bedRoomId }: {
  roomId: BedRoom.Id,
  className?: string,
}) {
  const { addPopup, getCleaner } = useDataContext();
  const { bedRooms, done_cleaning, cancel_cleaning } = useRequest();
  const bedRoom = bedRooms[bedRoomId];
  const clean = bedRoom.lastClean;

  const Right =  React.useCallback(() => {
    return (
      <MyButton
        className='!text-[10px] bg-blue-500 text-white !px-2 !py-1 gap-x-1'
        onClick={() => addPopup(['VALLET', bedRoomId])}>Néttoyer
      </MyButton>
    );
  }, [addPopup, bedRoomId]);

  const Bottom = React.useCallback(() => {
    const cleanId = bedRoom.clean!.id;
    return (
      <div className='grid grid-cols-2 gap-3'>

        <MyButton icon={<ImCross size={10} />}
          className='!text-[10px] border-1 border-red-500 text-red-500 bg-transparant !px-2 !py-1 gap-x-1'
          onClick={() => cancel_cleaning(cleanId)}>Annuler
        </MyButton>

        <MyButton iconRight={<FaCheck size={12} />}
          className='!text-[10px] text-blue-500 !px-2 !py-[2px] gap-x-1'
          onClick={() => done_cleaning(cleanId)}>Terminer
        </MyButton>

      </div>
    );
  }, [cancel_cleaning, done_cleaning, bedRoom.clean]);

  return (
    <AsideDiv title="Dernier néttoyage"
      icon={<GiBroom size={13} className='text-blue-700' />}
      right={ !bedRoom.clean && <Right /> }
      className={twMerge('relative', className)}
      subClassName='gap-2 min-h-15'
      bottom={ bedRoom.clean && <Bottom /> }>

      <NoElem list={clean ? [1]: []} text="Aucune information">
        <LabelValue label='Date'>{clean && getFrenchDate(clean.created_date).slice(0,6)
          +' - '+getHour(clean.created_date)}</LabelValue>
        <LabelValue label='Vallet'>{clean && getCleaner(clean.valet_id)?.name}</LabelValue>
        <LabelValue label='Fin'>{clean?.done ? getFrenchDate(clean.done).slice(0,6)+' - '+getHour(clean.done) : 'en néttoyage'}</LabelValue>
        <LabelValue label='Commentaire' className='flex-wrap'>{clean?.description}</LabelValue>
      </NoElem>

    </AsideDiv>
  );
}

