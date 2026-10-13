'use client';

import React from "react";
import { twMerge } from "tailwind-merge";

import { useDataContext } from "../../hooks";
import { useBedroom } from "../../hooks/useBedroom";

import { employers_datas } from "../../configs/employer";
import { CleanType, TypeWithTrace } from "../../types";
import { getTime } from "../../tools";

import { Bar } from "../../components/SectionBox";
import { FaCheck } from "react-icons/fa";


export default function CleaningTable({ className }: {
  className?: string,
}) {
  const { cleanings, cleaningBook } = useDataContext();
  const cleaningTab = Object.values(cleanings).map(elem => elem[0]);

  return (
    <div className={twMerge("flex flex-col gap-2 text-[13px] text-center font-bold", className)}>

      <TableTr className="py-0">
        <p>Heure</p><p>Chambre</p><p>Vallet</p><p>État</p>
      </TableTr> <Bar />

      { cleaningTab.length > 0 && <>
        <p className="col-span-4 text-left">En cours</p>
        <div className="flex flex-col"> { cleaningTab.map((clean, i) =>
            <CleanLine key={i} index={i} clean={clean} canCancel /> ) }
        </div>
      </>  }

      { cleaningBook.length > 0 && <>
        <p className="col-span-4 text-left mt-3">Toutes</p>
        <div className="flex flex-col"> { cleaningBook.slice(0, 10).map((clean, i) =>
            <CleanLine key={i} index={i} clean={clean} /> ) }
        </div>
      </>  }

    </div>
  );
}

function TableTr({ className, children, index=-1 }: {
  children: React.ReactNode[];
  index?: number,
  className?: string,
}) {
  return (
      <div className={twMerge("grid grid-cols-[50px_60px_1fr_70px] items-center gap-x-3 py-2 relative text-[11px]",
        className, index%2===0 ? "bg-blue-700/8" : "")}>
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
  const { cancel_cleaning } = useBedroom();
  return (
      <TableTr index={index} className={className}>

        <p className="text-gray-600">{getTime(clean.date)}</p>

        <p className="text-[12px]">{clean.roomId}</p>

        <p className="text-gray-800">{employers_datas[clean.valletId].name}</p>

        <p className="flex flex-row justify-center items-center gap-2">
          { ('done' in clean) ?
            <FaCheck size={9} title="Fait" className="absolute bottom-1 right-2 text-green-700" />
          : ('cancel' in clean) ?
            <span title="annulée" className="text-gray-400">annulé</span>
          : canCancel ?
            <span title="annulée" className="text-red-700 cursor-pointer hover:underline"
              onClick={() => cancel_cleaning(clean.roomId)}>annuler</span>
          : null }
        </p>

      </TableTr>
  )
}
