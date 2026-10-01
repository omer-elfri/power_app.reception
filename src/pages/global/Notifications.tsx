'use client'

import { twMerge } from "tailwind-merge";
import { useDataContext } from "../../datas/context";
import { getTime } from "../../tools";
import { colors } from "../../types";

export default function NotificationSection() {
  const { notifications } = useDataContext();

  return (
    <table className="flex flex-col text-gray-600 min-h-60">
      <tbody>{ notifications.slice(0,10).map((data, i) => (

        <tr key={i} className={twMerge("flex flex-row gap-3 items-start py-2",
          (i!==notifications.length-1)?"border-b-1 border-gray-400/20":"")}>
          <td className="text-[11px] font-bold">{getTime(data.time)}</td>
          <td>
            <div className="w-2 rounded-full aspect-square mt-[5px]"
              style={{ backgroundColor: colors[data.label] }}
            />
          </td>
          <td className="text-[12px] line-clamp-2">{data.value}</td>
        </tr>
      )) }</tbody>
    </table>
  );
}
