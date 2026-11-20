'use client';

import { twMerge } from 'tailwind-merge';
import { useDataContext } from "../../hooks";
import BedRoom from '../../types/bedroom';
import { getFrenchDate } from '../../tools/date';

import { AsideDiv } from '../../components/AsideDiv';
import NoElem from '../../components/NoElem';
import { FaCalendarAlt } from 'react-icons/fa';
import Caster from '../../components/Caster';
import { colors } from '../../types';

export default function ReservationTab({ room:bedRoom, className }: {
  room: BedRoom.Type,
  className?: string,
}) {
  const { reservation_book } = useDataContext();
  const roomReservations = reservation_book.getRooms(bedRoom.id);
  const gridStyle = "grid grid-cols-[40px_1fr_40px_40px] gap-2 px-2";

  return (
    <AsideDiv no_bar title="Réservations"
      icon={<FaCalendarAlt size={14} className='text-purple-700' />}
      right={<Caster color={colors.coming} value={['RESERVATION']} />}
      className={twMerge('min-h-30', className)} subClassName='gap-0'>

      <NoElem Icon={FaCalendarAlt} text="Aucune réservation" list={roomReservations} className="min-h-30">

        <div className={twMerge("text-[11px] py-1 text-gray-500 border-y-1 border-gray-400/40", gridStyle)}>
          <p>Date</p><p>Client</p><p>Arrivée</p><p>Départ</p>
        </div>

        <div className='flex flex-col flex-1'>
          { roomReservations.map(rsv =>
            <div key={rsv.id}
              className={twMerge("text-[11px] py-[7px] border-b-1 border-gray-400/40 last:border-0 text-gray-600", gridStyle)}>
              <p>{getFrenchDate(rsv.created_date).slice(0,6)}</p>
              <p>{rsv.name}</p>
              <p>{getFrenchDate(rsv.start_date).slice(0,6)}</p>
              <p>{getFrenchDate(rsv.end_date).slice(0,6)}</p>
            </div>
          ) }
        </div>

      </NoElem>

    </AsideDiv>
  );
}
