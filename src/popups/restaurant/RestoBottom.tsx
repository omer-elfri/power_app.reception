import { twMerge } from "tailwind-merge";
import { formatPrice } from "../../tools";
import { IconType } from "react-icons/lib";

export default function BottomBox({ title, Icon, className, value }: {
  title: string,
  Icon: IconType,
  className?: string,
  value: number,
}) {
  return (
    <div className={twMerge("grid grid-cols-[auto_1fr] gap-x-2 gap-y-0 p-2 rounded shadow-md bg-white", className)}>

      <div className="row-span-2 mt-2">
        <Icon size={25} className="text-gray-600" />
      </div>

      <h1 className={twMerge("font-bold text-[18px]",
        value > 0 ? "" : "text-gray-600")}>{formatPrice(value) || 0}
      </h1>

      <p className="font-bold text-[10px] text-gray-600 uppercase">{title}</p>

    </div>
  );
}

