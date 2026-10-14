'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useDataContext } from '../../hooks';
import { employers_datas } from '../../configs/employer';

import BedRoom from '../../types/bedroom';
import { getTime } from '../../tools';
import { MdWarning } from "react-icons/md";
import { GiBroom } from "react-icons/gi";
import FormAside from '../../components/FormAside';
import LabelValue from '../../components/LabelValue';

export default function CleaningBox({ room:bedRoom, className }: {
  room: BedRoom.Type,
  className?: string,
}) {
  const { lastCleaneds, obsoletRooms, setCleaningPopup } = useDataContext();
  const cleaned = lastCleaneds[bedRoom.id];
  const isObsolet = obsoletRooms.includes(bedRoom.id);

  return (
    <FormAside title="Néttoyage"
      icon={<GiBroom size={15} />}
      className={twMerge('relative', className)}
      right={isObsolet ? <MdWarning className="text-yellow-600" title="A besoin de néttoyage" /> : null}>
      <div className='flex flex-col gap-2 flex-1'>
        { cleaned && <LabelValue label="Néttoyée le">{getTime(cleaned.date)}</LabelValue> }
        { cleaned && <LabelValue label="Vallet">{employers_datas[cleaned.valletId].name}</LabelValue> }
        { cleaned && <LabelValue label="Description">{cleaned.description || "..."}</LabelValue> }
      </div>
      <div className='bg-blue-400/30 text-center text-[10px] text-gray-800 cursor-pointer py-1 rounded' onClick={() => setCleaningPopup(true)}>Table de Néttoyage</div>
    </FormAside>
  );
}
