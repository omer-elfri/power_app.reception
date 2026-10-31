'use client';

import { useRequest } from "../../hooks/useRequest";
import { useDataContext } from "../../hooks";
import BedRoom from '../../types/bedroom';
import { getFrenchDateTime } from '../../tools/date';

import NoElem from "../../components/NoElem";
import { PersonSex2} from '../../components/PersonSex';
import { MyTh, RoomId, TheTable } from "./table";

import { IoBedOutline } from "react-icons/io5";
import { FaCheck, FaRegClock } from 'react-icons/fa';
import { MdOutlineDescription, MdOutlinePerson2, MdWarning } from 'react-icons/md';
import { PiBroomBold } from 'react-icons/pi';
import { ImCross } from "react-icons/im";
import { BiBed } from "react-icons/bi";

export function CleanTab({ datas }: {
  datas: BedRoom.Type[],
}) {
  const { analysis, cancel_cleaning, done_cleaning } = useRequest();

  return (
    <div className="flex flex-col gap-3 min-h-full">

      { analysis.cleaning.obsolets.length > 0 && (
        <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1 font-bold bg-yellow-600/15 px-3 py-2 rounded text-start">
          <MdWarning size={30} className="row-span-2 text-yellow-800" />
          <h2 className="text-[12px] text-yellow-800">Ces chambres sont obsolètes</h2>
          <p className="text-[12px] text-gray-700">{analysis.cleaning.obsolets.map(room => room.name).join(", ")}</p>
        </div>
      ) }

      <NoElem text="Aucun élément" Icon={BiBed} className='text-[15px] bg-gray-300/40' list={datas}>

        <TheTable datas={datas} top={[
          <MyTh Icon={FaRegClock} value="Date" />,
          <MyTh Icon={IoBedOutline} value="CH" size={15} />,
          <MyTh Icon={PiBroomBold} value="Vallet" />,
          <MyTh Icon={MdOutlinePerson2} value="Client" />,
          <MyTh Icon={MdOutlineDescription} value="État" />,
          <MyTh Icon={MdOutlineDescription} value="Action" />,
        ]}>
          { room => {
            const { cleaning_book } = useDataContext();
            const clean = cleaning_book.getRoomId(room.id);
            if (!clean) return []
            return [
              <span>{getFrenchDateTime(clean.created_date)}</span>,
              <RoomId value={room.id} />,
              <PersonSex2 sexe={room.clean!.valet.sexe}>{room.clean!.valet.name}</PersonSex2>,
              room.customer ? <PersonSex2 sexe={room.customer.sexe}>{room.customer.name}</PersonSex2> : <div />,
              <span className="text-[11px] text-gray-600">En néttoyage</span>,

              <div className="flex flex-row flex-wrap gap-3 invisible group-hover:visible" onClick={e => e.stopPropagation()}>
              
                <div className="flex justify-center items-center p-1 size-5 bg-red-700 text-white rounded-full cursor-pointer"
                  onClick={() => cancel_cleaning(room.clean!.id)}><ImCross size={10} />
                </div>
    
                <div className="flex justify-center items-center p-1 size-5 bg-blue-700 text-white rounded-full cursor-pointer"
                  onClick={() => done_cleaning(room.clean!.id)}><FaCheck size={10} />
                </div>
    
              </div>
            ]} }
        </TheTable>

      </NoElem>

    </div>
  );
}

