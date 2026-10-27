import BedRoom from '../../types/bedroom';
import NoElem from "../../components/NoElem";
import { MyTh, RoomId, TheTable } from "./table";

import { IoBedOutline } from "react-icons/io5";
import { FaWifi } from 'react-icons/fa';
import { MdOutlinePerson2 } from 'react-icons/md';
import { PiBroomBold } from 'react-icons/pi';
import { RxLightningBolt } from 'react-icons/rx';
import { BiBed } from "react-icons/bi";

export default function PowerTab({ datas }: {
  datas: BedRoom.Type[],
}) {
  return (
    <NoElem text="Aucun élément" Icon={BiBed} className='text-[15px]' list={datas}>

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

    </NoElem>
  );
}

