'use client';

import { twMerge } from 'tailwind-merge';
import { useDataContext } from "../../../hooks";
import BedRoom from '../../../types/bedroom';
import { colors } from '../../../types';

import { AsideDiv } from '../../../components/AsideDiv';
import NoElem from '../../../components/NoElem';
import Caster from '../../../components/Caster';
import BookLine from './BookLine';
import { FaCalendarAlt } from 'react-icons/fa';


export default function ReservationTab({ room:bedRoom, className }: {
  room: BedRoom.Type,
  className?: string,
}) {
  const { reservation_book } = useDataContext();
  const roomReservations = reservation_book.getRooms(bedRoom.id);
  const gridStyle = "grid grid-cols-[40px_1fr_40px_40px] gap-2 px-2";

  return (
    <AsideDiv no_bar={roomReservations.length > 0} title="Réservations"
      icon={<FaCalendarAlt size={14} className='text-purple-700' />}
      right={<Caster color={colors.coming} value={['RESERVATION']} />}
      className={twMerge('min-h-30', className)} subClassName='gap-0'>

      <NoElem Icon={FaCalendarAlt} size={35} text="Aucune réservation" list={roomReservations} className="min-h-30">

        <div className={twMerge("text-[11px] py-1 text-gray-500 border-y-1 border-gray-400/40", gridStyle)}>
          <p>Date</p><p>Client</p><p>Arrivée</p><p>Départ</p>
        </div>

        <div className='flex flex-col flex-1'>
          { roomReservations.map(rsv =>
            <BookLine key={rsv.id} rsv={rsv} className={gridStyle} />
          ) }
        </div>

      </NoElem>

    </AsideDiv>
  );
}
