'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useRequest } from '../../hooks/useRequest';
import BedRoom from '../../types/bedroom';
import { getFrenchDate, getHour } from '../../tools/date';

import { AsideDiv } from '../../components/AsideDiv';
import MyButton from '../../components/MyButton';
import LabelValue from '../../components/LabelValue';
import NoElem from '../../components/NoElem';

import { GiBroom } from "react-icons/gi";
import { ImCross } from 'react-icons/im';
import { FaCheck } from 'react-icons/fa';
import { useVisual } from '../../hooks/useVisual';
import Caster from '../../components/Caster';
import { colors } from '../../types';

export default function CleaningBox({ className, roomId:bedRoomId }: {
  roomId: BedRoom.Id,
  className?: string,
}) {
  const { addPopup } = useVisual();
  const { bedRooms, clean_done, clean_cancel } = useRequest();
  const bedRoom = bedRooms[bedRoomId];

  const Right =  React.useCallback(() => {
    return (<>

      { !bedRoom.cleaning && <MyButton
        className='!text-[10px] bg-blue-500 text-white !px-2 !py-1 gap-x-1'
        onClick={() => addPopup(['VALLET', bedRoomId])}>Néttoyer
      </MyButton> }

      <Caster color={colors.cleaning} value={['CLEANING']} />
      
    </>
    );
  }, [addPopup, bedRoomId]);

  const Bottom = React.useCallback(() => {
    return (
      <div className='grid grid-cols-2 gap-3'>

        <MyButton icon={<ImCross size={10} />}
          className='!text-[10px] border-1 border-red-500 text-red-500 bg-transparant !px-2 !py-1 gap-x-1'
          onClick={() => clean_cancel(bedRoomId)}>Annuler
        </MyButton>

        <MyButton iconRight={<FaCheck size={12} />}
          className='!text-[10px] text-blue-500 !px-2 !py-[2px] gap-x-1'
          onClick={() => clean_done(bedRoomId)}>Terminer
        </MyButton>

      </div>
    );
  }, [clean_cancel, clean_done]);

  const DateTime = ({ date }: {
    date: Date,
  }) => {
    return (
      <p>
        <span>{getFrenchDate(date).slice(0,6)} - </span>
        <span className='text-[10px] text-gray-500'>{getHour(date)}</span>
      </p>
    );
  }

  return (
    <AsideDiv title="Dernier néttoyage"
      icon={<GiBroom size={13} className='text-blue-700' />}
      right={ <Right /> }
      className={twMerge('relative', className)}
      subClassName='gap-2 min-h-15'
      bottom={ bedRoom.cleaning && <Bottom /> }>

      <NoElem list={bedRoom.clean ? [1]: []} text="Aucune information">
        <LabelValue label='Date'>{bedRoom.clean && <DateTime date={bedRoom.clean.created_date} />}</LabelValue>
        <LabelValue label='Vallet'>{bedRoom.clean && bedRoom.clean.valet.name}</LabelValue>
        <LabelValue label='Fin'>{ bedRoom.clean?.done
          ? <DateTime date={bedRoom.clean.done} />
          : <span className='text-gray-500'>en néttoyage</span> }
        </LabelValue>
        <LabelValue label='Commentaire' className='flex-wrap'>{bedRoom.clean?.description}</LabelValue>
      </NoElem>

    </AsideDiv>
  );
}

