'use client';

import Popup, { PopupBody } from "..";
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
  const { unPopup } = useDataContext();
  const [bookId, setBookId] = React.useState(defaultBookId);

  const title = (
    <Title bar className="gap-2"
      right={<MyButton name="close" icon={<ImCross size={10} />}
        className="bg-red-700/10 text-[11px] text-red-700 p-2 rounded"
        onClick={unPopup}
      />}>Réservation
    </Title>
  );

  return (
    <Popup>
      <PopupBody top={title}
        subClassName="grid grid-cols-[230px_1fr] gap-3">

        <BookingForm bookId={bookId} />
        <BookingInfos setBookId={setBookId} />

      </PopupBody>
    </Popup>
  );
}

