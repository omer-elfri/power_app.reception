'use client';

import Popup, { PopupBody } from ".";
import { Title } from "../components/SectionBox";
import { useDataContext } from "../hooks";

export default function BookingPopup() {
  const { setBookingPopup } = useDataContext();

  return (
    <Popup onClose={() => setBookingPopup(false)}>
      <PopupBody>
        <Title bar>Réservation</Title>
      </PopupBody>
    </Popup>
  );
}
