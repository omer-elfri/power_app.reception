'use client'

import { twMerge } from "tailwind-merge";
import { useDataContext } from "../../hooks";
import { TypeWithTrace } from "../../hooks/useBook";
import { getDuration, getFrenchDateTime } from "../../tools/date";
import { CleanType } from "../../types/types";
import NoElem from "../../components/NoElem";
import { GiBroom } from "react-icons/gi";

export default function EntretienSection({ cleans }: {
  cleans: TypeWithTrace<CleanType>[],
}) {
  const { addPopup, getCleaner } = useDataContext();

  return (
    <NoElem list={cleans} Icon={GiBroom} text="Vide" bar={true}>
      <table className="flex flex-col text-gray-600">
        <tbody>
          { cleans.map((clean, i) => (
            <tr key={i} className="flex flex-row gap-3 items-start py-2 border-t-1 border-gray-400/50 hover:text-green-800/80 cursor-pointer"
              onClick={() => addPopup(['ROOM', clean.roomId])}>

              <td className="text-[11px] font-bold">{getFrenchDateTime(clean.date)}</td>

              <td className={twMerge("text-[12px] font-bold text-black", clean.cancel ? "line-through" : "")}>{clean.roomId}
              </td>

              <td> <div className="w-2 rounded-full aspect-square mt-[5px]"
                style={{ backgroundColor: clean.done ? "#090" :
                  clean.cancel ? "#f00" : "#6666" }}
              /></td>

              <td className={twMerge("text-[11px] line-clamp-2 font-bold flex-1", clean.cancel ? "line-through" : "")}>
                { getCleaner(clean.valletId)?.name }
              </td>

              <td className="text-[11px] font-bold">{
                clean.done ? getDuration(clean.date, clean.done) :
                clean.cancel ? getDuration(clean.date, clean.cancel.date) : "..."}
              </td>

            </tr>
          )) }
        </tbody>
      </table>
    </NoElem>
  );
}