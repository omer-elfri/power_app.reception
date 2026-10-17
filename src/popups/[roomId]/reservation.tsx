'use client';

import { useDataContext } from "../../hooks";
import BedRoom from '../../types/bedroom';

import FormAside from '../../components/FormAside';
import { getFrenchDate, getFrenchDateTime } from '../../tools';
import MyTable, { MyTr } from '../../components/MyTable';
import { FaCalendarAlt } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';
import NoElem from '../../components/NoElem';

export default function ReservationTab({ room:bedRoom, className }: {
  room: BedRoom.Type,
  className?: string,
}) {
  const { setPopup, reservations } = useDataContext();
  const roomReservations = reservations.filter(rsv => rsv.roomId === bedRoom.id);

  return (
    <FormAside title="Liste de réservation" className={twMerge('', className)}
      right={<FaCalendarAlt size={13} onClick={() => setPopup(['BOOKING'])} className='text-purple-600 cursor-pointer' />}>

        <NoElem Icon={FaCalendarAlt} text="Aucune réservation" list={roomReservations}>

          <MyTable datas={roomReservations} className='flex-1'>
            { rsv => <MyTr key={rsv.id} onClick={() => setPopup(['BOOKING', rsv.id])}
              className="grid-cols-4 border-b-1 border-gray-400/40 py-2 cursor-pointer hover:bg-blue-400/10">
              <p>{getFrenchDateTime(rsv.date)}</p>
              <p>{rsv.roomId}</p>
              <p>{getFrenchDate(rsv.start).slice(0,6)}</p>
              <p>{getFrenchDate(rsv.end).slice(0,6)}</p>
            </MyTr> }
          </MyTable>

        </NoElem>

    </FormAside>
  );
}
