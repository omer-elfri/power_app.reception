'use client';

import { useDataContext } from "../../hooks";
import BedRoom from '../../types/bedroom';

import FormAside from '../../components/FormAside';
import { getFrenchDate, getFrenchDateTime } from '../../tools/date';
import { MyTr } from '../../components/MyTable';
import { FaCalendarAlt } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';
import NoElem from '../../components/NoElem';
import MyButton from "../../components/MyButton";
import { useBedroom } from "../../hooks/useBedroom";

export function BookButton({ className }: {
  className?: string,
}) {
  const { addPopup } = useDataContext();

  return (
    <MyButton
      className={twMerge('!text-[10px] bg-purple-500 text-white !px-2 !py-1 gap-x-1 hover:scale-95', className)}
      onClick={() => addPopup(['BOOKING'])}>Réserver
    </MyButton>
  );
}

export default function ReservationTab({ room:bedRoom, className }: {
  room: BedRoom.Type,
  className?: string,
}) {
  const { addPopup, reservations } = useDataContext();
  const roomReservations = reservations
    .filter(rsv => rsv.roomId === bedRoom.id)
    .sort((a, b) => b.start.getTime() - a.start.getTime());

  return (
    <FormAside icon={<FaCalendarAlt size={14} className='text-purple-700' />} title="Réservations" className={twMerge('min-h-30', className)} right={<BookButton className="self-end" />}>

      <NoElem Icon={FaCalendarAlt} text="Aucune réservation" list={roomReservations} className="min-h-30">

        <MyTr className="grid grid-cols-4 text-center text-[11px] text-gray-500 border-b-1 border-gray-400/40">
          <p>Client</p><p>CH</p><p>Arrivée</p><p>Départ</p>
        </MyTr>

        <div className='flex flex-col flex-1'>
          { roomReservations.map(rsv =>
            <MyTr key={rsv.id} onClick={() => addPopup(['BOOKING', rsv.id])}
              className="grid-cols-4 group py-1 cursor-pointer hover:bg-blue-400/10 text-[11px]">
              <p>{rsv.name}</p>
              <p>{rsv.roomId}</p>
              <p>{getFrenchDate(rsv.start).slice(0,6)}</p>
              <p>{getFrenchDate(rsv.end).slice(0,6)}</p>
            </MyTr>
          ) }
        </div>

      </NoElem>

    </FormAside>
  );
}
