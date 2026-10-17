'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

import { PriorityId, State } from '../../types';
import BedRoom from '../../types/bedroom';
import { MdError, MdWarning } from "react-icons/md";
import FormAside from '../../components/FormAside';
import { useBedroom } from "../../hooks/useBedroom";
import { useDataContext } from '../../hooks';

export default function CommentBox({ room:bedRoom, className }: {
  room: BedRoom.Type,
  className?: string,
}) {
  const { checkError } = useDataContext();
  const { updateIssue } = useBedroom();
  const [priority, setPriority] = React.useState<PriorityId>(bedRoom.issue?.priority ?? 'low');

  const rigth = (
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
  );

  return (
    <FormAside title="Commentaire" bar={false} right={rigth}
      className={twMerge('', className)} onSubmit={e => {
        e.preventDefault();
        checkError(() => {
          const message = e.target.message.value;
          if (message === '') throw new Error("Rentrez un commentaire");
          updateIssue(bedRoom.id, {priority, message});
        });
      }}>

      <textarea name="message" defaultValue={bedRoom.issue?.message}
        className='pt-3 pb-2 h-30 !border-none bg-gray-300/30 px-3 text-[12px]'
      />

      { !bedRoom.issue ? (
        <input type="submit" value="Envoyer"
          className='self-end px-3 py-1 text-[12px] bg-blue-600 text-white cursor-pointer'
        />
      ) : <div className='flex flex-row gap-3 justify-end'>
        <button onClick={() => updateIssue(bedRoom.id, null)}
          className='self-end px-3 !py-1 text-[12px] border-1 border-red-600 text-red-600 cursor-pointer'
        >Retirer</button>
        <input type="submit" value="Mofifier"
          className='self-end px-3 py-1 text-[12px] bg-blue-600/70 text-white cursor-pointer'
        />
      </div> }


    </FormAside>
  );
}

function IssusPriority({ className, color, priority, setPriority, value, children }: {
  className?: string,
  color: string,
  priority: PriorityId,
  setPriority: State<PriorityId>,
  value: PriorityId,
  children: React.ReactNode,
}) {
  return (
    <div title={value} onClick={() => setPriority(value)} className={twMerge(
      'flex flex-row gap-1 items-center text-[11px] px-2 py-1 rounded \
      bg-gray-200 cursor-pointer', priority === value ? color : "text-gray-600", className
    )}>{children}</div>
  );
}
