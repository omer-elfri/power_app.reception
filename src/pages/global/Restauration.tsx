"use client"

import { twMerge } from "tailwind-merge";
import BedRoom from "../../types/bedroom";

export default function RestaurationSection({ datas }: {
  datas: {
    'time': string,
    'roomId': BedRoom.Id,
    'client': string,
    'article': string,
    'price': number,
  }[],
}) {
  return (
    <table className="w-full border-separate border-spacing-y-2 border-spacing-x-3">
      <thead>
        <tr className="text-[11px] font-bold">
          <th className="">Heure</th>
          <th className="">Chambre</th>
          <th className="">Client</th>
          <th className="">Article</th>
          <th className="">Prix</th>
        </tr>
      </thead>
      <thead>
        <tr><td colSpan={5} className="">
          <hr className="text-gray-400/40" />
        </td></tr>
        { datas.map((data, i) => (
          <tr key={i} className={twMerge("text-center py-2 text-gray-600 text-[12px]", (i!==datas.length-1)?"border-b-1 border-gray-400/50":"")}>
            <td className="">{data.time}</td>
            <td className="font-bold text-[11px]">{data.roomId}</td>
            <td className="">{data.client}</td>
            <td className="">{data.article}</td>
            <td className="">{data.price}</td>
          </tr>
        )) }
      </thead>

    </table>
  );
}
