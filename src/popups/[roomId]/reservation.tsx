'use client';

import { useDataContext } from "../../hooks";
import BedRoom from '../../types/bedroom';

import FormAside from '../../components/FormAside';
import { getFrenchDate, getFrenchDateTime } from '../../tools/date';
import { MyTr } from '../../components/MyTable';
import { FaCalendarAlt } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';
import NoElem from '../../components/NoElem';

export default function ReservationTab({ room:bedRoom, className }: {
  room: BedRoom.Type,
  className?: string,
}) {
  const { addPopup, reservations } = useDataContext();
  const roomReservations = reservations.filter(rsv => rsv.roomId === bedRoom.id);

  return (
    <FormAside title="Liste de réservation" className={twMerge('min-h-40', className)}
      right={<FaCalendarAlt size={13} onClick={() => addPopup(['BOOKING'])} className='text-purple-600 cursor-pointer' />}>

        <NoElem Icon={FaCalendarAlt} text="Aucune réservation" list={roomReservations}>

          <div className='flex flex-col flex-1'>
            { roomReservations.map(rsv => <MyTr key={rsv.id} onClick={() => addPopup(['BOOKING', rsv.id])}
              className="grid-cols-4 border-b-1 border-gray-400/40 py-2 cursor-pointer hover:bg-blue-400/10">
              <p>{getFrenchDateTime(rsv.date)}</p>
              <p>{rsv.roomId}</p>
              <p>{getFrenchDate(rsv.start).slice(0,6)}</p>
              <p>{getFrenchDate(rsv.end).slice(0,6)}</p>
            </MyTr>) }
          </div>

        </NoElem>

    </FormAside>
  );
}
