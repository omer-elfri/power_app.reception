"use client"

import { FaArrowRight }  from "react-icons/fa";
import { twMerge } from "tailwind-merge";

export default function SectionBox({ icon, title, className, notif, children, more }: {
  icon?: React.ReactNode,
  title?: string,
  notif?: string,
  children?: React.ReactNode,
  className?: string,
  more?: { link: string, value?: string, },
}) {
  return (
    <div className={twMerge("flex flex-col flex-1 gap-2 border-1 border-gray-400/50 shadow-md px-5 pt-3 pb-0 rounded-sm overflow-hidden", className)}>

      { title && <div className="flex flex-row gap-2 items-center">
        { icon }
        <h2 className="font-bold text-[12px] uppercase">{title}</h2>
        <div className="flex-1" />
        <span className="text-green-700 text-[12px] font-bold">{notif}</span>
      </div> }

      <div className="flex-1 overflow-auto">
        { children }
      </div>

      { more && <a href="" className="flex flex-row justify-between text-blue-600 font-bold text-[12px] border-t-1 border-gray-500/30 py-3">
        <p>{ more.value ?? "Tout voir" }</p>
        <FaArrowRight />
      </a> }

    </div>
  );
}
