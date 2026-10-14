import { getFrenchDate } from ".";
import { employers_datas } from "../configs/employer";
import { NotificationType, TypeWithTrace } from "../types";

export function getNotification(notif: TypeWithTrace<NotificationType>): string {
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

    case 'BOOKED': return `La chambre ${notif.roomId} à été réservée par ${notif.datas.bookerName} le ${getFrenchDate(notif.datas.bookedDate)}`;
    case 'BOOKED_CANCELED': return `La réservation de la chambre ${notif.roomId} par ${notif.datas.bookerName} le ${getFrenchDate(notif.datas.bookedDate)} à été annulée par ${receptionnistName}`;
    default: return "";
  }
}