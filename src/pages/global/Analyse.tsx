'use client'

import { useDataContext } from "../../datas/context";
import BedRoom from "../../types/bedroom";
import { PieChart } from '@mui/x-charts/PieChart';

export default function AnalyseSection() {
  const { analysis } = useDataContext();
  const data = [
    { label: 'Vendu', value: analysis.nbSolded, color: BedRoom.Status.colors.sold },
    { label: 'Réservée', value: analysis.nbComing, color: BedRoom.Status.colors.coming },
    { label: 'Néttoyage (check-out)', value: analysis.nbCleaning.checkout, color: BedRoom.Status.colors.clean },
    { label: 'Hors service', value: analysis.nbHs, color: BedRoom.Status.colors.hs },
    { label: 'Disponible', value: analysis.nbFree, color: '#8997aa30' },
  ];

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
          data,
          // arcLabel: 'value',
          paddingAngle: 1,
          cornerRadius: 5,
          startAngle: 15,
          endAngle: -315
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
