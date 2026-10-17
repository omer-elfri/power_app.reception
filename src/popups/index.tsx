import { twMerge } from "tailwind-merge";
import { useDataContext } from "../hooks";
import { ImCross } from "react-icons/im";
import MyButton from "../components/MyButton";

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

export function PopupBody({ top, bottom, className, subClassName, children } : {
  top?: React.ReactNode,
  bottom?: React.ReactNode,
  className?: string,
  subClassName?: string,
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

      { bottom }

    </div>
  );
}


export function CloseBtn() {
  const { unPopup } = useDataContext();
  return (
    <MyButton icon={<ImCross size={10} />}
      className="bg-red-700/10 text-[11px] text-red-700 p-2 rounded"
      onClick={unPopup}
    />
    // <ImCross size={13}
    //   className="text-red-700 cursor-pointer"
    //   onClick={unPopup}
    // />
  );
}

