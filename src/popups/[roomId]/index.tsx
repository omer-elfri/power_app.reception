'use client';

import React from 'react';
import Popup, { CloseBtn, PopupBody } from "..";

import { useBedroom } from "../../hooks/useBedroom";

import RoomStatus from '../../components/RoomStatus';
import OngletTab from '../../components/OngletTab';
import { Title } from "../../components/SectionBox";
import { IoBed } from "react-icons/io5";
import { IoIosPerson } from "react-icons/io";

import Restaurant from './restaurant';
import CheckInForm from './check_in';
import ChangeRoom from './change_room';
import CleaningBox from './cleaning';
import CommentBox from './comment';
import ReservationTab from './reservation';
import BedRoom from '../../types/bedroom';

export default function RoomPopup({ roomId }: {
  roomId: BedRoom.Id,
}) {
  const [onglet, setOnglet] = React.useState('client_infos');
  const { bedRooms } = useBedroom();

  if (!roomId) return null;
  const bedRoom = bedRooms[roomId];

  const title = (
    <Title icon={<IoBed size={20} />} right={<CloseBtn />}>
      <h1 className="font-bold text-[15px]">Chambre {roomId}</h1>
      <RoomStatus room={bedRoom} />
    </Title>
  );

  return (
    <Popup>
      <PopupBody top={title} className='h-160'>

        <OngletTab onglet={onglet} setOnglet={setOnglet} datas={[
          { key: 'client_infos', icon: <IoIosPerson size={16} />, value: "Informations Client" },
          { key: 'room_infos', icon: <IoBed size={18} />, value: "Informations Chambre" },
        ]}>

          { onglet === 'client_infos' && (
            <div className="grid grid-cols-6 grid-rows-[auto_1fr] gap-5 \
              [&_label]:!text-gray-800 \
              [&_input]:!border-gray-400 \
              [&_select]:!border-gray-400 \
              [&_textarea]:!border-gray-400">
              <CheckInForm room={bedRoom} className="row-span-2 col-span-full" />
              <ChangeRoom room={bedRoom} className='col-span-3' />
              <Restaurant room={bedRoom} className='col-span-3' />
            </div>
          ) }

          { onglet === 'room_infos' && (
            <div className='grid grid-cols-5 grid-rows-[1fr_auto] flex-1 bg-green400 gap-3'>
              <CleaningBox room={bedRoom} className='row-span-2 col-span-2' />
              <ReservationTab room={bedRoom} className="col-span-3" />
              <CommentBox room={bedRoom} className='col-span-3' />
            </div>
          ) }

        </OngletTab>
      </PopupBody>
    </Popup>
  );
}
