'use client';

import React from "react";
import { twMerge } from "tailwind-merge";
import { CloseBtn, PopupBody } from "..";

import { useVisual } from "../../hooks/useVisual";
import { useAnalysis } from "../../hooks/useAnalysis";
import BedRoom from '../../types/bedroom';

import Warning from './actions/warning';
import PowerOn from "./actions/power_on";
import CommentBox from './actions/issue';

import CustomerForm from "./customer";
import CheckInfos from './customer/check_infos';
import ChangeRoom from './customer/check_move';
import CheckForm from "./customer/check_form";
import CheckInComment from "./customer/check_comment";

import CleaningBox from './cleaning';
import ReservationTab from './reservation';
import RestaurantTab from './restaurant';

import { Title } from "../../components/SectionBox";
import { CleaningState, CustomerState } from "../../components/RoomStatus";
import Caster from "../../components/Caster";
import { BiBed } from "react-icons/bi";

export default function RoomPopup({ roomId:bedRoomId, className }: {
  roomId: BedRoom.Id,
  className?: string,
}) {
  const { switchPopup } = useVisual();
  const { bedRooms, bedRoomTab, } = useAnalysis();
  const bedRoom = bedRooms[bedRoomId];

  const MyTitle = React.useCallback(() => (
    <Title bar icon={<BiBed size={19} />} right={<CloseBtn />} className='text-gray-500'>
      <span className="text-[15px]">CH</span>
      <select className="!border-0 text-black text-[15px]"
        value={bedRoom.id} onChange={e => switchPopup(['ROOM', e.target.value])}>
        { bedRoomTab.map(room => <option key={room.id}>{room.name}</option>) }
      </select>
      <CleaningState room={bedRoom} />
      <CustomerState room={bedRoom} />
      <Caster value={["BEDROOM"]} />
    </Title>
  ), [bedRoom, bedRoomTab, switchPopup]);

  if (!bedRoom) return (
    <p className="font-bold text-white text-[24px]">Cette chambre n'est plus accessible</p>
  );

  return (
    <PopupBody top={<MyTitle />} className={twMerge('h-160', className)}>
      <LeftSide room={bedRoom}>
        <PowerOn room={bedRoom} />
        { bedRoom.customer ? <>
          <CheckInfos room={bedRoom} />
          <ChangeRoom room={bedRoom} />
          <RestaurantTab room={bedRoom} className="flex-1 min-h-50" />
        </> : <>
          <CustomerForm roomId={bedRoom.id}>
            <CheckForm room={bedRoom} />
            <CheckInComment room={bedRoom} className="flex-1" />
          </CustomerForm>
        </> }
      </LeftSide>
    </PopupBody>
  );
}

function LeftSide({ room:bedRoom, className, subClassName, children }: {
  room: BedRoom.Type,
  className?: string,
  subClassName?: string,
  children?: React.ReactNode,
}) {
  const { isObsolet, } = useAnalysis();

  return (
    <div className={twMerge("grid grid-cols-[3fr_4fr] gap-3 flex-1", className)}>

      <div className="flex flex-col gap-3">
        { ( bedRoom.issue || isObsolet(bedRoom.id) ) &&
          <Warning roomId={bedRoom.id} /> }
        <CleaningBox roomId={bedRoom.id} />
        <ReservationTab room={bedRoom} />
        <CommentBox room={bedRoom} className="flex-1" />
      </div>

      <div className={twMerge("flex flex-col gap-3", subClassName)}>
        { children }
      </div>

    </div>
  );
}

