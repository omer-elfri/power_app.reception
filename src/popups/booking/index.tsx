'use client';

import React from "react";
import { CloseBtn, PopupBody } from "..";

import { Title } from "../../components/SectionBox";
import BookingForm from "./form";
import BookingInfos from "./infos";
import { DateRange } from "@daypicker/react";
import { useDataContext } from "../../hooks";
import { useRequest } from "../../hooks/useRequest";

export default function BookingPopup({ bookId:defaultBookId, className }: {
  bookId?: number,
  className?: string,
}) {
  const { addAlert } = useDataContext();
  const { book } = useRequest();
  const [bookId, setBookId] = React.useState(defaultBookId);
  const [selectedDate, setSelectedDate] = React.useState<DateRange>({ from: new Date() });
  const [disabled, setDisabled] = React.useState(false);


  const subMitHandler = React.useCallback((e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.elements;
    const selectedRoomId = (form.namedItem('roomId') as HTMLSelectElement).value;
    const clientName = e.target.clientName.value;
    const description = e.target.description.value;

    if (!selectedDate.from) {
      addAlert(['error', "Vous devez sélectionner une date d'arrivée"]);
      return;
    }
    if (selectedDate.to && selectedDate.from > selectedDate.to) {
      const tmp = selectedDate.from;
      selectedDate.from = selectedDate.to;
      selectedDate.to = tmp;
    }

    const start_date = selectedDate.from;
    const end_date = selectedDate.to ?? new Date(start_date.getTime() + 24*60*60*1000);

    if (!selectedRoomId) {
      addAlert(['error', "Vous devez préciser la chambre"]);
      throw Error("Vous devez préciser la chambre");
    }
    if (clientName === "") {
      addAlert(['error', "Vous devez préciser le nom du client"]);
      throw Error("Vous devez préciser le nom du client");
    }
    book(selectedRoomId, { name: clientName, start_date, end_date }, description);
  }, [book, selectedDate]);


  return (
    <PopupBody onSubmit={subMitHandler}
      top={<Title bar className="gap-2" right={<CloseBtn />}>Réservation</Title>}
      className={className} subClassName="grid grid-cols-[230px_1fr] gap-3"
      bottom={
        <button type="submit" name="register" disabled={disabled}
          className="bg-gray-800 text-white text-[11px] self-end">Réserver
        </button>
      }>

      <BookingForm
        bookId={bookId}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        setDisabled={setDisabled}
      />
      <BookingInfos setBookId={setBookId} />

    </PopupBody>
  );
}

