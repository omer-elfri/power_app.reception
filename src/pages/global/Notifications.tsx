"use client"

import { twMerge } from "tailwind-merge";
import Status from "../../types/status";

export default function NotificationSection({ datas }: {
  datas: {
    'time': string,
    'label': Status.Id,
    'value': string,
  }[],
}) {
  const tab = [1,1,1,1,1,1,1];

  return (
    <table className="flex flex-col text-gray-600 min-h-60">
      <tbody>{ datas.map((data, i) => (
        <tr key={i} className={twMerge("flex flex-row gap-3 items-start py-2", (i!==tab.length-1)?"border-b-1 border-gray-400/20":"")}>
          <td className="text-[11px] font-bold">{data.time}</td>
          <td><div className="w-2 rounded-full aspect-square mt-[5px]" style={{backgroundColor: Status.datas[data.label].color}} /></td>
          <td className="text-[12px] line-clamp-2">{data.value}</td>
        </tr>
      )) }</tbody>
    </table>
  );
}
