import React from "react";
import { bedrooms_datas } from "../../datas/room";
import { PieChart } from '@mui/x-charts/PieChart';

export default function AnalyseSection({ infos }: {
  infos: {
    'sold': number,
    'powered': number,
    'coming': number,
    'going': number,
    'cleaning': {
      'check_in': number,
      'check_out': number,
    },
    'breakfast': number,
    'hs': number,
  }
}) {
  const nbBedRooms = bedrooms_datas.length;
  const data = [
    { label: 'Vendu', value: infos.sold, color: '#074507' },
    { label: 'Réservée', value: infos.coming, color: '#aa00c4' },
    { label: 'Néttoyage', value: infos.cleaning.check_out, color: '#28bbff' },
    { label: 'Hors service', value: infos.hs, color: '#8997aa' },
  ];
  const nbRoomFree = React.useMemo(() => (
    data.reduce((res, {value}) => res - value, nbBedRooms)
  ), [data, nbBedRooms]);
  data.push({ label: 'Disponible', value: nbRoomFree, color: '#8997aa30' })

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
            <td className="py-[7px]">
              <div className="w-[10px] rounded-full aspect-square" style={{ backgroundColor: color }} />
            </td>
            <td className="text-[12px] text-gray-600">{label}</td>
            <td className="text-[12px] text-right">{value}</td>
          </tr> ) }
        </tbody>
      </table>
    </div>
  );
}
