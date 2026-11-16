'use client';

import { twMerge } from "tailwind-merge";

import { useRequest } from "../../hooks/useRequest";
import { getFrenchDateTime } from "../../tools/date";
import { getString } from "../../tools";

import NoElem from "../../components/NoElem";
import { AsideDiv } from "../../components/FormAside";
import { MyTr } from "../../components/MyTable";
import MyButton from "../../components/MyButton";
import { GiBroom } from "react-icons/gi";
import Room from "../../components/Room";
import { ToRoom } from ".";
import { useVisual } from "../../hooks/useVisual";

export default function ObsoletAside({ className }: {
  className?: string,
}) {
  const { addPopup } = useVisual();
  const { analysis } = useRequest();
  const obsolets = analysis.cleaning.obsolets;

  const gridTodayStyle3 = "w-full grid grid-cols-[45px_30px_1fr_60px] items-center gap-1 py-2 font-bold text-[12px] text-gray-600";

  return (
    <AsideDiv title="Besoin de néttoyage" no_bar
      right={<span className="text-gray-500">{getString(obsolets.length)}</span>}
      className={twMerge("", className)} subClassName="gap-0">

      <MyTr className={twMerge(gridTodayStyle3, "text-gray-800 text-[11px] border-y-1 border-gray-400/50 py-[5px]")}>
        <span>Depuis</span>
        <span>CH</span>
        <span>Vallet</span>
        <span>Action</span>
      </MyTr>

      <NoElem Icon={GiBroom} size={30} list={obsolets} text="Vide" className="h-30">
        { obsolets.map(room => (
          <ToRoom key={room.id} id={room.id} className={twMerge("border-b-1 border-gray-300/80 !text-[10px]", gridTodayStyle3)}>
            <span className="text-[11px]">{ room.lastClean?.done ? getFrenchDateTime(room.lastClean.done) : "..." }</span>
            <Room id={ room.id } />
            <span className="text-[11px]">{ room.lastClean?.valet.name ?? "..." }</span>
            <div className="flex flex-row justify-end gap-2 pr-2" onClick={e => e.stopPropagation()}>
              <MyButton icon={<GiBroom size={10} />} className="text-white !text-[7px] !p-1 !px-2 bg-blue-700 uppercase " onClick={() => addPopup(['VALLET', room.id])}></MyButton>
            </div>
          </ToRoom>
        )) }
      </NoElem>

    </AsideDiv>
  );
}

