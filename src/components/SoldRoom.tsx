import { twMerge } from "tailwind-merge";

export default function SoldRoom ({ name, subName, className, value, color, total } : {
    name?: string,
    subName: string | React.ReactNode,
    className?: string,
    value: number,
    total: number,
    color?: string,
}) {
    const pourcentage = value/total*100;
    return (
        <div className={twMerge("grid grid-cols-[auto_auto_1fr] items-start gap-x-4 font-bold", (value===0)?"text-gray-400":"", className)}>

            <h2 className="row-span-3 text-[20px]" style={{color}}>{value < 10 ? `0${value}`: value}</h2>

            <div className="row-span-3 self-center h-6 border-l-1 border-gray-400/50" />

            { name && <h3 className="text-[12px]" style={{color}}>{name}</h3> }
            <div className="flex flex-row text-[11px] text-gray-500">
                <span className="flex-1">{subName}</span>
                <span>{value} /</span><span className="text-black ml-[1px]">{total}</span>
            </div>
            <div className="bg-gray-400/30 mt-1">
                <div className="h-[3px] bg-green-600" style={{ width: pourcentage.toString()+"%" }} />
            </div>

        </div>
    );
}
