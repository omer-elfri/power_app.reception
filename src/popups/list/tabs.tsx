'use client';

import { useDataContext } from "../../hooks";
import BedRoom from '../../types/bedroom';

import { getFrenchDateTime } from '../../tools';

import { IoBedOutline, IoRestaurantOutline } from "react-icons/io5";
import { FaRegClock, FaWifi } from 'react-icons/fa';
import { MdOutlineDescription, MdOutlinePerson2, MdOutlinePriorityHigh, MdWarning } from 'react-icons/md';
import { PiBroomBold } from 'react-icons/pi';
import { RxLightningBolt } from 'react-icons/rx';
import { MyTh, RoomId, TheTable } from "./table";

export function PowerTab({ datas }: {
  datas: BedRoom.Type[],
}) {
  return (
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
  );
}

export function SoldTab({ datas }: {
  datas: BedRoom.Type[],
}) {
  return (
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
  );
}

export function FreeTab({ datas }: {
  datas: BedRoom.Type[],
}) {
  const { customer_book, cleaning_book } = useDataContext();

  return (
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
  );
}

export function CleanTab({ datas }: {
  datas: BedRoom.Type[],
}) {
  const { cleaning_book, obsoletRooms } = useDataContext();

  return (
    <TheTable datas={datas}
      top={[
        <MyTh Icon={FaRegClock} value="Date" />,
        <MyTh Icon={IoBedOutline} value="CH" size={15} />,
        <MyTh Icon={PiBroomBold} value="Vallet" />,
        <MyTh Icon={MdOutlineDescription} value="État" />,
      ]}>
      { room => {
        const clean = cleaning_book.lasts[room.id]!;
        // if (!clean) return null;
        return [
          <span>{getFrenchDateTime(clean!.date)}</span>,
          <RoomId value={room.id} />,
          <div>{ !obsoletRooms.includes(room.id)
            ? <div>{clean.name}</div>
            : <span>...</span>
          }</div>,
          <div className='text-[11px] text-gray-600 flex flex-row justify-center'>{ !obsoletRooms.includes(room.id)
            ? <span>En néttoyage</span>
            : <div className='flex flex-row items-center gap-2 text-center'>
              <MdWarning size={18} className='text-yellow-800' />
              <span>Cette chambre<br />doit être néttoyée</span>
            </div> }
          </div>,
        ]} }
    </TheTable>
  );
}

export function IssueTab({ datas }: {
  datas: BedRoom.Type[],
}) {
  return (
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
        </div>,
      ] }
    </TheTable>
  );
}
