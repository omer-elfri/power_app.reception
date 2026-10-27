'use client';

import { useDataContext } from "../../hooks";
import BedRoom from '../../types/bedroom';
import { getFrenchDateTime } from '../../tools/date';

import NoElem from "../../components/NoElem";
import { MyTh, RoomId, TheTable } from "./table";

import { IoBedOutline } from "react-icons/io5";
import { FaRegClock } from 'react-icons/fa';
import { MdOutlineDescription } from 'react-icons/md';
import { PiBroomBold } from 'react-icons/pi';
import { BiBed } from "react-icons/bi";
import { IssueLabel } from "./critic";

export function FreeTab({ datas }: {
  datas: BedRoom.Type[],
}) {
  const { customer_book } = useDataContext();

  return (
    <NoElem text="Aucun élément" Icon={BiBed} className='text-[15px]' list={datas}>

      <TheTable datas={datas} top={[
        <MyTh Icon={FaRegClock} value="Depuis" />,
        <MyTh Icon={IoBedOutline} value="CH" size={15} />,
        <MyTh Icon={PiBroomBold} value="Néttoyé par" />,
        <MyTh Icon={MdOutlineDescription} value="Priorité" />,
        <MyTh Icon={MdOutlineDescription} value="Description" />,
      ]}>
        { room => {
          const customer = customer_book.getRoomId(room.id);
          return [
            <span>{ customer?.end ? getFrenchDateTime(customer.end) : "..." }</span>,
            <RoomId value={room.id} />,
            <span>{ room.cleaner?.name ?? "..." }</span>,

            <div className='flex flex-row justify-end'>
              { room.issue && <IssueLabel issue={room.issue} /> }
            </div>,

            <span>{(room.issue?.message ?? customer?.description) || "..."}</span>,
          ]} }
      </TheTable>

    </NoElem>
  );
}

