'use client'

import { twMerge } from "tailwind-merge";
import { useDataContext } from "../../datas/context";
import { formatPrice, getTime } from "../../tools";

export default function RestaurationSection() {
  const { restauration } = useDataContext();

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

        { restauration.map((data, i) => (
          <tr key={i} className={twMerge("text-center py-2 text-gray-600 text-[11px] font-bold",
            (i!==restauration.length-1)?"border-b-1 border-gray-400/50":"")}>
            <td className="">{getTime(data.time)}</td>
            <td className="text-[12px]">{data.roomId}</td>
            <td className="">{data.client}</td>
            <td className="">{data.article}</td>
            <td className="">{formatPrice(data.price)}</td>
          </tr>
        )) }
      </thead>

    </table>
  );
}
