'use client'

import { PieChart } from '@mui/x-charts/PieChart';
import { colors } from "../../types";
import { useRequest } from "../../hooks/useRequest";
import SectionBox, { Title } from '../../components/SectionBox';
import { twMerge } from 'tailwind-merge';

export default function AnalyseSection({ className }: {
  className?: string,
}) {
  const { analysis, bedRoomTab } = useRequest();

  const data = [
    { label: 'Vendu',
      value: analysis.solded.length,
      color: colors.sold
    },
    { label: 'Libre et réservée',
      value: analysis.coming.free.length,
      color: colors.coming
    },
    { label: 'Chambres sales',
      value: analysis.cleaning.free.length,
      color: colors.cleaning
    },
    { label: 'Hors service',
      value: analysis.issues.filter(room => room.issue?.priority === 'high').length,
      color: colors.issue
    },
    { label: 'Prêt à vendre',
      value: analysis.free.length,
      color: '#8997aa30'
    },
  ];
  return (
    <SectionBox className={twMerge("", className)}
      top={<Title>Analyse</Title>}
      subClassName="w-full gap-3">

      <PieChart
        className="self-center"
        width={140}
        height={140}
        hideLegend={true}
        series={[{
          innerRadius: 20,
          outerRadius: 70,
          data: bedRoomTab.length > 0 ? data : [{
            label: 'Chargement...',
            value: 1,
            color: '#8997aa30'
          }],
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

    </SectionBox>
  );
}
