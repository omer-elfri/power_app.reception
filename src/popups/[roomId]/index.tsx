'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import Popup, { CloseBtn, PopupBody } from "..";

import { useBedroom } from "../../hooks/useBedroom";
import BedRoom from '../../types/bedroom';

import RoomStatus from '../../components/RoomStatus';
import OngletTab from '../../components/OngletTab';
import { Title } from "../../components/SectionBox";

import Restaurant from './restaurant';
import CheckInForm from './check_in';
import ChangeRoom from './change_room';
import CleaningBox from './cleaning';
import CommentBox from './comment';
import ReservationTab from './reservation';

import { MdWarning } from 'react-icons/md';
import { IoBed } from "react-icons/io5";
import { IoIosPerson } from "react-icons/io";
import FormAside from '../../components/FormAside';
import { useDataContext } from '../../hooks';

export default function RoomPopup({ roomId:bedRoomId }: {
  roomId: BedRoom.Id,
}) {
  const { isObsolet } = useDataContext();
  const { bedRooms } = useBedroom();
  const bedRoom = bedRooms[bedRoomId];
  const [onglet, setOnglet] = React.useState('client_infos');

  const title = (
    <Title icon={<IoBed size={20} />} right={<CloseBtn />} className='text-gray-500'>
      <h1 className="font-bold text-[15px]">
        <span>CH</span> <span className='text-black text-[20px]'>{bedRoomId}</span></h1>
      <RoomStatus room={bedRoom} />
    </Title>
  );

  return (
    <Popup>
      <PopupBody top={title} className='h-160'>

        <OngletTab onglet={onglet} setOnglet={setOnglet} datas={[
          { key: 'client_infos', icon: <IoIosPerson size={16} />, value: "Informations Client" },
          { key: 'room_infos', icon: <IoBed size={18} />, value: "Informations Chambre" },
        ]} subClassName='[&_input,&_textarea]:shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] gap-5'>

          { ( bedRoom.issue || isObsolet(bedRoomId) ) && <IssueSide roomId={bedRoomId} /> }

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

function IssueSide({ roomId:bedRoomId }: {
  roomId: BedRoom.Id,
}) {
  const { isObsolet, addPopup } = useDataContext();
  const { bedRooms } = useBedroom();
  const bedRoom = bedRooms[bedRoomId];

  return (
    <FormAside title="A votre attention" subClassName='flex flex-row flex-wrap gap-2'
      right={<button onClick={() => addPopup(['VALLET', bedRoomId])} className='bg-blue-500 text-white !py-1'>Néttoyer</button>}>

      { bedRoom.issue &&  <p className={twMerge("rounded px-2 py-1 text-[11px]",
          bedRoom.issue.priority === "high" ? "bg-red-600/20 text-red-700" : "bg-yellow-600/20 text-yellow-700")}>
          {bedRoom.issue?.message}
      </p> }

      { isObsolet(bedRoomId) && <div className='grid grid-cols-[auto_1fr] items-center gap-2 py-1 px-2 rounded bg-yellow-600/20 font-bold'>
        <MdWarning size={18} className="text-yellow-600" title="A besoin de néttoyage" />
        <p className='text-gray-800 text-[11px]'>Cette chambre à besoin d'être néttoyer</p>
      </div> }

    </FormAside>
  );
}
