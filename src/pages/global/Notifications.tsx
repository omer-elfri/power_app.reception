'use client'
import { employers_datas } from "../../configs/employer";
import { useDataContext } from "../../hooks";
import { getDate, getTime } from "../../tools";
import { colors, NotificationType, TypeWithTrace } from "../../types";

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

function getNotification(notif: TypeWithTrace<NotificationType>): string {
  const receptionnistName = employers_datas[notif.auth_session].name;
  switch(notif.label) {
    case 'DISCONNECTED': return `La chambre ${notif.roomId} est déconnectée du réseau`;
    case 'POWER_ON': return `La chambre ${notif.roomId} est allumée`;
    case 'POWER_OFF': return `La chambre ${notif.roomId} est éteinte`;

    case 'CHECK_IN': return `La chambre ${notif.roomId} est vendue à ${notif.datas!.clientName}`;
    case 'CHECK_UPDATE': return `Les informations client de la chambre ${notif.roomId} ont été modifiée par ${receptionnistName}`;
    case 'CHECK_MOVE': return `Le client de la chambre ${notif.roomId} à été déplacé à la chambre ${notif.datas.toRoomId}`;
    case 'CHECK_OUT': return `La chambre ${notif.roomId} - ${notif.datas.clientName} à libéré`;

    case 'CLEANING_START': return `La chambre ${notif.roomId} est en néttoyage`;
    case 'CLEANING_CANCELED': return `Le néttoyage de la chambre ${notif.roomId} est annulé par ${receptionnistName}`;
    case 'CLEANING_DONE': return `La chambre ${notif.roomId} à été néttoyée par ${notif.datas.cleanerName}`;

    case 'BOOKED': return `La chambre ${notif.roomId} à été réservée par ${notif.datas.bookerName} le ${getDate(notif.datas.bookedDate)}`;
    case 'BOOKED_CANCELED': return `La réservation de la chambre ${notif.roomId} par ${notif.datas.bookerName} le ${getDate(notif.datas.bookedDate)} à été annulée par ${receptionnistName}`;
    default: return "";
  }
}