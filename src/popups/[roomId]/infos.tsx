'use client';

import React from 'react';
import { useDataContext } from '../../hooks';
import BedRoom from '../../types/bedroom';
import { formatPrice, getTime } from '../../tools';
import { twMerge } from 'tailwind-merge';
import { MdError, MdWarning } from "react-icons/md";
import { employers_datas } from '../../configs/employer';
import { State } from '../../types';

export default function InfosTab({ room:bedRoom }: {
  room: BedRoom.Type,
}) {
  const { lastCleaneds, restaurant, obsoletRooms, setCleaningPopup } = useDataContext();
  // const { updateIssue } = useBedroom();

  const cleaned = lastCleaneds[bedRoom.id];
  const roomRestos = restaurant.filter(resto => resto.roomId === bedRoom.id);
  const totalPrice = roomRestos.reduce((res, resto) => res + resto.price, 0);
  const isObsolet = obsoletRooms.includes(bedRoom.id);
  const [priority, setPriority] = React.useState<'low' | 'medium' | 'high'>(bedRoom.issue?.priority ?? 'low');
  const [issue, setIssue] = React.useState(bedRoom.issue?.message ?? "");

  return (
    <div className='grid grid-cols-5 gap-3'>

      <Aside title="Néttoyage" className='col-span-2 min-h-40 pb-1 relative'
        right={isObsolet ? <MdWarning className="text-yellow-600" title="A besoin de néttoyage" /> : null}>
        <div className='flex flex-col gap-2 flex-1'>
          { cleaned && <LabelValue label="Néttoyée le">{getTime(cleaned.date)}</LabelValue> }
          { cleaned && <LabelValue label="Vallet">{employers_datas[cleaned.valletId].name}</LabelValue> }
          { cleaned && <LabelValue label="Description">{cleaned.description || "..."}</LabelValue> }
        </div>
        <div className='bg-blue-400/30 absolute text-center text-[10px] text-gray-800 cursor-pointer py-1 rounded left-1 right-1 bottom-1 p-0' onClick={() => setCleaningPopup(true)}>Table de Néttoyage</div>
      </Aside>

      <Aside title="Restauration" className='col-span-3' right={ totalPrice > 0 && (
        <p className='text-[12px]'>
          <span className=''>{formatPrice(totalPrice)}</span>{' '}
          <span className='text-[9px]'>FCFA</span>
        </p> )
      }>{ roomRestos.length === 0
        ? <p className='flex justify-center items-center flex-1 text-center uppercase text-gray-400 text-[12px]'>Vide</p>
        : roomRestos.map(resto => (
          <LabelValue key={resto.id} label={resto.article}>{formatPrice(resto.price)}</LabelValue>
        )) }
      </Aside>

      <Aside title="Signaler un problème" className='col-span-5' right={
        <div className='flex flex-row gap-2'>
          <IssusPriority color="text-yellow-600" value="low"
            priority={priority} setPriority={setPriority}>
            <MdWarning size={12} /> Faible
          </IssusPriority>

          <IssusPriority color="text-red-600" value="medium"
            priority={priority} setPriority={setPriority}>
            <MdWarning size={12} /> Moyen
          </IssusPriority>

          <IssusPriority color="text-red-600" value="high"
            priority={priority} setPriority={setPriority}>
            <MdError size={12} /> Haut
          </IssusPriority>
        </div>
      }>
        <form className='flex flex-col gap-2' onSubmit={e => {
          e.preventDefault();
          // updateIssue(issue);
        }}>
          <textarea onChange={e => setIssue(e.target.value)} className='pt-3 pb-2 h-30 !border-none bg-gray-300/30 px-3 text-[12px]'>{issue}</textarea>
          <input type="submit" value="Envoyer" className='self-end px-3 py-1 text-[12px] bg-black text-white' />
        </form>

      </Aside>

    </div>
  );
}

function IssusPriority({ color, priority, setPriority, value, children }: {
  color: string,
  priority: 'low' | 'medium' | 'high',
  setPriority: State<'low' | 'medium' | 'high'>,
  value: 'low' | 'medium' | 'high',
  children: React.ReactNode,
}) {
  return (
    <div className={twMerge(
      'flex flex-row gap-1 items-center text-[11px] px-2 py-1 rounded bg-gray-200 cursor-pointer',
      priority === value ? color : "text-gray-600"
    )} onClick={() => setPriority(value)} title={value}>
      {children}
    </div>
  );
}

export function Aside({ title, right, className, subClassName, children }: {
  title: string,
  right?: React.ReactNode,
  className?: string,
  subClassName?: string,
  children: React.ReactNode,
}) {
  return (
    <div className={twMerge('flex flex-col gap-3 bg-white/60 px-3 py-3 rounded', className)}>

      <div className='flex flex-row gap-2 border-b-1 border-gray-300 pb-1'>
        <h3 className='text-[12px] font-bold flex-1'>{title}</h3>
        { right }
      </div>

      <div className={twMerge('flex flex-col gap-1 flex-1', subClassName)}>
        { children }
      </div>

    </div>
  );
}

function LabelValue({ label, children }: {
  label: string,
  children: React.ReactNode,
}) {
  return (
    <div className='flex flex-row justify-between'>
      <label className='!text-[10px]'>{label}</label>
      <p className='!text-[10px]'>{children}</p>
    </div>
  )
}

