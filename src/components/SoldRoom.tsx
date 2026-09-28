import { twMerge } from "tailwind-merge";

export default function SoldRoom ({ name, subName, className, value, bar=true, color } : {
    name?: string,
    subName: string,
    className?: string,
    value: number,
    bar?: boolean,
    color?: string,
}) {
    return ( <>

        <div className={twMerge("grid grid-cols-[30px_100px] grid-rows-[auto_auto] justify-center items-start gap-x-2 font-bold", (value===0)?"text-gray-400":"", className)}>
            <h2 className="row-span-2 text-[20px] ml-2" style={{color}}>{value < 10 ? `0${value}`: value}</h2>
            { name && <h3 className="text-[12px]" style={{color}}>{name}</h3> }
            <p className="text-[11px] text-gray-500">{subName}</p>
        </div>

        { bar && <div className="h-6 border-r-1 border-gray-400/50" /> }

    </> );
}
