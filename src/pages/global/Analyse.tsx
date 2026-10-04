'use client'

import { useDataContext } from "../../hooks";
import { PieChart } from '@mui/x-charts/PieChart';
import { colors } from "../../types";

export default function AnalyseSection() {
  const { analysis } = useDataContext();
  const data = [
    { label: 'Vendu',
      value: analysis.solded.length,
      color: colors.sold
    },
    { label: 'Réservée',
      value: analysis.coming.length,
      color: colors.coming
    },
    { label: 'Néttoyage (check-out)',
      value: analysis.cleaning.check_out.length,
      color: colors.cleaning
    },
    { label: 'Hors service',
      value: analysis.issues.length,
      color: colors.issue
    },
    { label: 'Disponible',
      value: analysis.free.length,
      color: '#8997aa30'
    },
  ];
  return (
    <div className="flex flex-col w-full gap-3">
      <PieChart
        className="self-center"
        width={140}
        height={140}
        hideLegend={true}
        series={[{
          innerRadius: 20,
          outerRadius: 70,
          data,
          // arcLabel: 'value',
          paddingAngle: 1,
          cornerRadius: 5,
          startAngle: 25,
          endAngle: -325,
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
