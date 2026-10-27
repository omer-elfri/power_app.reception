'use client';

import React from "react";
import { CloseBtn, PopupBody } from "..";

import { useDataContext } from '../../hooks';
import { useBedroom } from "../../hooks/useBedroom";
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
import CheckInForm, { CheckInComment } from "./check_in";
import MyButton from "../../components/MyButton";
import { FaCheck, FaExchangeAlt } from "react-icons/fa";
import FormAside from "../../components/FormAside";

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
  const { isObsolet, cleaning_book, addAlert, switchPopup, addPopup, cleanings } = useDataContext();
  const { bedRooms, check_in, check_update, bedRoomTab, check_out } = useBedroom();
  const bedRoom = bedRooms[bedRoomId];
  const onglets = React.useMemo(() => bedRoom.customer ? ongletList : ongletList.slice(1,3), [bedRoom]);
  const [onglet, setOnglet] = React.useState(onglets[0].key);

  React.useEffect(() => {
    setOnglet(onglets[0].key);
  }, [onglets]);

  const title = (
    <Title bar icon={<IoBed size={16} />} right={<CloseBtn />} className='text-gray-500'>
      <span>CH</span>
      <select className="!border-0 text-black text-[15px]" value={bedRoom.id} onChange={e => switchPopup(['ROOM', e.target.value as BedRoom.Id])}>
        { bedRoomTab.map(room => <option key={room.id}>{room.name}</option>) }
      </select>
      <RoomStatus room={bedRoom} />
    </Title>
  );



    //     bottom={<SubmitButtons className="self-end" room={bedRoom} />} onSubmit={e => {
    //   e.preventDefault();
    //   const sexe = e.target.sexe.value as Sex;
    //   const name = e.target.fullname.value as string;
    //   const description = e.target.description.value as string;
    //   const price = e.target.price.value as number;
    //   const tel = e.target.tel.value as number;
    //   const town = e.target.town.value as string;

    //   if (e.target.check_in) {
    //       if (name === "") {
    //           addAlert(['error', "Vous devez renseigner le nom du client"]);
    //           throw Error("Vous devez renseigner le nom du client");
    //       }
    //       check_in(bedRoom.id, { sexe, name, tel, town, price }, description);
    //   }
    //   if (e.target.check_update) {
    //       if (!bedRoom.customer) throw Error(`La chambre ${bedRoom.id} n'est pas occupée`);
    //       check_update(bedRoom.customer.id, { sexe, name, tel, town }, description);
    //   }
    // }}

    React.useEffect(() => {
      console.log("cleanings", cleanings)
      console.log("cleaning_book", cleaning_book.get.filter(c => !c.done))
    }, [cleanings, cleaning_book])
  
  const LeftSide = React.useCallback(({ children }: {
    children?: React.ReactNode,
  }) => {
    const lastClean = cleaning_book.getRoomId(bedRoom.id);
    console.log('lastClean', lastClean)
    return (
      <div className="grid grid-cols-[3fr_4fr] gap-3 flex-1">
        
        <div className="flex flex-col gap-3">
          { ( bedRoom.issue || isObsolet(bedRoomId) ) &&
            <IssueSide roomId={bedRoom.id} /> }
          <CleaningBox roomId={bedRoom.id} clean={lastClean} />
          <ReservationTab room={bedRoom} className="flex-1" />
        </div>

        <div className="flex flex-col gap-3">
          { children }
        </div>

      </div>
    );
  }, [bedRoom, isObsolet, cleaning_book]);

  return (
    <PopupBody top={title} className='min-h-160'>

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
                  <CheckInForm room={bedRoom} />
                  <CheckInComment room={bedRoom} className="flex-1" />

                  <div className="flex flex-row justify-end items-center gap-3">
                    <MyButton name='check_out' icon={<FaExchangeAlt />}
                        onClick={() => {
                            if (!bedRoom.customer) throw Error(`La chambre ${bedRoom.id} n'est pas occupée`);
                            check_out(bedRoom.customer.id);
                            if (!bedRoom.cleaner) addPopup(['VALLET', bedRoom.id]);
                        }}
                        className="bg-transparent border-1 text-red-700 border-red-700 !py-1 !px-1">Check out
                    </MyButton>
                    <MyButton name="check_in" iconRight={<FaCheck className="" />}
                        className="bg-blue-500 !py-1 text-white uppercase self-end">Check in
                    </MyButton>
                  </div>
              </LeftSide>
          ) }

          { onglet === 'room' && (
              <LeftSide>
                <CommentBox room={bedRoom} className='col-span-full' />
                <FormAside bar={false} className='flex-1' />
              </LeftSide>
          ) }

        </OngletTab>


      </PopupBody>
  );
}

