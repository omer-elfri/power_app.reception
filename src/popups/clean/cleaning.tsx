'use client';

import { twMerge } from "tailwind-merge";
import { useRequest } from "../../hooks/useRequest";
import { useAnalysis } from "../../hooks/useAnalysis";
import { getFrenchDateTime } from "../../tools/date";

import NoElem from "../../components/NoElem";
import Room from "../../components/Room";
import { AsideDiv } from "../../components/AsideDiv";
import MyButton from "../../components/MyButton";

import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { GiBroom } from "react-icons/gi";
import { ToRoom } from ".";

export default function CleaningAside({ className }: {
  className?: string,
}) {
  const { analysis } = useAnalysis();
  const { clean_done, clean_cancel } = useRequest();
  const gridStyle = "w-full grid grid-cols-[45px_30px_1fr_60px] items-center gap-1 py-2 font-bold text-[12px] text-gray-600 [&>*]:bggreen-500";
  const cleanings = analysis.cleaning.total;

  return (
    <AsideDiv title="En néttoyage" no_bar nb={cleanings.length}
      className={twMerge("", className)} subClassName="gap-0">

      <div className={twMerge(gridStyle, "text-center text-gray-800 text-[11px] py-[5px] border-y-1 border-gray-400/50")}>
        <span>Date</span>
        <span>CH</span>
        <span>Vallet</span>
        <span>Action</span>
      </div>

      <NoElem Icon={GiBroom} size={30} list={cleanings} text="Vide" className="h-30">
        { cleanings.map(room => (
          <ToRoom key={room.id} id={room.id}
            className={twMerge(gridStyle, "group last:border-0 border-b-1 border-gray-300/80 text-[10px] text-center")}>

            <span className="text-[11px]">{ room.cleaning ? getFrenchDateTime(room.cleaning.created_date) : "..." }</span>

            <Room id={room.id} className="group-hover:text-blue-700" />

            <span className="text-[11px]">{ room.cleaning?.valet?.name || '...' }</span>

            <div className="flex flex-row justify-end gap-2 pr-2" onClick={e => e.stopPropagation()}>
              <MyButton className="text-white !p-1 bg-red-700" onClick={() => clean_cancel(room.id)}><ImCross size={10} /></MyButton>
              <MyButton className="text-white !p-1 bg-green-700" onClick={() => clean_done(room.id)}><FaCheck size={10} /></MyButton>
            </div>

          </ToRoom>
        )) }
      </NoElem>

    </AsideDiv>
  );
}

