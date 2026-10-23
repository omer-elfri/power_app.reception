'use client';

import { useDataContext } from "../../hooks";
import BedRoom from '../../types/bedroom';
import { twMerge } from "tailwind-merge";
import { PriorityId } from "../../types";

import { getFrenchDateTime } from '../../tools/date';
import { PersonSex2} from '../../components/PersonSex';

import { IoBedOutline, IoRestaurantOutline } from "react-icons/io5";
import { FaCheck, FaRegClock, FaWifi } from 'react-icons/fa';
import { MdOutlineDescription, MdOutlinePerson2, MdOutlinePriorityHigh, MdWarning } from 'react-icons/md';
import { PiBroomBold } from 'react-icons/pi';
import { RxLightningBolt } from 'react-icons/rx';
import { MyTh, RoomId, TheTable } from "./table";
import { useBedroom } from "../../hooks/useBedroom";
import { ImCross } from "react-icons/im";

const issueMap: Record<PriorityId, { bg: string, border: string, text: string }> = {
  'low': { bg: "bg-blue-800", border: "bg-blue-400/20 border-blue-800/50", text: "Faible", },
  'medium': { bg: "bg-yellow-800", border: "bg-yellow-400/20 border-yellow-800/50", text: "Moyen", },
  'high': { bg: "bg-red-800", border: "bg-red-400/20 border-red-800/50", text: "Grave", },
};

export function PowerTab({ datas }: {
  datas: BedRoom.Type[],
}) {
  return (
    <TheTable datas={datas} top={[
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
    <TheTable datas={datas} top={[
      <MyTh Icon={FaRegClock} value="Arrivée" />,
      <MyTh Icon={IoBedOutline} value="CH" size={15} />,
      <MyTh Icon={MdOutlinePerson2} value="Client" size={15} />,
      <MyTh Icon={MdOutlineDescription} value="Description" />,
      <MyTh Icon={IoRestaurantOutline} value="Restaurant" />
    ]}>
      { room => [
        <span>{getFrenchDateTime(room.customer!.date)}</span>,
        <RoomId value={room.id} />,
        <PersonSex2 sexe={room.customer!.sexe}>{room.customer!.name}</PersonSex2>,
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
    <TheTable datas={datas} top={[
      <MyTh Icon={FaRegClock} value="Depuis" />,
      <MyTh Icon={IoBedOutline} value="CH" size={15} />,
      <MyTh Icon={PiBroomBold} value="Néttoyé par" />,
      <MyTh Icon={MdOutlineDescription} value="Priorité" />,
      <MyTh Icon={MdOutlineDescription} value="Description" />,
    ]}>
      { room => {
        const vallet = cleaning_book.get.find(clean => clean.roomId === room.id);
        const customer = customer_book.get.find(customer => customer.roomId === room.id);
        return [
          <span>{ customer?.end ? getFrenchDateTime(customer.end) : "..." }</span>,
          <RoomId value={room.id} />,
          <span>{!vallet ? "..." : !vallet.done ? "en néttoyage" : vallet.name}</span>,

          <div className='flex flex-row justify-end'>
            { room.issue && <IssueLabel issue={room.issue} /> }
          </div>,

          <span>{(room.issue?.message ?? customer?.description) || "..."}</span>,
        ]} }
    </TheTable>
  );
}

export function CleanTab({ datas }: {
  datas: BedRoom.Type[],
}) {
  const { cleanings } = useDataContext();
  const { cancel_cleaning, done_cleaning } = useBedroom();

  return (
    <TheTable datas={datas} top={[
      <MyTh Icon={FaRegClock} value="Date" />,
      <MyTh Icon={IoBedOutline} value="CH" size={15} />,
      <MyTh Icon={PiBroomBold} value="Vallet" />,
      <MyTh Icon={MdOutlinePerson2} value="Client" />,
      <MyTh Icon={MdOutlineDescription} value="État" />,
      <MyTh Icon={MdOutlineDescription} value="Action" />,
    ]}>
      { room => {
        const clean = cleanings.find(clean => clean.roomId === room.id);
        if (!clean) return []
        return [
          <span>{getFrenchDateTime(clean.date)}</span>,
          <RoomId value={room.id} />,

          <div className="flex justify-center">
            <PersonSex2 sexe={room.cleaner!.sexe}>{room.cleaner!.name}</PersonSex2>
          </div>,

          <div className="flex justify-center">
            { room.customer && <PersonSex2 sexe={room.customer.sexe}>{room.customer.name}</PersonSex2> }
          </div>,

          <div className='flex flex-row justify-center text-[11px] text-gray-600'>
            <span>En néttoyage</span>
          </div>,

          <div>
            <div className="flex flex-row flex-wrap gap-3 invisible group-hover:visible" onClick={e => e.stopPropagation()}>
            
              <div className="flex justify-center items-center p-1 size-5 bg-red-700 text-white rounded-full cursor-pointer"
                onClick={() => cancel_cleaning(room.id)}><ImCross size={10} />
              </div>
  
              <div className="flex justify-center items-center p-1 size-5 bg-blue-700 text-white rounded-full cursor-pointer"
                onClick={() => done_cleaning(room.id)}><FaCheck size={10} />
              </div>
  
            </div>
          </div>
        ]} }
    </TheTable>
  );
}

export function IssueTab({ datas }: {
  datas: BedRoom.Type[],
}) {
  return (
    <TheTable datas={datas} top={[
      <MyTh Icon={FaRegClock} value="Date" />,
      <MyTh Icon={IoBedOutline} value="CH" size={15} />,
      <MyTh Icon={MdOutlineDescription} value="Description" />,
      <MyTh Icon={MdOutlinePriorityHigh} value="Priorité" />,
    ]}>
      { room => [
        <span>{ room.issue ? getFrenchDateTime(room.issue.date) : '...'}</span>,

        <RoomId value={room.id} />,

        <div>{room.issue?.message ??
          <div className='grid grid-cols-[auto_1fr] items-center gap-2 text-center'>
            <MdWarning size={18} className='text-yellow-800' />
            <p>Cette chambre doit être néttoyée</p>
          </div>
        }</div>,

        <div className='flex flex-row justify-end'>
          <IssueLabel issue={room.issue ?? {
              date: new Date(Date.now()),
              priority: 'medium',
              message: "Sale",
          }} />
        </div>,
      ] }
    </TheTable>
  );
}


function IssueLabel({ issue }: {
  issue: BedRoom.IssueType,
}) {
  return (
    <div title={issue.message}
      className={twMerge("flex flex-row gap-1 rounded px-1 border-1", issueMap[issue.priority].border)}>
      <div className={twMerge('p-1 self-center rounded-full', issueMap[issue.priority].bg)} />
      <span className='text-[11px]'>{issueMap[issue.priority].text}</span>
    </div>
  );
}

