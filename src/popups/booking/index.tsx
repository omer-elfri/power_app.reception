'use client';

import React from "react";
import { CloseBtn, PopupBody } from "..";

import { Title } from "../../components/SectionBox";
import BookingForm from "./form";
import BookingInfos from "./infos";

export default function BookingPopup({ bookId:defaultBookId, className }: {
  bookId?: number,
  className?: string,
}) {
  const [bookId, setBookId] = React.useState(defaultBookId);

  return (
    <PopupBody top={<Title bar className="gap-2" right={<CloseBtn />}>Réservation</Title>}
      className={className} subClassName="grid grid-cols-[230px_1fr] gap-3">

      <BookingForm bookId={bookId} />
      <BookingInfos setBookId={setBookId} />

    </PopupBody>
  );
}

