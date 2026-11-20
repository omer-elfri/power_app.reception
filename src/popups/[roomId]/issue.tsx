'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import { PriorityId, State } from '../../types';
import BedRoom from '../../types/bedroom';
import { useRequest } from '../../hooks/useRequest';
import { useVisual } from '../../hooks/useVisual';

import { AsideDiv } from '../../components/AsideDiv';
import MyButton from '../../components/MyButton';
import { MdError, MdWarning } from "react-icons/md";

export default function CommentBox({ room:bedRoom, className }: {
  room: BedRoom.Type,
  className?: string,
}) {
  const { checkError } = useVisual();
  const { updateIssue } = useRequest();
  const [priority, setPriority] = React.useState(bedRoom.issue?.priority ?? null);
  const [message, setMessage] = React.useState(bedRoom.issue?.message ?? "");
  const buttonStyle = "px-3 !py-1 !text-[10px]";

  React.useEffect(() => {
    console.log(",,,")
    setPriority(p => !p ? (bedRoom.issue?.priority ?? null) : p);
    setMessage(m => { console.log("m",m); return m === "" ? (bedRoom.issue?.message ?? "") : m});
  }, [bedRoom]);

  const submitHandler = () => {
    checkError(async () => {
      if (!priority) throw ['error', "Précisez la priorité"];
      if (message === '') throw ['error', "Rentrez un commentaire"];
      updateIssue(bedRoom.id, { priority, message });
    });
  }

  return (
    <AsideDiv title="Signaler un problème" className={twMerge("", className)}>

      <IssuePart priority={priority} setPriority={setPriority} />

      <textarea name="message" value={message} onChange={e => setMessage(e.target.value)}
        className='shadow-[inset_0_1px_1px_1px_rgba(0,0,0,0.15)] px-3 pt-3 pb-2 h-20 !border-none bg-gray-300/20 text-[12px]'
      />

      <div className='flex flex-row gap-3 justify-end'>
        { !bedRoom.issue
        ?
          <MyButton onClick={submitHandler} disabled={!priority || message === ""}
            className={twMerge("bg-blue-600 text-white", buttonStyle)}
          >Envoyer</MyButton>
        : <>
          <MyButton onClick={submitHandler}
            className={twMerge("bg-transparent border-1 border-red-600 text-red-600", buttonStyle)}
          >Retirer</MyButton>

          <MyButton onClick={() => updateIssue(bedRoom.id, null)}
            className={twMerge("bg-blue-600/70 text-white", buttonStyle)}
          >Modifier</MyButton>
        </> }
      </div>

    </AsideDiv>
  );
}

function IssuePart({ priority, setPriority }: {
  priority: PriorityId | null,
  setPriority: State<PriorityId | null>,
}) {
  return (
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
}
function IssusPriority({ className, color, priority, setPriority, value, children }: {
  className?: string,
  color: string,
  priority: PriorityId | null,
  setPriority: State<PriorityId | null>,
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
