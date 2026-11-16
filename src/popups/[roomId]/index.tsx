'use client';

import React from "react";
import { twMerge } from "tailwind-merge";
import { CloseBtn, PopupBody } from "..";

import { useRequest } from "../../hooks/useRequest";
import BedRoom from '../../types/bedroom';

import { Title } from "../../components/SectionBox";

import Warning from './warning';
import CleaningBox from './cleaning';
import ReservationTab from './reservation';

import CheckInfos from './check_infos';
import ChangeRoom from './check_move';
import CheckForm, { CheckInComment } from "./check_form";

import Restaurant from './restaurant';
import CommentBox from './issue';

import { AsideDiv } from "../../components/FormAside";
import RoomStatus from "../../components/RoomStatus";
import OngletDiv, { OngletType } from "../../components/OngletTab";
import MyButton from "../../components/MyButton";
import { FaCheck } from "react-icons/fa";
import { MdWarning } from "react-icons/md";
import { IoBed } from "react-icons/io5";
import { useVisual } from "../../hooks/useVisual";

const onglets: [OngletType, ...OngletType[]] = [
  {
    key: 'customer',
    value: 'Informations Client',
  },
  {
    key: 'room',
    value: 'Informations chambre',
    icon: <MdWarning className="text-yellow-400" />
  },
] as const;

export default function RoomPopup({ roomId:bedRoomId, className }: {
  roomId: BedRoom.Id,
  className?: string,
}) {
  const { switchPopup } = useVisual();
  const { bedRooms, bedRoomTab, isObsolet, check_in } = useRequest();
  const bedRoom = bedRooms[bedRoomId];

  const MyTitle = React.useCallback(() => (
    <Title bar icon={<IoBed size={16} />} right={<CloseBtn />} className='text-gray-500'>
      <span>CH</span>
      <select className="!border-0 text-black text-[15px]" value={bedRoom.id} onChange={e => switchPopup(['ROOM', e.target.value])}>
        { bedRoomTab.map(room => <option key={room.id}>{room.name}</option>) }
      </select>
      <RoomStatus room={bedRoom} />
    </Title>
  ), [bedRoom, bedRoomTab, switchPopup]);

  const LeftSide = React.useCallback(({ className, subClassName, children }: {
    className?: string,
    subClassName?: string,
    children?: React.ReactNode,
  }) => {
    return (
      <div className={twMerge("grid grid-cols-[3fr_4fr] gap-3 flex-1", className)}>
        
        <div className="flex flex-col gap-3">
          { ( bedRoom.issue || isObsolet(bedRoomId) ) &&
            <Warning roomId={bedRoom.id} /> }
          <CleaningBox roomId={bedRoom.id} />
          <ReservationTab room={bedRoom} className="flex-1" />
        </div>

        <div className={twMerge("flex flex-col gap-3", subClassName)}>
          { children }
        </div>

      </div>
    );
  }, [bedRoom, isObsolet]);

  // const SubmitButton = React.useCallback(() => {
  //   return (
  //     <div className="flex flex-row gap-3 justify-end">
  //       { !bedRoom.customer ?

  //         <MyButton name="check_in" iconRight={<FaCheck />}
  //             className="bg-blue-500 !py-1 text-white">Check in
  //         </MyButton> :

  //       }
  //     </div>
  //   )
  // }, [bedRoom.customer]);

  if (!bedRoom) return <p className="font-bold text-white text-[24px]">Cette chambre n'est plus accessible</p>;

  return (
    <PopupBody top={<MyTitle />}
      className={twMerge('h-160', className)}
      // bottom={onglet === 'customer' && <SubmitButton />}
      // onSubmit={onglet === 'customer' ? handleSubmit : undefined}
    >
      <OngletDiv datas={onglets}>{ onglet => (

        onglet.key === 'customer' ?
          <LeftSide> { bedRoom.customer
            ? <>
              <CheckInfos room={bedRoom} />
              <ChangeRoom room={bedRoom} />
              <Restaurant room={bedRoom} className="flex-1 min-h-50" />
            </> : <>
            <form onSubmit={e => {
              const sexe = e.target.sexe.value;
              const fullname = e.target.fullname.value;
              const tel = e.target.tel.value;
              const town = e.target.town.value;
              const reason = e.target.reason.value;
              const price = e.target.price.value;
              check_in(bedRoomId, { sexe, name: fullname, tel, town, reason, price });
            }}>
              <CheckForm room={bedRoom} />
              <CheckInComment room={bedRoom} className="flex-1" />
              <AsideDiv subClassName="flex flex-row justify-end">
                <MyButton name="check_in" iconRight={<FaCheck />}
                  className="bg-blue-500 !py-1 text-white">Check in
                </MyButton>
              </AsideDiv>
            </form>
            </> }
          </LeftSide>
          
        : onglet.key === 'room' ?
          <LeftSide>
            <CommentBox room={bedRoom} />
            <AsideDiv className="bg-white/60 flex-1" />
          </LeftSide>
        
        : null ) }
      </OngletDiv>
    </PopupBody>
  );
}

