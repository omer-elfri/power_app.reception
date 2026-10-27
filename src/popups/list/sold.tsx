import BedRoom from '../../types/bedroom';
import { getFrenchDateTime } from '../../tools/date';

import NoElem from "../../components/NoElem";
import { PersonSex2} from '../../components/PersonSex';
import { MyTh, RoomId, TheTable } from "./table";

import { IoBedOutline, IoRestaurantOutline } from "react-icons/io5";
import { FaRegClock } from 'react-icons/fa';
import { MdOutlineDescription, MdOutlinePerson2 } from 'react-icons/md';
import { BiBed } from "react-icons/bi";

export default function SoldTab({ datas }: {
  datas: BedRoom.Type[],
}) {
  return (
    <NoElem text="Aucun élément" Icon={BiBed} className='text-[15px]' list={datas}>

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

    </NoElem>
  );
}
