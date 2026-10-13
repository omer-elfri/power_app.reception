'use client';

import { useDataContext } from "../../hooks";
import { twMerge } from "tailwind-merge";
import { getFrenchDate, getString, getTime } from "../../tools";
import { useBedroom } from "../../hooks/useBedroom";

export default function BookingInfos({ className }: {
  className?: string,
}) {
  const { reservations } = useDataContext();
  const { cancel_book } = useBedroom();
  const list = reservations
    .sort((a, b) => a.start.getDate() - b.start.getDate());
  const dateReservations = Object.groupBy(list, rsv => getFrenchDate(rsv.start));

  return (
    <div className={twMerge("flex flex-col gap-3 h-full", className)}>
      <TableTr values={["ID", "Réservée", "Chambre", "Arrivée", "Départ", "Action"]} className="border-b-1 pb-1 border-gray-400/50" />

      { list.length > 0
      
        ? Object.entries(dateReservations).map(([date, room_rsvs]) => (
          <div key={date} className="flex flex-col gap-3 text-gray-600">

            <p className="font-bold text-[12px] px-2 py-1 bg-gray-400/20 rounded">{date}</p>

            <div className="flex flex-col gap-2">
              { room_rsvs?.map(rsv =>
                <TableTr key={rsv.id} values={[
                  getString(rsv.id),
                  getTime(rsv.date),
                  <p className="text-black text-[12px]">{rsv.roomId}</p>,
                  getFrenchDate(rsv.start),
                  rsv.end ? getFrenchDate(rsv.end) : "...",
                  ('cancel' in rsv)
                  ? <p className="text-gray-500/50"
                      onClick={() => {}}>annulée</p>
                  : <p className="text-red-700 hover:underline cursor-pointer"
                      onClick={() => cancel_book(rsv.id)}>annuler</p>,
                ]} />
              ) }
            </div>

          </div> ) )
          
        : <div className="w-full h-full flex justify-center items-center uppercase font-bold text-[12px] text-gray-500 bg-gray-300/40">
          Aucune réservation
        </div>}

    </div>
  );
}

function TableTr({ values, className }: {
  values: React.ReactNode[],
  className?: string,
}) {
  return (
    <div className={twMerge("grid grid-cols-[40px_1fr_1fr_2fr_2fr_auto] gap-3", className)}>
      { values.map((value, i) => (
        <div key={i} className="text-center font-bold text-[11px]">{value}</div>
      ))}
    </div>
  );
}
