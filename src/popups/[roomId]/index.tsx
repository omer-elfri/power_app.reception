'use client';

import React from "react";
import { CloseBtn, PopupBody } from "..";

import { useDataContext } from '../../hooks';
import { useRequest } from "../../hooks/useRequest";
import BedRoom from '../../types/bedroom';

import { Title } from "../../components/SectionBox";

import IssueSide from './issues';
import Restaurant from './restaurant';
import CheckInInfos from './customer';
import ChangeRoom from './change_room';
import CleaningBox from './cleaning';
import CommentBox from './comment';
import ReservationTab from './reservation';

import { IoBed } from "react-icons/io5";
import RoomStatus from "../../components/RoomStatus";
import OngletTab, { OngletType } from "../../components/OngletTab";
import { MdWarning } from "react-icons/md";
import CheckInForm, { CheckInComment, SubmitButtons } from "./check_in";
import MyButton from "../../components/MyButton";
import { FaCheck } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

const ongletList: OngletType[] = [
  {
    key: 'customer',
    value: 'Informations Client',
  },
  {
    key: 'register',
    value: 'Enrégistrement',
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
  const { isObsolet, cleaning_book, switchPopup } = useDataContext();
  const { bedRooms, bedRoomTab, check_in } = useRequest();
  const bedRoom = bedRooms[bedRoomId];
  const onglets = React.useMemo(() => bedRoom.customer ? ongletList : ongletList.slice(1,3), [bedRoom]);
  const [onglet, setOnglet] = React.useState(onglets[0].key);

  React.useEffect(() => {
    setOnglet(onglets[0].key);
  }, [onglets]);

  const title = (
    <Title bar icon={<IoBed size={16} />} right={<CloseBtn />} className='text-gray-500'>
      <span>CH</span>
      <select className="!border-0 text-black text-[15px]" value={bedRoom.id} onChange={e => switchPopup(['ROOM', e.target.value])}>
        { bedRoomTab.map(room => <option key={room.id}>{room.name}</option>) }
      </select>
      <RoomStatus room={bedRoom} />
    </Title>
  );

  const LeftSide = React.useCallback(({ children }: {
    children?: React.ReactNode,
  }) => {
    return (
      <div className="grid grid-cols-[3fr_4fr] gap-3 flex-1">
        
        <div className="flex flex-col gap-3">
          { ( bedRoom.issue || isObsolet(bedRoomId) ) &&
            <IssueSide roomId={bedRoom.id} /> }
          <CleaningBox roomId={bedRoom.id} />
          <ReservationTab room={bedRoom} className="flex-1" />
        </div>

        <div className="flex flex-col gap-3">
          { children }
        </div>

      </div>
    );
  }, [bedRoom, isObsolet, cleaning_book]);

  return (
    <PopupBody top={title} className={twMerge('derh-160', className)} bottom={
      onglet === 'register' && (
        <div className="flex flex-row justify-end items-center gap-3">
          <SubmitButtons room={bedRoom} />
        </div>
      )
    }>

        <OngletTab onglet={onglet} setOnglet={setOnglet} datas={onglets}>

          { onglet === 'customer' && (
              <LeftSide>

                { bedRoom.customer ? <>
                  <CheckInInfos room={bedRoom} className="flex-1" />
                  <ChangeRoom room={bedRoom} />
                  <Restaurant room={bedRoom} className="flex-1" />
                </> : <>
                  <CheckInForm room={bedRoom} />
                  <CheckInComment room={bedRoom} className="flex-1" />
                  <MyButton name="check_in" iconRight={<FaCheck />}
                      className="bg-blue-500 !py-1 text-white uppercase self-end">Check in
                  </MyButton>
                </> }

              </LeftSide>
          ) }

          { onglet === 'register' && (
              <LeftSide>
                <form className="flex flex-col gap-y-3" onSubmit={e => {
                  e.preventDefault();
                  const sexe = e.target.sexe.value;
                  const fullname = e.target.fullname.value;
                  const tel = e.target.tel.value;
                  const town = e.target.town.value;
                  const reason = e.target.reason.value;
                  const price = e.target.price.value;
                  
                  check_in(bedRoomId, { sexe, name: fullname, tel, town, reason, price });
                }}>
                  <CheckInForm room={bedRoom} />
                  <CheckInComment room={bedRoom} className="flex-1" />

                </form>
              </LeftSide>
          ) }

          { onglet === 'room' && (
              <LeftSide>
                <CommentBox room={bedRoom} className='col-span-full row-span-2 h-full' />
              </LeftSide>
          ) }

        </OngletTab>


      </PopupBody>
  );
}

