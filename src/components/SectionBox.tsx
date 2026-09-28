import { FaArrowRight }  from "react-icons/fa";
import { twMerge } from "tailwind-merge";

export default function SectionBox({ className, subClassName, children, more }: {
  className?: string,
  subClassName?: string,
  children?: React.ReactNode,
  more?: { link: string, value?: string, },
}) {
  return (
    <div className={twMerge("flex flex-col flex-1 gap-2 border-1 border-gray-400/50 shadow-md px-5 py-3 rounded-sm overflow-hidden bg-gray-100/30", more?"pb-0":"", className)}>

      <div className={twMerge("flex flex-col gap-1 flex-1 overflow-hidden", subClassName)}>
        { children }
      </div>

      { more && <a href="" className="flex flex-row justify-between text-blue-600 font-bold text-[12px] border-t-1 border-gray-500/30 py-3">
        <p>{ more.value ?? "Tout voir" }</p> <FaArrowRight />
      </a> }

    </div>
  );
}

type TitleProps = {
  icon?: React.ReactNode,
  name: string | React.ReactNode,
  notif?: string | React.ReactNode,
  className?: string,
  bar?: boolean,
};

export function Title({ icon, name, className, notif, bar }: TitleProps) {
  return (
    <div className={twMerge("flex flex-col gap-2", className)}>

      <div className="flex flex-row gap-2 items-center">
        { icon }
        <div className="font-bold text-[12px] uppercase flex-1">{name}</div>
        <div className="flex flex-row gap-2 text-[12px] font-bold">{notif}</div>
      </div>
  
      { bar && <hr className="text-gray-400/50" /> }

    </div>
  );
}
