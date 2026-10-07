'use client';

import React from "react";
import Popup, { PopupBody } from ".";
import { Bar, Title } from "../components/SectionBox";
import { useDataContext } from "../hooks";
import { useBedRoom } from "../hooks/bedroom";
import { ActionBox, CheckInBox } from "./Infos";
import { ImCross } from "react-icons/im";

export default function RoomPopup() {
  const { roomPopup, setRoomPopup } = useDataContext();
  const { bedRooms } = useBedRoom();

  if (!roomPopup) return null;
  const bedRoom = bedRooms[roomPopup];

  const title = (
    <Title bar right={<ImCross size={13} className="text-red-700 cursor-pointer" onClick={() => setRoomPopup(null)} />} >
        <h1 className="font-bold text-[18px]">Chambre {roomPopup}</h1>
    </Title>
  );

  return (
    <Popup onClose={() => setRoomPopup(null)}>
      <PopupBody top={title}
        subClassName="font-bold">
        <CheckInBox room={bedRoom} />
        <Bar />
        <ActionBox room={bedRoom} />
      </PopupBody>
    </Popup>
  );
}
