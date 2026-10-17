'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import Popup, { PopupBody } from "..";

import { useDataContext } from "../../hooks";
import { useBedroom } from "../../hooks/useBedroom";
import BedRoom from '../../types/bedroom';

import OngletTab from '../../components/OngletTab';
import { Title } from "../../components/SectionBox";
import NoElem from '../../components/NoElem';

import { getFrenchDateTime, getString } from '../../tools';
import { stages } from '../../types';

import { ImCross } from "react-icons/im";
import { IoBed, IoBedOutline, IoRestaurantOutline } from "react-icons/io5";
import { FaRegClock, FaWifi } from 'react-icons/fa';
import { MdOutlineDescription, MdOutlinePerson2, MdOutlinePriorityHigh, MdWarning } from 'react-icons/md';
import { PiBroomBold } from 'react-icons/pi';
import { IconType } from 'react-icons/lib';
import { RxLightningBolt } from 'react-icons/rx';

export type ListStatus = 'powered' | 'sold' | 'free' | 'clean' | 'issue';

export default function ListPopup({ status }: {
  status?: ListStatus,
}) {
  const [onglet, setOnglet] = React.useState<ListStatus>(status ?? 'powered');
  const { unPopup, customer_book, cleaning_book, addPopup, obsoletRooms } = useDataContext();
  const { analysis, bedRooms, bedRoomTab } = useBedroom();

  const options: {[k in ListStatus] : { value: string, rooms: BedRoom.Type[] }} = {
    'powered': { value: "Alimentées", rooms: analysis.powered, },
    'sold': { value: "Vendues", rooms: analysis.solded, },
    'free': { value: "Disponibles", rooms: analysis.free },
    'clean': { value: "Néttoyage", rooms: bedRoomTab.filter(room => room.cleaner || obsoletRooms.includes(room.id)) },
    'issue': { value: "En pannes", rooms: analysis.issues },
  }
  const datas = options[onglet].rooms;

  const title = (
    <Title icon={<IoBed size={20} />} right={<ImCross size={13}
      className="text-red-700 cursor-pointer"
      onClick={unPopup} />
    }>
      <h1 className="font-bold text-[15px]">Chambres</h1>
    </Title>
  );

  const RoomId = React.useCallback(({ value }: { value: BedRoom.Id }) => {
    return (
      <span className='text-[13px] text-black cursor-pointer hover:underline'
        onClick={() => addPopup(['ROOM', value])}>{value}
      </span>
    );
  }, []);

  const MyTh = React.useCallback(({ Icon, size=13, className, value }: {
    Icon: IconType, size?: number, className?: string, value: string
  }) => {
    return (
      <div className={twMerge('flex flex-row justify-center items-center gap-2', className)}>
        <Icon size={size} /> <span>{value}</span>
      </div>
    );
  }, []);


  return (
    <Popup>
      <PopupBody top={title} className='h-130'>

        <OngletTab onglet={onglet} setOnglet={text => setOnglet(text as ListStatus)}
          datas={ Object.entries(options).map(([key, { value, rooms }]) => ({ key,
            value: <div className='flex flex-row justify-between w-full gap-2'>
              <p>{value}</p><p>{getString(rooms.length) || ''}</p></div>,
          }) ) } subClassName='px-5 py-1 bg-gray-300/40 rounded'>

          <NoElem text="Aucun élément" className='text-[15px]' list={datas}>

            { onglet === 'powered' && (
              <TheTable datas={datas}
                top={[
                  <MyTh Icon={IoBedOutline} value="CH" size={15} />,
                  <MyTh Icon={MdOutlinePerson2} value="Vendu" size={15} />,
                  <MyTh Icon={PiBroomBold} value="En néttoyage" />,
                  <MyTh Icon={FaWifi} value="Connexion" />,
                  <MyTh Icon={RxLightningBolt} value="État" />,
                ]}>
                { room => [
                  <RoomId value={room.id} />,
                  <span className=''>{room.customer?.name ?? ""}</span>,
                  <span className=''>{room.cleaner?.name ?? ""}</span>,
                  <div className='flex flex-row justify-center'>
                    <FaWifi size={15} className={ room.connected ? 'text-red-700' : 'text-gray-600/50'} />
                  </div>,
                  <div className='flex flex-row justify-end items-center gap-2'>
                    <div className='rounded-full p-1 bg-red-700' />
                  </div>,
                ] }
              </TheTable>
            ) }

            { onglet === 'sold' && (
              <TheTable datas={datas}
                top={[
                  <MyTh Icon={FaRegClock} value="Arrivée" />,
                  <MyTh Icon={IoBedOutline} value="CH" size={15} />,
                  <MyTh Icon={MdOutlinePerson2} value="Client" size={15} />,
                  <MyTh Icon={MdOutlineDescription} value="Description" />,
                  <MyTh Icon={IoRestaurantOutline} value="Restaurant" />
                ]}>
                { room => [
                  <span>{getFrenchDateTime(room.customer!.date)}</span>,
                  <RoomId value={room.id} />,
                  <span>{room.customer!.name}</span>,
                  <span>{room.customer!.description}</span>,
                  <span>{room.restauration.reduce((res, resto) => res + resto.price, 0)}</span>,
                ] }
              </TheTable>
            ) }

            { onglet === 'free' && (
              <TheTable datas={datas}
                top={[
                  <MyTh Icon={FaRegClock} value="Depuis" />,
                  <MyTh Icon={IoBedOutline} value="CH" size={15} />,
                  <MyTh Icon={PiBroomBold} value="Néttoyé par" />,
                  <MyTh Icon={MdOutlineDescription} value="Description" />,
                ]}>
                { room => {
                  const customer = customer_book.lasts[room.id];
                  const vallet = cleaning_book.lasts[room.id];
                  return [
                    <span>{ customer ? getFrenchDateTime(customer.end!) : "..."}</span>,
                    <RoomId value={room.id} />,
                    <span>{vallet?.name}</span>,
                    <span>{customer?.description || "..."}</span>,
                  ]} }
              </TheTable>
            ) }

            { onglet === 'clean' && (
              <TheTable datas={datas}
                top={[
                  <MyTh Icon={FaRegClock} value="Date" />,
                  <MyTh Icon={IoBedOutline} value="CH" size={15} />,
                  <MyTh Icon={PiBroomBold} value="Vallet" />,
                  <MyTh Icon={MdOutlineDescription} value="État" />,
                ]}>
                { room => {
                  const clean = cleaning_book.lasts[room.id];
                  // if (!clean) return null;
                  return [
                    <span>{getFrenchDateTime(clean!.date)}</span>,
                    <RoomId value={room.id} />,
                    <div>{ clean
                      ? <span>{clean.name}</span>
                      : <div> <MdWarning size={15} /> <span>Cette CH doit être néttoyée</span> </div>
                    }</div>,
                    <div className='text-[11px] text-gray-600'>{ !obsoletRooms.includes(room.id)
                      ? <span>En néttoyage</span>
                      : <div className='flex flex-row gap-2 '> <MdWarning size={15} className='text-yellow-800' /> <span>Cette CH doit être néttoyée</span> </div> }
                    </div>,
                  ]} }
              </TheTable>
            ) }

            { onglet === 'issue' && (
              <TheTable datas={datas}
                top={[
                  <MyTh Icon={FaRegClock} value="Date" />,
                  <MyTh Icon={IoBedOutline} value="CH" size={15} />,
                  <MyTh Icon={MdOutlineDescription} value="Description" />,
                  <MyTh Icon={MdOutlinePriorityHigh} value="Priorité" />,
                ]}>
                { room => [
                  <span>{getFrenchDateTime(room.issue!.date)}</span>,
                  <RoomId value={room.id} />,
                  <span className=''>{room.issue!.message}</span>,
                  <div className='flex flex-row justify-end'>
                    { room.issue!.priority === 'low' && <div className="flex flex-row gap-2 rounded px-2 py- bg-blue-400/20 border-1 border-blue-800/50"> <div className='p-1 bg-blue-800 self-center rounded-full' /> <span className='text-[11px]'>Faible</span></div> }
                    { room.issue!.priority === 'medium' && <div className="flex flex-row gap-2 rounded px-2 py- bg-yellow-400/20 border-1 border-yellow-800/50"> <div className='p-1 bg-yellow-800 self-center rounded-full' /> <span className='text-[11px]'>Moyen</span></div> }
                    { room.issue!.priority === 'high' && <div className="flex flex-row gap-2 rounded px-2 py- bg-red-400/20 border-1 border-red-800/50"> <div className='p-1 bg-red-800 self-center rounded-full' /> <span className='text-[11px]'>Haut</span></div> }
                    {/* <button className='!hidden group-hover:!block bg-red-400 text-white !px-2 !py-0'
                      onClick={() => room_book.add(room.id, { issue: null })}>D</button> */}
                  </div>,
                ] }
              </TheTable>
            ) }

          </NoElem>

        </OngletTab>

      </PopupBody>
    </Popup>
  );
}

function TheTable({ top, children, datas }: {
  top: React.ReactNode[],
  datas: BedRoom.Type[],
  children: (d: BedRoom.Type) => React.ReactNode[],
}) {
  const { addPopup } = useDataContext();
  const roomStages = Object.groupBy(datas, room => stages[room.stage].name);

  return (
    <table className='[&_td,&_th]:py-1 text-[12px] font-bold text-gray-800'>

      <thead className='font-bold'>
        <tr className='text-[12px]'>{ top.map((elem, i) => <th key={i}>{elem}</th>) }</tr>
        <tr><th colSpan={top.length}> <hr className='text-gray-400' /></th></tr>
      </thead>

      <tbody className='overflow-auto'>{ Object.entries(roomStages).map(([stage, rooms]) =>
        <React.Fragment key={stage}>

          <tr>
            <td colSpan={top.length}>
              <div className='text-left font-bold flex flex-row gap-2 items-center pt-2'>
                <hr className='flex-1 text-gray-400' />
                <span className='uppercase text-green-800'>{stage}</span>
                <hr className='flex-1 text-gray-400' />
                <p className='flex justify-center items-center self-end bg-green-800/10 border-1 border-green-800 \
                  py-[1px] px-2 rounded-full text-[11px] text-green-800 float-right font-bold'>
                  { getString(rooms?.length ?? 0) }
                </p>
              </div>
            </td>
          </tr>

          { rooms?.map((room, i) =>
            <tr key={room.id} className={twMerge('[&_td,&_th]:px-5 [&_td,&_th]:py-2 text-center border-b-1 border-blue-800 group hover:!bg-blue-400 hover:textwhite cursor-pointer', i%2===0 ? "bg-blue-600/8" : "")} onClick={() => addPopup(['CLEAN'])}>
              { children(room).map((elem, i) => <td key={i}>{elem}</td>) }
            </tr>
          ) }

        </React.Fragment> ) }
      </tbody>

    </table>
  );
}

