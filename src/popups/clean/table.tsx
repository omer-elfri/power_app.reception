'use client';

import React from "react";
import { twMerge } from "tailwind-merge";

import { useDataContext } from "../../hooks";
import { useBedroom } from "../../hooks/useBedroom";

import { TypeWithTrace } from "../../types";
import { getDuration, getTime } from "../../tools/date";

import { Bar } from "../../components/SectionBox";
import { FaCheck } from "react-icons/fa";
import { GiBroom } from "react-icons/gi";
import { ImCross } from "react-icons/im";
import NoElem from "../../components/NoElem";
import { CleanType } from "../../types/types";


export default function CleaningTable({ list, className }: {
  list: TypeWithTrace<CleanType>[],
  className?: string,
}) {
  const { cleaning_book } = useDataContext();
  const cleaningTab = cleaning_book.get.filter(clean => !clean.done);

  return (
    <div className={twMerge("flex flex-col gap-2 text-[13px] text-center font-bold", className)}>

      <TableTr className="py-0">
        <p>Heure</p><p>Chambre</p><p>Vallet</p><p>État</p>
      </TableTr> <Bar />

      <NoElem Icon={GiBroom} list={list} text="Aucun élément trouvé">
        <div className="overflow-auto flex flex-col gap-2">

          { cleaningTab.length > 0 && <>
            <p className="flex flex-row gap-2 col-span-4 text-left mt-3 text-[12px]">
              <span className="flex-1">En cours</span>
              <span>{cleaningTab.length} chambres</span>
            </p>
            <div className="flex flex-col"> { cleaningTab.map((clean, i) =>
              <CleanLine key={clean.id} index={i} clean={clean} canCancel /> ) }
            </div>
          </>  }

          { list.length > 0 && <>
            <p className="flex flex-row gap-2 col-span-4 text-left mt-3 text-[12px]">
              <span className="flex-1"> { list.length !== cleaning_book.get.length ? "Aujourd'hui" : "Toutes" }</span>
              <span>{list.length} chambres</span>
            </p>
            <div className="flex flex-col"> { list.map((clean, i) =>
              <CleanLine key={clean.id} index={i} clean={clean} /> ) }
            </div>
          </>  }

        </div>
      </NoElem>


    </div>
  );
}

function TableTr({ className, children, index=-1, onClick }: {
  children: React.ReactNode[];
  index?: number,
  className?: string,
  onClick?: () => void,
}) {
  return (
      <div className={twMerge("grid grid-cols-[50px_60px_1fr_70px] items-center gap-x-3 py-2 relative text-[11px]",
        className, index%2===0 ? "bg-blue-700/8" : "")} onClick={onClick}>
        { children }
      </div>
  )
}

function CleanLine({ clean, className, canCancel, index=-1 }: {
  clean: TypeWithTrace<CleanType>,
  index?: number,
  className?: string,
  canCancel?: boolean,
}) {
  const { addPopup } = useDataContext();
  const { done_cleaning, cancel_cleaning } = useBedroom();
  return (
      <TableTr index={index} onClick={() => addPopup(['ROOM', clean.roomId])}
          className={twMerge(className, "group hover:bg-blue-400/20 cursor-pointer")}>

        <p className="text-gray-600">{getTime(clean.date)}</p>

        <p className="text-[12px] cursor-pointer hover:underline"
          onClick={() => {
            addPopup(['ROOM', clean.roomId]);
          }}>{clean.roomId}
        </p>

        <p className="text-gray-800">{clean.name}</p>

        <div className="flex flex-row justify-center items-center gap-2">

          { clean.done ? <>
            { getDuration(clean.date, clean.done) }
            {/* { getTime(clean.done) } */}
            <FaCheck size={9} title="Fait" className="absolute bottom-1 right-2 text-green-700" />
          </>

          : clean.cancel ?
            <span title="annulée" className="text-gray-400">annulé</span>

          : canCancel ? <div className="flex flex-row flex-wrap gap-1 hidden group-hover:flex" onClick={e => e.stopPropagation()}>

            <div className="flex justify-center items-center p-1 size-5 bg-red-700 text-white rounded-full cursor-pointer"
              onClick={() => cancel_cleaning(clean.roomId)}><ImCross size={10} />
            </div>

            <div className="flex justify-center items-center p-1 size-5 bg-blue-700 text-white rounded-full cursor-pointer"
              onClick={() => done_cleaning(clean.roomId)}><FaCheck size={10} />
            </div>

          </div> : null }

        </div>

      </TableTr>
  )
}
