import { twMerge } from "tailwind-merge";

export default function Popup({ className, children, onClose } : {
  className?: string,
  children?: React.ReactNode,
  onClose: () => void,
}) {
  return (
    <div className={twMerge("fixed inset-0 flex justify-center items-center bg-black/50 z-50 backdrop-blur-sm px-10 py-10", className)} onClick={onClose}>
      { children }
    </div>
  );
}

export function PopupBody({ top, className, children } : {
  className?: string,
  top?: React.ReactNode,
  children?: React.ReactNode,
}) {
  return (
    <div className={twMerge("flex flex-col bg-gray-200 rounded-lg w-full max-w-150 p-5 min-h-80 max-h-[calc(100vh-200px)]", className)}
      onClick={(e) => e.stopPropagation()}>
      { top }
      { children }
    </div>
  );
}
