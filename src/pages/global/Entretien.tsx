'use client'

import { twMerge } from "tailwind-merge";
import { useDataContext } from "../../hooks";
import { TypeWithTrace } from "../../hooks/useBook";
import { getDuration, getFrenchDateTime } from "../../tools/date";
import { getString } from "../../tools";
import { CleanType } from "../../types/types";

import NoElem from "../../components/NoElem";
import SectionBox, { SeeMore, Title } from "../../components/SectionBox";
import { MdOutlineCleaningServices } from "react-icons/md";
import { PiBroom } from "react-icons/pi";
import { useVisual } from "../../hooks/useVisual";

export default function EntretienSection({ className }: {
  className?: string,
}) {
  const { addPopup, } = useVisual();
  const { cleaning_book } = useDataContext();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(18, 0, 0, 0);


  const todayCleaning = cleaning_book.list.filter(
    clean => !clean.done ||
      clean.created_date.getTime() > yesterday.getTime() ||
      clean.done?.getTime() > yesterday.getTime()
  ).slice(0,15);

  return (
    <SectionBox className={twMerge("max-h-[650px]", className)}
        top={<Title icon={<MdOutlineCleaningServices size={16} />} right={getString(todayCleaning.length)}>Entretiens</Title>}
        bottom={<SeeMore value="Voir tout" onClick={() => addPopup(['CLEANING'])} />}>

        <NoElem list={todayCleaning} Icon={PiBroom} text="Vide" bar={true}>
          <table className="flex flex-col text-gray-600">
            <tbody className="">
              { todayCleaning.map((clean, i) => (
                <tr key={i} className="group flex flex-row gap-3 items-start py-2 border-t-1 border-gray-400/50 cursor-pointer"
                  onClick={() => addPopup(['ROOM', clean.room_id])}>

                  <td className="text-[11px] font-bold min-w-9">{getFrenchDateTime(clean.created_date)}</td>

                  <td className={twMerge("text-[12px] font-bold text-black group-hover:text-green-900 group-hover:scale-110", clean.cancel_date ? "line-through" : "")}>{clean.room_id}</td>

                  <td><CleanStatus clean={clean} /></td>

                  <td className={twMerge("text-[11px] line-clamp-2 font-bold flex-1", clean.cancel_date ? "line-through" : "")}>
                    { clean.valet?.name || "..." }
                  </td>

                  <td className="text-[11px] font-bold">{
                    clean.done ? getDuration(clean.created_date, clean.done) :
                    clean.cancel_date ? getDuration(clean.created_date, clean.cancel_date) : "..."}
                  </td>

                </tr>
              )) }
            </tbody>
          </table>
        </NoElem>

    </SectionBox>
  );
}

export function CleanStatus({ clean }: {
  clean: TypeWithTrace<CleanType>,
}) {
  return (
    <div className="w-2 rounded-full aspect-square mt-[5px]"
      style={{ backgroundColor: clean.done ? "#090" :
        clean.cancel_date ? "#f00" : "#6666" }}
    />
  )
}
