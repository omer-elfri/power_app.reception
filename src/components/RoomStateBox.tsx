"use client"

import { IconType } from "react-icons/lib";
import { twMerge } from "tailwind-merge";

export default function RoomStateBox({ Icon, name, color, bar=true, value, className }: {
  Icon: IconType,
  name: string,
  color: string,
  value: number,
  bar?: boolean,
  className?: string,
}) {
  return (
    <div className="flex flex-row">
      <div className={twMerge("grid grid-cols-[auto_auto] gap-x-2 flex-1", className)}>
        <Icon size={25} className="row-span-2" color={color} />
        <h2 className="font-bold text-[12px]" style={{color}}>{name}</h2>
        <p className="font-bold text-[12px]">{value}</p>
      </div>
      { bar && <div className="h-15 border-l-1 border-gray-400/50" /> }
    </div>
  );
}
