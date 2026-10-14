'use client';

import { twMerge } from 'tailwind-merge';

import { useDataContext } from '../../hooks';
import BedRoom from '../../types/bedroom';
import { colors } from '../../types';
import { getTime } from '../../tools';
import { getNotification } from '../../tools/notifications';

import FormAside from '../../components/FormAside';
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoNotifications } from 'react-icons/io5';

export default function NotificationBox({ room:bedRoom, className }: {
  room: BedRoom.Type,
  className?: string,
}) {
  const { notificationBook } = useDataContext();
  const notifs = notificationBook
      .filter(notif => notif.roomId === bedRoom.id)
      .slice(0,0);

  return (
    <FormAside title="Notifications récentes"
      icon={<IoMdNotificationsOutline size={15} />} bar={false}
      className={twMerge('min-h-40 pb-1 relative', className)}>
      
        <table className="flex flex-col text-gray-600">
          <tbody>
            { notifs.length === 0

            ? <div className='flex flex-col gap-5 justify-center items-center h-100 text-gray-400'>
              <IoNotifications size={50} className='' />
              <p className='font-bold text-[12px] uppercase mb-20'>Aucune notification</p>
            </div>

            : notifs.map((notif, i) => (
              <tr key={i} className="flex flex-row gap-3 items-start py-2 border-t-1 border-gray-400/50">
                <td className="text-[11px] font-bold">{getTime(notif.date)}</td>
                <td> <div className="w-2 rounded-full aspect-square mt-[5px]"
                  style={{ backgroundColor: colors[notif.label] }}
                /></td>
                <td className="text-[11px] line-clamp-2 font-bold">{getNotification(notif)}</td>
              </tr>
            )) }

          </tbody>
        </table>

    </FormAside>
  );
}
