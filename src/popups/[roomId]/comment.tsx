'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

import { State } from '../../types';
import BedRoom from '../../types/bedroom';
import { MdError, MdWarning } from "react-icons/md";
import FormAside from '../../components/FormAside';

export default function CommentBox({ room:bedRoom, className }: {
  room: BedRoom.Type,
  className?: string,
}) {
  const [priority, setPriority] = React.useState<'low' | 'medium' | 'high'>(bedRoom.issue?.priority ?? 'low');
  const [issue, setIssue] = React.useState(bedRoom.issue?.message ?? "");

  return (
    <FormAside title="Commentaire" bar={false}
      // icon={<MdWarning size={15} />}
      className={twMerge('', className)} right={

        <div className='flex flex-row gap-2'>
          <IssusPriority color="text-yellow-600" value="low"
            priority={priority} setPriority={setPriority}>
            <MdWarning size={12} /> Faible
          </IssusPriority>

          <IssusPriority color="text-yellow-800" value="medium"
            priority={priority} setPriority={setPriority}>
            <MdWarning size={12} /> Moyen
          </IssusPriority>

          <IssusPriority color="text-red-600" value="high"
            priority={priority} setPriority={setPriority}>
            <MdError size={12} /> Haut
          </IssusPriority>
        </div>
      } onSubmit={e => {
        e.preventDefault();
        // updateIssue(issue);
      }}>
      <textarea onChange={e => setIssue(e.target.value)} className='pt-3 pb-2 h-full !border-none bg-gray-300/30 px-3 text-[12px]'>{issue}</textarea>
      <input type="submit" value="Envoyer" className='self-end px-3 py-1 text-[12px] bg-black text-white' />

    </FormAside>
  );
}

function IssusPriority({ className, color, priority, setPriority, value, children }: {
  className?: string,
  color: string,
  priority: 'low' | 'medium' | 'high',
  setPriority: State<'low' | 'medium' | 'high'>,
  value: 'low' | 'medium' | 'high',
  children: React.ReactNode,
}) {
  return (
    <div className={twMerge(
      'flex flex-row gap-1 items-center text-[11px] px-2 py-1 rounded bg-gray-200 cursor-pointer',
      priority === value ? color : "text-gray-600", className
    )} onClick={() => setPriority(value)} title={value}>
      {children}
    </div>
  );
}
