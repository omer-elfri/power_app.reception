'use client';

import React from "react";
import Popup, { PopupBody } from "..";
import { useDataContext } from "../../hooks";

import { Title } from "../../components/SectionBox";
import OngletTab from "../../components/OngletTab";
import MyButton from "../../components/MyButton";
import { ImCross } from "react-icons/im";
import BookingForm from "./form";
import BookingInfos from "./infos";

export default function BookingPopup() {
  const { setBookingPopup } = useDataContext();
  const [onglet, setOnglet] = React.useState<'form' | 'infos'>('infos');

  const title = (
    <Title bar className="gap-2"
      right={<MyButton name="close" icon={<ImCross size={10} />}
        className="bg-red-700/10 text-[11px] text-red-700 p-2 rounded"
        onClick={() => setBookingPopup(false)}
      />}>Réservation
    </Title>
  );

  return (
    <Popup onClose={() => setBookingPopup(false)}>
      <PopupBody top={title}
        subClassName="grid grid-cols-[auto_1fr] gap-3">

        <BookingForm />
        <BookingInfos />

        {/* <OngletTab onglet={onglet} setOnglet={setOnglet} datas={[
          { key: 'infos', value: "Réservations" },
          { key: 'form', value: "Nouvelle" },
        ]} className='min-h-80'>
          <BookingInfos className={onglet === 'infos' ? "" : "hidden"} />
          <BookingForm className={onglet === 'form' ? "" : "hidden"} />
        </OngletTab> */}

      </PopupBody>
    </Popup>
  );
}
