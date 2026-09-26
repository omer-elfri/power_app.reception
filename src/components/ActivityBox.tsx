"use client"

export default function ActivityBox({ icon, text, value, bar=true, color } : {
  icon: React.ReactNode,
  value: number,
  text: string,
  bar?: boolean,
  color?: string,
}) {
  const tab = text.split(" ");
  return ( <>
    <div className="flex flex-col items-center font-bold px-5 py-5 rounded flex-1 text-center">
      <div className="flex flex-row items-end gap-2 mb-5" style={{color}}>
        { icon }
        <h2 className="text-[20px]">{value < 10 ? `0${value}`: value}</h2>
      </div>
      <h2 className="text-[12px]">{tab[0]}</h2>
      <p className="text-[12px] text-gray-400">{tab.slice(1).join(" ")}</p>
    </div>
    { bar && <div className="w-1 h-15 border-r-1 border-gray-400/50" /> }
  </>);
}
