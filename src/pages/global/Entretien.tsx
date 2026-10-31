'use client'

import { twMerge } from "tailwind-merge";
import { useDataContext } from "../../hooks";
import { getDuration, getFrenchDateTime } from "../../tools/date";
import NoElem from "../../components/NoElem";
import SectionBox, { SeeMore, Title } from "../../components/SectionBox";
import { MdOutlineCleaningServices } from "react-icons/md";
import { PiBroom } from "react-icons/pi";

export default function EntretienSection({ className }: {
  className?: string,
}) {
  const { addPopup, cleaning_book } = useDataContext();
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
        top={<Title icon={<MdOutlineCleaningServices size={16} />} right={todayCleaning.length}>Entretiens</Title>}
        bottom={<SeeMore value="Voir tout" onClick={() => addPopup(['CLEAN'])} />}>

        <NoElem list={todayCleaning} Icon={PiBroom} text="Vide" bar={true}>
          <table className="flex flex-col text-gray-600">
            <tbody>
              { todayCleaning.map((clean, i) => (
                <tr key={i} className="flex flex-row gap-3 items-start py-2 border-t-1 border-gray-400/50 hover:text-green-800/80 cursor-pointer"
                  onClick={() => addPopup(['ROOM', clean.room_id])}>

                  <td className="text-[11px] font-bold">{getFrenchDateTime(clean.created_date)}</td>

                  <td className={twMerge("text-[12px] font-bold text-black", clean.cancel_date ? "line-through" : "")}>{clean.room_id}
                  </td>

                  <td> <div className="w-2 rounded-full aspect-square mt-[5px]"
                    style={{ backgroundColor: clean.done ? "#090" :
                      clean.cancel_date ? "#f00" : "#6666" }}
                  /></td>

                  <td className={twMerge("text-[11px] line-clamp-2 font-bold flex-1", clean.cancel_date ? "line-through" : "")}>
                    { clean.valet?.name }
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