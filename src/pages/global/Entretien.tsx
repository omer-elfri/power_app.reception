'use client'

import { twMerge } from "tailwind-merge";
import { useDataContext } from "../../hooks";
import { getFrenchDateTime } from "../../tools";

export default function EntretienSection() {
  const { cleaning_book } = useDataContext();
  const today = new Date(Date.now());
  const todayCleaning = cleaning_book.get.filter(
    clean => (!clean.done && !clean.cancel) ||
      clean.date.getDate() === today.getDate() ||
      clean.done?.getDate() === today.getDate() ||
      clean.cancel?.getDate() === today.getDate()
  ).slice(0,15);

  return (
    <table className="flex flex-col text-gray-600">
      <tbody>
        { todayCleaning.map((clean, i) => (
          <tr key={i} className="flex flex-row gap-3 items-start py-2 border-t-1 border-gray-400/50">

            <td className="text-[11px] font-bold">{getFrenchDateTime(clean.date)}</td>

            <td className={twMerge("text-[12px] font-bold text-black", clean.cancel ? "line-through" : "")}>{clean.roomId}</td>

            <td> <div className="w-2 rounded-full aspect-square mt-[5px]"
              style={{ backgroundColor: clean.done ? "#090" :
                clean.cancel ? "#f00" : "#6666" }}
            /></td>

            <td className={twMerge("text-[11px] line-clamp-2 font-bold flex-1", clean.cancel ? "line-through" : "")}>
              {clean.name}
            </td>

            <td className="text-[11px] font-bold">{
              clean.done ? getFrenchDateTime(clean.done) :
              clean.cancel ? getFrenchDateTime(clean.cancel) : ""}
            </td>

          </tr>
        )) }
      </tbody>
    </table>
  );
}