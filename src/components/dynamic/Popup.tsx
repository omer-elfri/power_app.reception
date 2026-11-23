'use client'

import { useVisual } from "../../hooks/useVisual";

import Popup from "../../popups";
import RoomPopup from "../../popups/[roomId]";
import ValletPopup from "../../popups/vallet";
import SessionPopup from "../../popups/user_session";
import ChangePassPopup from "../../popups/user_session/change_pass";
import ReservationTab from "../../popups/reservation";
import CleanTab from "../../popups/clean";
import BedRoomTab from "../../popups/bedroom";
import RestaurantTab from "../../popups/restaurant";

export default function CurrentPopup() {
  const { popupList } = useVisual();
  const popup = popupList.at(0);

  if (!popup) return;

  return <Popup>{
    popup[0] === 'BEDROOM' ? <BedRoomTab status={popup[1]} /> :
    popup[0] === 'CLEANING' ? <CleanTab /> :
    popup[0] === 'RESERVATION' ? <ReservationTab /> :
    popup[0] === 'RESTAURANT' ? <RestaurantTab /> :
    
    popup[0] === 'ROOM' ? <RoomPopup roomId={popup[1]} /> :
    popup[0] === 'VALLET' ? <ValletPopup roomId={popup[1]} /> :
    popup[0] === 'CHANGE_PASS' ? <ChangePassPopup /> :
    popup[0] === 'USER' ? <SessionPopup /> : null }
  </Popup>
}
