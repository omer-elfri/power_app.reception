'use client';

import { twMerge } from "tailwind-merge";

import { useDataContext } from "../../hooks";
import { getFrenchDateTime } from "../../tools/date";
import { getString } from "../../tools";

import { CleanStatus } from "../../pages/global/Entretien";
import NoElem from "../../components/NoElem";
import Room from "../../components/Room";
import { AsideDiv } from "../../components/AsideDiv";
import { MyTr } from "../../components/MyTable";
import { MdCalendarToday } from 'react-icons/md';
import { ToRoom } from ".";

export default function TodayCleanAside({ className }: {
  className?: string,
}) {
  const { cleaning_book } = useDataContext();

  const gridTodayStyle = "w-full grid grid-cols-[40px_40px_1fr_35px_40px] gap-1 py-2 font-bold text-[12px] text-gray-600";
  const todayCleans = cleaning_book.getToday();

  return (
    <AsideDiv title="Audjourd'hui" no_bar
      right={<span className="text-gray-500">{getString(todayCleans.length)}</span>}
      className={twMerge("", className)} subClassName="gap-0">

      <MyTr className={twMerge(gridTodayStyle, "text-gray-800 text-[11px] border-y-1 border-gray-400/50 py-[5px]")}>
        <span>Date</span>
        <span>CH</span>
        <span>Vallet</span>
        <span>Statut</span>
        <span>Fin</span>
      </MyTr>

      <NoElem Icon={MdCalendarToday} size={30} list={todayCleans} text="Vide" className="h-30 my-10">
        { todayCleans.map(clean => (
          <ToRoom key={clean.id} id={clean.room_id} className={twMerge("group border-b-1 border-gray-300/80 !text-[10px]", gridTodayStyle)}>
            <span>{ clean ? getFrenchDateTime(clean.created_date) : "..." }</span>
            <Room id={clean.room_id} className="group-hover:text-green-900" />
            <span>{ clean.valet?.name || '...' }</span>
            <div className="flex flex-row justify-center items-center"><CleanStatus clean={clean} /></div>
            <span>{ clean?.done ? getFrenchDateTime(clean.done) : "..." }</span>
          </ToRoom>
        )) }
      </NoElem>

    </AsideDiv>
  );
}

