'use client';

import React from 'react';
import Popup, { PopupBody } from "..";

import { useDataContext } from "../../hooks";
import { useBedroom } from "../../hooks/useBedroom";

import OngletTab from '../../components/OngletTab';
import { Title } from "../../components/SectionBox";
import { ImCross } from "react-icons/im";
import CheckInTab from './check_in';
import InfosTab from './infos';

export default function RoomPopup() {
  const [onglet, setOnglet] = React.useState('client_infos');
  const { roomPopup, setRoomPopup } = useDataContext();
  const { bedRooms } = useBedroom();

  if (!roomPopup) return null;
  const bedRoom = bedRooms[roomPopup];

  return (
    <Popup onClose={() => setRoomPopup(null)}>
      <PopupBody top={(
        <Title right={<ImCross size={13} className="text-red-700 cursor-pointer" onClick={() => setRoomPopup(null)} />} >
            <h1 className="font-bold text-[15px]">Chambre {roomPopup}</h1>
        </Title>
      )} subClassName="font-bold h-100">

        <OngletTab onglet={onglet} setOnglet={setOnglet} datas={[
          { key: 'client_infos', value: "Informations Client" },
          { key: 'room_infos', value: "Informations Chambre" },
        ]} className='h-full'>
          { onglet === 'client_infos' && <CheckInTab room={bedRoom} /> }
          { onglet === 'room_infos' && <InfosTab room={bedRoom} /> }
        </OngletTab>

      </PopupBody>
    </Popup>
  );
}

