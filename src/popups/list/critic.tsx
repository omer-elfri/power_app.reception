'use client';

import React from "react";
import { twMerge } from "tailwind-merge";
import { useDataContext } from "../../hooks";
import BedRoom from '../../types/bedroom';
import { PriorityId } from "../../types";
import { getFrenchDateTime } from '../../tools/date';

import NoElem from "../../components/NoElem";
import { MyTh, RoomId, TheTable } from "./table";

import { IoBedOutline } from "react-icons/io5";
import { FaRegClock } from 'react-icons/fa';
import { MdOutlineDescription, MdOutlinePriorityHigh, MdWarning } from 'react-icons/md';
import { BiBed } from "react-icons/bi";

export default function IssueTab({ datas }: {
  datas: BedRoom.Type[],
}) {
  const { isObsolet, addPopup } = useDataContext();

  return (
    <NoElem text="Aucun élément" Icon={BiBed} className='text-[15px]' list={datas}>

      <TheTable datas={datas} top={[
        <MyTh Icon={FaRegClock} value="Date" />,
        <MyTh Icon={IoBedOutline} value="CH" size={15} />,
        <MyTh Icon={MdOutlineDescription} value="Description" />,
        <MyTh Icon={MdOutlinePriorityHigh} value="Priorité" />,
      ]} onClick={room => isObsolet(room.id) ? addPopup(['VALLET', room.id]) : addPopup(['ROOM', room.id])} >
        { room => [
          <span>{ room.issue ? getFrenchDateTime(room.issue.date) : '...'}</span>,

          <RoomId value={room.id} />,

          <div>{room.issue?.message ??
            <div className='grid grid-cols-[auto_1fr] items-center gap-2 text-center'>
              <MdWarning size={18} className='text-yellow-800' />
              <p>Cette chambre doit être néttoyée</p>
            </div>
          }</div>,

          <div className='flex flex-row justify-end'>
            <IssueLabel issue={room.issue ?? {
                date: new Date(),
                priority: 'medium',
                message: "Sale",
            }} />
          </div>,
        ] }
      </TheTable>

    </NoElem>
  );
}


export function IssueLabel({ issue }: {
  issue: BedRoom.IssueType,
}) {

  const issueMap: Record<PriorityId, { bg: string, border: string, text: string }> = React.useMemo(() => {
    return {
      'low': { bg: "bg-blue-800", border: "bg-blue-400/20 border-blue-800/50", text: "Faible", },
      'medium': { bg: "bg-yellow-800", border: "bg-yellow-400/20 border-yellow-800/50", text: "Moyen", },
      'high': { bg: "bg-red-800", border: "bg-red-400/20 border-red-800/50", text: "Grave", },
    };
  }, []);

  return (
    <div title={issue.message}
      className={twMerge("flex flex-row gap-1 rounded px-1 border-1", issueMap[issue.priority].border)}>
      <div className={twMerge('p-1 self-center rounded-full', issueMap[issue.priority].bg)} />
      <span className='text-[11px]'>{issueMap[issue.priority].text}</span>
    </div>
  );
}

