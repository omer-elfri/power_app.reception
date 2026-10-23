'use client';

import React from "react";
import Popup, { CloseBtn, PopupBody } from "..";

import { Title } from "../../components/SectionBox";
import BookingForm from "./form";
import BookingInfos from "./infos";

export default function BookingPopup({ bookId:defaultBookId }: {
  bookId?: number,
}) {
  const [bookId, setBookId] = React.useState(defaultBookId);

  return (
    <Popup>
      <PopupBody top={<Title bar className="gap-2" right={<CloseBtn />}>Réservation</Title>}
        subClassName="grid grid-cols-[230px_1fr] gap-3">

        <BookingForm bookId={bookId} />
        <BookingInfos setBookId={setBookId} />

      </PopupBody>
    </Popup>
  );
}

