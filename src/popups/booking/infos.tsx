'use client';

import { useDataContext } from "../../hooks";
import { twMerge } from "tailwind-merge";
import { getFrenchDate, getTime } from "../../tools";
import { useBedroom } from "../../hooks/useBedroom";
import NoElem from "../../components/NoElem";

export default function BookingInfos({ className }: {
  className?: string,
}) {
  const { reservations, setPopup } = useDataContext();
  const { cancel_book } = useBedroom();
  const list = reservations
    .sort((a, b) => a.start.getDate() - b.start.getDate());
  const dateReservations = Object.groupBy(list, rsv => getFrenchDate(rsv.start));
  const reservationList = Object.entries(dateReservations);

  return (
    <div className={twMerge("flex flex-col gap-3 h-full", className)}>
      <TableTr values={["Réservée", "Chambre", "Arrivée", "Départ", "Action"]}
        className="border-b-1 pb-1 border-gray-400/50" />

        <NoElem text="Aucune réservation" className="text-[12px] uppercase" list={reservationList}>

          { reservationList.map(([date, room_rsvs]) => (
            <div key={date} className="flex flex-col gap-3 text-gray-600">

              <p className="font-bold text-[12px] px-2 py-1 bg-gray-400/20 rounded">{date}</p>

              <div className="flex flex-col">
                { room_rsvs?.map(rsv =>
                  <TableTr key={rsv.id} onClick={() => setPopup(['BOOKING', rsv.id])} values={[
                    getTime(rsv.date),
                    <p className="text-black text-[12px]">{rsv.roomId}</p>,
                    getFrenchDate(rsv.start),
                    rsv.end ? getFrenchDate(rsv.end) : "...",
                    rsv.cancel
                    ? <p className="text-gray-500/50"
                        onClick={() => {}}>annulée</p>
                    : <p className="text-red-700 hover:underline cursor-pointer"
                        onClick={() => cancel_book(rsv.id)}>annuler</p>,
                  ]} />
                ) }
              </div>

            </div>
          ) ) }

        </NoElem>

    </div>
  );
}

function TableTr({ values, className, onClick }: {
  values: React.ReactNode[],
  className?: string,
  onClick?: () => void,
}) {
  return (
    <div className={twMerge("grid grid-cols-[60px_1fr_2fr_2fr_auto] gap-3 px-2 py-1 \
        hover:bg-blue-400/20 cursor-pointer", className)} onClick={onClick}>
      { values.map((value, i) => (
        <div key={i} className="text-center font-bold text-[11px]">{value}</div>
      ))}
    </div>
  );
}
