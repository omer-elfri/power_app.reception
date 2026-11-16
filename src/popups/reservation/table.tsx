'use client';

import React from "react";
import { twMerge } from "tailwind-merge";

import { useDataContext } from "../../hooks";
import { useRequest } from "../../hooks/useRequest";
import { getFrenchDate, getTime } from "../../tools/date";

import NoElem from "../../components/NoElem";
import { useVisual } from "../../hooks/useVisual";
import { MdCalendarToday } from "react-icons/md";
import { AsideDiv } from "../../components/FormAside";
import { ImCross } from "react-icons/im";

export default function BookingInfos({ className }: {
  className?: string,
}) {
  const { addPopup } = useVisual();
  const [bookId, setBookId] = React.useState<number | null>(null);
  const { reservation_book } = useDataContext();
  const { cancel_book } = useRequest();
  const dateReservations = Object.groupBy(
    reservation_book.list.sort((rsv1, rsv2) =>
      rsv1.start_date.getTime() - rsv2.start_date.getTime()),
    rsv => getFrenchDate(rsv.start_date));
  const reservationList = Object.entries(dateReservations).sort(([date1], [date2]) => new Date(date1).getTime() - new Date(date2).getTime());
  const gridStyle = "grid grid-cols-[50px_20px_2fr_1fr_1fr_32px] gap-3 px-2 py-1 text-center";

  const bookInfos = bookId ? reservation_book.getId(bookId) : null;

  return (
    <AsideDiv>

      { bookId ? (
        <div className="flex flex-col gap-2">

          <button onClick={() => setBookId(null)}>retour</button>

          { bookInfos ? (
            <div>
              <div>{bookInfos.name}</div>
              <div>{bookInfos.room_id}</div>
              <div>{bookInfos.description}</div>
              <div>{getFrenchDate(bookInfos.start_date)}</div>
              <div>{getFrenchDate(bookInfos.end_date)}</div>
            </div>
          ) : <p>Réservation non trouvée</p> }

        </div>

      ) : (

        <div className={twMerge("flex flex-col gap-3 overflow-auto \
          gap-3 px-2 py-1 text-center font-bold text-[11px]", className)}>

          <div className={twMerge("border-b-1 pb-2 border-gray-400/50", gridStyle)}>
            <span>Réservée</span>
            <span>CH</span>
            <span>Client</span>
            <span>Arrivée</span>
            <span>Départ</span>
            <span>Action</span>
            </div>

          <NoElem Icon={MdCalendarToday} text="Aucune réservation" className="text-[12px] uppercase min-h-60" list={reservationList}>

            { reservationList.map(([date, room_rsvs]) => (
              <div key={date} className="flex flex-col gap-1 text-gray-600">

                <p className="font-bold text-[12px] px-2 py-1 bg-gray-400/20 rounded">{date}</p>

                <div className="flex flex-col">
                  { room_rsvs?.map(rsv =>
                    <TableTr key={rsv.id} className={twMerge("hover:bg-blue-400/20 cursor-pointer", gridStyle)}
                      onClick={() => setBookId(rsv.id)} values={[
                      <p>{getTime(rsv.created_date)}</p>,
                      <p className="text-black text-[12px] a" onClick={() => addPopup(['ROOM', rsv.room_id])}>{rsv.room_id}</p>,
                      <p className="uppercase">{rsv.name}</p>,
                      <p>{getFrenchDate(rsv.start_date).slice(0,6)}</p>,
                      <p>{rsv.end_date ? getFrenchDate(rsv.end_date).slice(0,6) : "..."}</p>,
                      rsv.cancel_date
                      ? <p className="text-gray-500/50">annulée</p>
                      : <p className="text-red-700 hover:underline cursor-pointer"
                          onClick={() => cancel_book(rsv.id)}>
                          <ImCross size={12} className="inline" />
                        </p>,
                    ]} />
                  ) }
                </div>

              </div>
            ) ) }

          </NoElem>

        </div>

      ) }

    </AsideDiv>
  );
}

function TableTr({ values, className, onClick }: {
  values: React.ReactNode[],
  className?: string,
  onClick?: () => void,
}) {
  return (
    <div className={twMerge("gap-3 px-2 py-1 text-center font-bold text-[11px]", className)} onClick={onClick}>
      { values.map((value, i) => (
        <div key={i} className="text-center">{value}</div>
      ))}
    </div>
  );
}
