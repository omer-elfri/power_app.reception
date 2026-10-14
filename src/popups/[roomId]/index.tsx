'use client';

import React from 'react';
import Popup, { PopupBody } from "..";

import { useDataContext } from "../../hooks";
import { useBedroom } from "../../hooks/useBedroom";
import BedRoom from '../../types/bedroom';

import OngletTab from '../../components/OngletTab';
import { Title } from "../../components/SectionBox";
import { ImCross } from "react-icons/im";
import { IoBed } from "react-icons/io5";
import { IoIosPerson } from "react-icons/io";

import Restaurant from './restaurant';
import CheckInForm from './check_in';
import ChangeRoom from './change_room';
import CleaningBox from './cleaning';
import CommentBox from './comment';
import RoomStatus from '../../components/RoomStatus';
import { twMerge } from 'tailwind-merge';
import NotificationBox from './notification';

export default function RoomPopup() {
  const [onglet, setOnglet] = React.useState('client_infos');
  const { roomPopup, setRoomPopup } = useDataContext();
  const { bedRooms } = useBedroom();

  if (!roomPopup) return null;
  const bedRoom = bedRooms[roomPopup];

  return (
    <Popup onClose={() => setRoomPopup(null)}>
      <PopupBody subClassName="font-bold h-130" top={(
        <Title icon={<IoBed size={20} />}
          right={<ImCross size={13}
            className="text-red-700 cursor-pointer"
            onClick={() => setRoomPopup(null)} />
          } >
          <h1 className="font-bold text-[15px]">Chambre {roomPopup}</h1>
          <RoomStatus room={bedRoom} />
        </Title>
      )}>

        <OngletTab onglet={onglet} setOnglet={setOnglet} datas={[
          { key: 'client_infos', icon: <IoIosPerson size={16  } />, value: "Informations Client" },
          { key: 'room_infos', icon: <IoBed size={18} />, value: "Informations Chambre" },
        ]} className='h-full'>
          { onglet === 'client_infos' && <ClientTab room={bedRoom} /> }
          { onglet === 'room_infos' && <RoomTab room={bedRoom} /> }
        </OngletTab>

      </PopupBody>
    </Popup>
  );
}

function ClientTab({ room:bedRoom }: {
    room: BedRoom.Type,
}) {
    return (
        <div className="flex flex-col gap-y-2">
            <div className={twMerge("[&_label]:!text-gray-800 [&_input]:!border-gray-400 [&_select]:!border-gray-400 [&_textarea]:!border-gray-400",
                "grid grid-cols-6 grid-rows-[auto_1fr] gap-5")}>
                <CheckInForm room={bedRoom} className="row-span-2 col-span-full" />
                <ChangeRoom room={bedRoom} className='col-span-3' />
                <Restaurant room={bedRoom} className='col-span-3' />
            </div>
        </div>
    );
}

function RoomTab({ room:bedRoom }: {
  room: BedRoom.Type,
}) {
  return (
    <div className='grid grid-cols-5 grid-rows-[auto_1fr] gap-3'>
      <CleaningBox room={bedRoom} className='col-span-2' />
      <NotificationBox room={bedRoom} className='row-span-2 col-span-3' />
      <CommentBox room={bedRoom} className='col-span-2' />
    </div>
  );
}
