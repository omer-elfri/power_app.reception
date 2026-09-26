"use client"

import { FaArrowRight }  from "react-icons/fa";
import { twMerge } from "tailwind-merge";

export default function SectionBox({ icon, title, className, subClassName, notif, children, more }: {
  icon?: React.ReactNode,
  title?: string | React.ReactNode,
  notif?: string | React.ReactNode,
  children?: React.ReactNode,
  className?: string,
  subClassName?: string,
  more?: { link: string, value?: string, },
}) {
  return (
    <div className={twMerge("flex flex-col flex-1 gap-2 border-1 border-gray-400/50 shadow-md px-5 py-3 rounded-sm overflow-hidden bg-gray-100/30", more?"pb-0":"", className)}>

      { title && <div className="flex flex-row gap-2 items-center">
        { icon }
        <h2 className="font-bold text-[12px] uppercase flex-1">{title}</h2>
        <span className="text-green-700 text-[12px] font-bold">{notif}</span>
      </div> }

      <div className={twMerge("flex flex-col gap-1 flex-1 overflow-hidden", subClassName)}>
        { children }
      </div>

      { more && <a href="" className="flex flex-row justify-between text-blue-600 font-bold text-[12px] border-t-1 border-gray-500/30 py-3">
        <p>{ more.value ?? "Tout voir" }</p>
        <FaArrowRight />
      </a> }

    </div>
  );
}
