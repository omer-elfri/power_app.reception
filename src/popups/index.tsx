import { twMerge } from "tailwind-merge";
import { useDataContext } from "../hooks";

export default function Popup({ className, children } : {
  className?: string,
  children?: React.ReactNode,
}) {
  const { unPopup } = useDataContext();
  return (
    <div className={twMerge("fixed inset-0 flex justify-center items-center \
      bg-black/50 z-50 backdrop-blur-[4px] px-10 py-10", className)} onClick={unPopup}>
      { children }
    </div>
  );
}

export function PopupBody({ top, className, subClassName, children } : {
  className?: string,
  subClassName?: string,
  top?: React.ReactNode,
  children?: React.ReactNode,
}) {
  return (
    <div className={twMerge("flex flex-col gap-3 bg-gray-200 rounded-lg \
      w-full max-w-160 p-5 min-h-80 max-h-[calc(100vh-100px)]", className)}
      onClick={e => e.stopPropagation()}>
      { top }
      <div className={twMerge("flex flex-col gap-3 overflow-auto flex-1", subClassName)}>
        { children }
      </div>
    </div>
  );
}

