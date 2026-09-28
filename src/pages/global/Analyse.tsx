'use client'

import React from "react";

import { room_list } from "../../datas/types";
import { PieChart } from '@mui/x-charts/PieChart';
import { useDataContext } from "../../datas/context";
import BedRoom from "../../types/bedroom";

export default function AnalyseSection() {
  const { analysis } = useDataContext();
  const nbBedRooms = room_list.length;
  const data = [
    { label: 'Vendu', value: analysis.nbSolded, color: BedRoom.Status.datas.sold.color },
    { label: 'Réservée', value: analysis.nbComing, color: BedRoom.Status.datas.booked.color },
    { label: 'Néttoyage (check-out)', value: analysis.nbCleaning.checkout, color: BedRoom.Status.datas.clean.color },
    { label: 'Hors service', value: analysis.nbHs, color: BedRoom.Status.datas.hs.color },
  ];
  const nbRoomFree = React.useMemo(() => (
    data.reduce((res, {value}) => res - value, nbBedRooms)
  ), [data, nbBedRooms]);
  data.push({ label: 'Disponible', value: nbRoomFree,
      color: BedRoom.Status.datas.free.color })

  return (
    <div className="flex flex-col w-full gap-3">
      <PieChart
        className="self-center"
        width={140}
        height={140}
        hideLegend={true}
        series={[{
          innerRadius: 10,
          outerRadius: 70,
          data: data,
          // arcLabel: 'value',
          paddingAngle: 1,
          cornerRadius: 5,
          startAngle: 30,
          endAngle: -360
        }]}
      />
      <table className="">
        <tbody>
          { data.map(({label, value, color}) => <tr key={label} className="py-2 font-bold">
            <td className="py-[7px] pr-1">
              <div className="w-[10px] rounded-full aspect-square" style={{ backgroundColor: color }} />
            </td>
            <td className="text-[12px] text-gray-600">{label}</td>
            <td className="text-[12px] text-right pl-1">{value}</td>
          </tr> ) }
        </tbody>
      </table>
    </div>
  );
}
