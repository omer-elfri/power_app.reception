import { twMerge } from 'tailwind-merge';
import { getFrenchDate } from '../../../tools/date';

import { TypeWithTrace } from '../../../hooks/useBook';
import { ReservationType } from '../../../types/types';

export default function BookLine({ rsv, className }: {
  rsv: TypeWithTrace<ReservationType>,
  className?: string,
}) {
  return (
    <div className={twMerge("text-[11px] py-[7px] border-b-1 \
      border-gray-400/40 last:border-0 text-gray-600", className)}>
      <p>{getFrenchDate(rsv.created_date).slice(0,6)}</p>
      <p>{rsv.name}</p>
      <p>{getFrenchDate(rsv.start_date).slice(0,6)}</p>
      <p>{getFrenchDate(rsv.end_date).slice(0,6)}</p>
    </div>
  );
}
