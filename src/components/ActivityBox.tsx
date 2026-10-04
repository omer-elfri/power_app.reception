import { twMerge } from "tailwind-merge";

export default function ActivityBox({ icon, label, name, subName, value, onClick, bar=true, color="#000" } : {
  icon?: React.ReactNode,
  label?: string,
  name: string,
  subName?: string | React.ReactNode,
  value: number,
  color?: string,
  bar?: boolean,
  onClick?: () => void,
}) {
  return ( <>

    <div className={twMerge("flex flex-col items-center font-bold px-1 py-5 rounded flex-1 text-center", onClick ? "cursor-pointer" : "")} onClick={onClick}>

      { label && <p className="text-[12px] self-start">{label}</p> }

      <div className="flex flex-row gap-2 h-12 mt-2 text-[#bbb]" style={ value ? {color} : {}}>
        { icon }
        <h2 className="text-[20px]">{value < 10 ? `0${value}`: value}</h2>
      </div>

      <h2 className="text-[12px]">{name}</h2>

      { subName && <p className="text-[12px] text-gray-500">{subName}</p> }

    </div>

    { bar && <div className="h-15 self-center border-l-1 border-gray-400/50" /> }

  </>);
}
