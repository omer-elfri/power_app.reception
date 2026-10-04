import { twMerge } from "tailwind-merge";
import { FaArrowRight }  from "react-icons/fa";

export default function SectionBox({ className, subClassName, children, bottom }: {
  className?: string,
  subClassName?: string,
  children?: React.ReactNode,
  bottom?: React.ReactNode,
}) {
  return (
    <div className={twMerge("flex flex-col gap-2 border-1 border-gray-400/50 shadow-md px-5 py-3 rounded-sm bg-gray-100/30", className)}>
      <div className={twMerge("flex flex-col gap-2 overflow-hidden flex-1", subClassName)}>
        { children }
      </div>
      { bottom }
    </div>
  );
}

export function Title({ icon, children, className, right, bar }: {
  icon?: React.ReactNode,
  children: string | React.ReactNode,
  right?: string | React.ReactNode,
  className?: string,
  bar?: boolean,
}) {
  return (
    <div className={twMerge("flex flex-col gap-2", className)}>

      <div className="flex flex-row gap-2 items-center">
        { icon }
        <div className="font-bold text-[12px] uppercase flex-1">{children}</div>
        <div className="flex flex-row gap-2 text-[12px] font-bold">{right}</div>
      </div>
      { bar && <Bar /> }

    </div>
  );
}

export function Bar({ className }: {
  className?: string,
}) {
  return <hr className={twMerge("text-gray-400/50", className)} />;
}

export function SeeMore({ onClick, value }: {
  onClick?: () => void,
  value?: string,
}) {
  return (
    <div className="flex flex-row justify-between text-blue-600 font-bold text-[12px] border-t-1 border-gray-500/30 pt-3 cursor-pointer" onClick={onClick}>
      <p>{ value ?? "Tout voir" }</p> <FaArrowRight />
    </div>
  );
}
