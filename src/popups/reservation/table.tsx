'use client';

import React from "react";
import { twMerge } from "tailwind-merge";

import { useDataContext } from "../../hooks";
import { useRequest } from "../../hooks/useRequest";
import { getFrenchDate, getTime } from "../../tools/date";

import NoElem from "../../components/NoElem";
import { useVisual } from "../../hooks/useVisual";
import { MdCalendarToday } from "react-icons/md";
import { AsideDiv } from "../../components/AsideDiv";
import { ImCross } from "react-icons/im";
import MyButton from "../../components/MyButton";
import { normalizeSearch } from "../../tools";

export default function BookingInfos({ searchText, className }: {
  searchText: string,
  className?: string,
}) {
  const { addPopup } = useVisual();
  const { cancel_book } = useRequest();
  const { reservation_book } = useDataContext();
  const [bookId, setBookId] = React.useState<number | null>(null);

  const reservationlist = reservation_book.list
    .filter(rsv => {
      const tab = [
        rsv.room_id, rsv.name,
        getFrenchDate(rsv.start_date),
      ].filter(elem => !!elem);
      return tab.some(elem => normalizeSearch(elem!)
        .includes( normalizeSearch(searchText) ) );
    });
  const dateReservations = Object.groupBy(
    reservationlist.sort((rsv1, rsv2) =>
      rsv1.start_date.getTime() - rsv2.start_date.getTime()),
    rsv => getFrenchDate(rsv.start_date));
  const reservationList = Object.entries(dateReservations)
    .sort(([date1], [date2]) => new Date(date1).getTime() - new Date(date2).getTime());

  const gridStyle = "grid grid-cols-[50px_20px_2fr_1fr_1fr] gap-3 px-2 py-1 text-center";

  return (
    <div className={twMerge("flex flex-col gap-3 overflow-auto \
      gap-3 px-2 py-1 font-bold text-[11px]", className)}>

      <AsideDiv className="!py-2" subClassName={twMerge("text-center", gridStyle)}>
        <span>Réservée</span>
        <span>CH</span>
        <span>Client</span>
        <span>Arrivée</span>
        <span>Départ</span>
      </AsideDiv>

      <NoElem Icon={MdCalendarToday} text="Aucune réservation" className="text-[12px] uppercase h-60" list={reservationList}>

        { reservationList.map(([date, room_rsvs]) => (
          <div key={date} className="flex flex-col gap-3 text-gray-600">

            <div className="grid grid-cols-[15px_auto] items-center gap-2">
              <hr className="border-y-1 ml-1" />
              <p className="font-bold text-[12px]">{date}</p>
            </div>

            <div className="flex flex-col gap-2">
              { room_rsvs?.map(rsv =>
                <AsideDiv key={rsv.id} className="py-1">

                  <div className={twMerge("cursor-pointer hover:bg-blue-300/10", gridStyle)}
                    onClick={() => setBookId(bookId => bookId !== rsv.id ? rsv.id : null)}>
                    <p className="text-left">{getTime(rsv.created_date)}</p>
                    <p className="text-black text-[12px] a" onClick={() => addPopup(['ROOM', rsv.room_id])}>{rsv.room_id}</p>
                    <p className="uppercase">{rsv.name}</p>
                    <p>{getFrenchDate(rsv.start_date).slice(0,6)}</p>
                    <p>{rsv.end_date ? getFrenchDate(rsv.end_date).slice(0,6) : "..."}</p>
                  </div>

                  { bookId === rsv.id && <>
                    <div className="bg-gray-200/60 min-h-15 px-5 py-3">
                      { rsv.description || "Aucune description" }
                    </div>
                    <div className="flex flex-row justify-end items-center">
                      <MyButton onClick={() => cancel_book(rsv.id)}
                        icon={<ImCross size={12} className="text-red-700 cursor-pointer" />}
                        className="bg-red-500/10 border-1 border-red-800 !py-1">Annuler
                      </MyButton>
                    </div>
                  </> }

                </AsideDiv>
              ) }
            </div>

          </div>
        ) ) }

      </NoElem>

    </div>
  );
}

