'use client';

import { useDataContext } from "../../hooks";
import { twMerge } from "tailwind-merge";
import { useBedroom } from "../../hooks/useBedroom";

import { getFrenchDate, getTime } from "../../tools/date";
import NoElem from "../../components/NoElem";
import { State } from "../../types";

export default function BookingInfos({ className, setBookId }: {
  className?: string,
  setBookId: State<number | undefined>,
}) {
  const { addPopup, reservations } = useDataContext();
  const { cancel_book } = useBedroom();
  const list = reservations
    .sort((a, b) => a.start.getDate() - b.start.getDate());
  const dateReservations = Object.groupBy(list, rsv => getFrenchDate(rsv.start));
  const reservationList = Object.entries(dateReservations);

  return (
    <div className={twMerge("flex flex-col gap-3 overflow-auto", className)}>
      <TableTr values={["Réservée", "Chambre", "Client", "Arrivée", "Départ", "Action"]}
        className="border-b-1 pb-1 border-gray-400/50" />

      <NoElem text="Aucune réservation" className="text-[12px] uppercase" list={reservationList}>

        { reservationList.map(([date, room_rsvs]) => (
          <div key={date} className="flex flex-col gap-3 text-gray-600">

            <p className="font-bold text-[12px] px-2 py-1 bg-gray-400/20 rounded">{date}</p>

            <div className="flex flex-col">
              { room_rsvs?.map(rsv =>
                <TableTr key={rsv.id} className="hover:bg-blue-400/20 cursor-pointer"
                  onClick={() => setBookId(rsv.id)} values={[
                  <p>{getTime(rsv.date)}</p>,
                  <p className="text-black text-[12px] a" onClick={() => addPopup(['ROOM', rsv.roomId])}>{rsv.roomId}</p>,
                  <p className="uppercase">{rsv.name}</p>,
                  <p>{getFrenchDate(rsv.start).slice(0,6)}</p>,
                  <p>{rsv.end ? getFrenchDate(rsv.end).slice(0,6) : "..."}</p>,
                  rsv.cancel
                  ? <p className="text-gray-500/50">annulée</p>
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
    <div className={twMerge("grid grid-cols-[60px_1fr_2fr_1fr_1fr_auto] gap-3 px-2 py-1 \
        text-center", className)} onClick={onClick}>
      { values.map((value, i) => (
        <div key={i} className="text-center font-bold text-[11px]">{value}</div>
      ))}
    </div>
  );
}

