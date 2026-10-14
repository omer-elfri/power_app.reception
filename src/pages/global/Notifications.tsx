'use client'

import { useDataContext } from "../../hooks";
import { getTime } from "../../tools";
import { getNotification } from "../../tools/notifications";
import { colors } from "../../types";

export default function NotificationSection() {
  const { notificationBook } = useDataContext();

  return (
    <table className="flex flex-col text-gray-600">
      <tbody>
        { notificationBook.slice(0,10).map((notif, i) => (
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
  );
}