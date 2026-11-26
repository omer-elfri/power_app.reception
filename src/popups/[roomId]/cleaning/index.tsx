'use client';

import { twMerge } from 'tailwind-merge';
import { useAnalysis } from '../../../hooks/useAnalysis';
import BedRoom from '../../../types/bedroom';
import { getFrenchDate, getHour } from '../../../tools/date';

import { AsideDiv } from '../../../components/AsideDiv';
import LabelValue from '../../../components/LabelValue';
import NoElem from '../../../components/NoElem';

import { GiBroom } from "react-icons/gi";
import Caster from '../../../components/Caster';
import { colors } from '../../../types';
import BottomButtons from './Bottom';

export default function CleaningBox({ className, roomId:bedRoomId }: {
  roomId: BedRoom.Id,
  className?: string,
}) {
  const { bedRooms } = useAnalysis();
  const bedRoom = bedRooms[bedRoomId];

  return (
    <AsideDiv title="Dernier néttoyage"
      icon={<GiBroom size={13} className="text-blue-700" />}
      right={<Caster color={colors.cleaning} value={['CLEANING']} />}
      className={twMerge("relative", className)}
      subClassName="gap-2 min-h-15"
      bottom={<BottomButtons room={bedRoom} />}>

      <NoElem list={bedRoom.clean ? [1]: []} text="Aucune information">

        { bedRoom.lastClean?.done && <>
          <LabelValue label='Néttoyée le'>
            <DateTime date={bedRoom.lastClean.done} className="text-gray-500" />
          </LabelValue>
          <LabelValue label='Néttoyée par' className="text-gray-500">
            { bedRoom.lastClean.valet ? `${bedRoom.lastClean.valet.sexe} ${bedRoom.lastClean.valet.name}` : '...' }
          </LabelValue>
        </> }

        { bedRoom.cleaning && <>
          <h2 className='py-1 border-y-1 border-gray-400/50 text-center uppercase text-[10px] text-gray-600'>En néttoyage</h2>
          <LabelValue label='Attibuée le'>{<DateTime date={bedRoom.cleaning.created_date} />}</LabelValue>
          <LabelValue label='Vallet'>{bedRoom.cleaning.valet?.name || '...'}</LabelValue>
        </> }

      </NoElem>

    </AsideDiv>
  );
}


function DateTime({ date, className }: {
  date: Date,
  className?: string,
}) {
  return (
    <p className={twMerge("", className)}>
      <span>{getFrenchDate(date).slice(0,6)} - </span>
      <span className='text-[10px] text-gray-500'>{getHour(date)}</span>
    </p>
  );
}

