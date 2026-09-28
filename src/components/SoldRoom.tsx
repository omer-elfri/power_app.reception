import { twMerge } from "tailwind-merge";

export default function SoldRoom ({ name, subName, className, value, color } : {
    name?: string,
    subName: string,
    className?: string,
    value: number,
    color?: string,
}) {
    return (
        <div className={twMerge("grid grid-cols-[auto_auto_1fr] items-start gap-x-4 font-bold", (value===0)?"text-gray-400":"", className)}>

            <h2 className="row-span-3 text-[20px]" style={{color}}>{value < 10 ? `0${value}`: value}</h2>

            <div className="row-span-3 self-center h-6 border-l-1 border-gray-400/50" />

            { name && <h3 className="text-[12px]" style={{color}}>{name}</h3> }
            <p className="text-[11px] text-gray-500">{subName}</p>
            <div className="bg-gray-400/30 mt-1">
                <div className="h-[3px] bg-green-600 w-[50%]" />
            </div>

        </div>
    );
}
