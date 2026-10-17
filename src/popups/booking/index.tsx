'use client';

import Popup, { PopupBody } from "..";
import { useDataContext } from "../../hooks";

import { Title } from "../../components/SectionBox";
import MyButton from "../../components/MyButton";
import { ImCross } from "react-icons/im";
import BookingForm from "./form";
import BookingInfos from "./infos";

export default function BookingPopup({ bookId }: {
  bookId?: number,
}) {
  const { setPopup } = useDataContext();

  const title = (
    <Title bar className="gap-2"
      right={<MyButton name="close" icon={<ImCross size={10} />}
        className="bg-red-700/10 text-[11px] text-red-700 p-2 rounded"
        onClick={() => setPopup(null)}
      />}>Réservation
    </Title>
  );

  return (
    <Popup onClose={() => setPopup(null)}>
      <PopupBody top={title}
        subClassName="grid grid-cols-[230px_1fr] gap-3">

        <BookingForm bookId={bookId} />
        <BookingInfos />

      </PopupBody>
    </Popup>
  );
}

