"use client"

import { twMerge } from "tailwind-merge";

export default function NotificationSection({ datas }: {
  datas: {
    'time': string,
    'label': 'SOLD' | 'BOOKED' | 'RESTAURANT',
    'value': string,
  }[],
}) {
  const tab = [1,1,1,1,1,1,1];

  return (
    <table className="flex flex-col bg-gray-100 text-gray-600 min-h-60">
      <tbody>{ datas.map((data, i) => (
        <tr key={i} className={twMerge("flex flex-row gap-3 items-start py-2", (i!==tab.length-1)?"border-b-1 border-gray-400/20":"")}>
          <td className="text-[11px] font-bold">{data.time}</td>
          <td><div className={twMerge("w-2 rounded-full aspect-square mt-[5px]", {
            'SOLD': "bg-green-700",
            'BOOKED': "bg-red-700",
            'RESTAURANT': "bg-purple-700",
          }[data.label])} /></td>
          <td className="text-[12px] line-clamp-2">{data.value}</td>
        </tr>
      )) }</tbody>
    </table>
  );
}
