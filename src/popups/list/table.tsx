'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

import { useDataContext } from "../../hooks";
import BedRoom from '../../types/bedroom';

import { getString } from '../../tools';
import { IconType } from 'react-icons/lib';

export function TheTable({ top, children, datas }: {
  top: React.ReactNode[],
  datas: BedRoom.Type[],
  children: (d: BedRoom.Type) => React.ReactNode[],
}) {
  const { addPopup } = useDataContext();
  const roomStages = Object.groupBy(datas, room => room.stage);

  return (
    <table className='[&_td,&_th]:py-1 font-bold text-[12px] text-gray-600'>

      <thead className='font-bold'>
        <tr className='text-[12px]'>{ top.map((elem, i) => <th key={i}>{elem}</th>) }</tr>
        <tr><th colSpan={top.length}> <hr className='text-gray-400' /></th></tr>
      </thead>

      <tbody className=''>{ Object.entries(roomStages).map(([stage, rooms]) => <React.Fragment key={stage}>

          <tr>
            <td colSpan={top.length}>
              <div className='text-left font-bold flex flex-row gap-2 items-center pt-2'>
                <hr className='flex-1 text-gray-400' />
                <p className='text-center uppercase text-green-800'>{stage}</p>
                <hr className='flex-1 text-gray-400' />
                <p className='flex justify-center items-center self-end bg-green-800/10 border-1 border-green-800 \
                  py-[1px] px-2 rounded-full text-[11px] text-green-800 float-right font-bold'>
                  { getString(rooms?.length ?? 0) }
                </p>
              </div>
            </td>
          </tr>

          { rooms?.map((room, i) =>
            <tr key={room.id} onClick={() => addPopup(['ROOM', room.id])} className={twMerge('[&_td,&_th]:px-5 [&_td,&_th]:py-2 text-center \
                border-b-1 border-gray-400/40 group hover:!bg-blue-400/15 hover:textwhite cursor-pointer', i%2===0 ? "bg-blue-600/2" : "")}>
              { children(room).map((elem, i) => <td key={i}>{elem}</td>) }
            </tr>
          ) }

        </React.Fragment> ) }
      </tbody>

    </table>
  );
}

export function RoomId({ value }: { value: BedRoom.Id }) {
  const { addPopup } = useDataContext();
  return (
    <span className='text-[13px] text-black cursor-pointer hover:underline'
      onClick={e => { e.stopPropagation(); addPopup(['ROOM', value])}}>{value}
    </span>
  );
}

export function MyTh({ Icon, size=13, className, value }: {
  Icon: IconType, size?: number, className?: string, value: string
}) {
  return (
    <div className={twMerge('flex flex-row justify-center items-center gap-2', className)}>
      <Icon size={size} /> <span>{value}</span>
    </div>
  );
}

