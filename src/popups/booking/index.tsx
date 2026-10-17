'use client';

import Popup, { CloseBtn, PopupBody } from "..";
import { useDataContext } from "../../hooks";

import { Title } from "../../components/SectionBox";
import MyButton from "../../components/MyButton";
import { ImCross } from "react-icons/im";
import BookingForm from "./form";
import BookingInfos from "./infos";
import React from "react";

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

