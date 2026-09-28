'use client'

import { useDataContext } from "../../datas/context";
import BedRoom from "../../types/bedroom";
import { twMerge } from "tailwind-merge";

export default function NotificationSection() {
  const { notifications } = useDataContext();

  return (
    <table className="flex flex-col text-gray-600 min-h-60">
      <tbody>{ notifications.map((data, i) => (

        <tr key={i} className={twMerge("flex flex-row gap-3 items-start py-2",
          (i!==notifications.length-1)?"border-b-1 border-gray-400/20":"")}>
          <td className="text-[11px] font-bold">{data.time}</td>
          <td>
            <div className="w-2 rounded-full aspect-square mt-[5px]"
              style={{ backgroundColor: BedRoom.Status.colors[data.label] }}
            />
          </td>
          <td className="text-[12px] line-clamp-2">{data.value}</td>
        </tr>
      )) }</tbody>
    </table>
  );
}
