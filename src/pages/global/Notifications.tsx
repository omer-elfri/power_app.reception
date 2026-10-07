'use client'
import React from "react";
import { twMerge } from "tailwind-merge";

import { ActionId, HistoryType, useDataContext } from "../../hooks";
import { CheckInProps } from "../../hooks/bedroom";
import { getTime } from "../../tools";
import { colors } from "../../types";
import BedRoom from "../../types/bedroom";
import { employers_datas } from "../../configs/employer";

export default function NotificationSection() {
  const { histories } = useDataContext();
  
  const notifications = React.useMemo(() => {
    const exludedLabels: ActionId[] = [ 'POWER_ON', 'POWER_OFF' ];
    const res = histories.filter(history => !exludedLabels.includes(history.label))
    return res;
  }, []);

  const getNotification = React.useCallback((history: HistoryType) => {
    switch(history.label) {
      case 'CHECK_IN': {
        const datas = history.datas as CheckInProps;
        return `Chambre ${history.roomId} vendue pour ${datas?.name!}`;
      }
      case 'CHECK_OUT': {
        return `Chambre ${history.roomId} libéré`;
      }
      case 'CLEANING_START': {
        const datas = history.datas as BedRoom.CleanType;
        return `Néttoyage de la chambre ${history.roomId} attribuée à ${datas.vallet.name}`;
      }
      case 'CLEANING_DONE': {
        const datas = history.datas as BedRoom.CleanType;
        return `Néttoyage de la chambre ${history.roomId} fait par ${datas.vallet.name}`;
      }
      case 'CLEANING_CANCELED': {
        const receptionnistName = employers_datas[history.receptionnistId].name;
        return `Néttoyage de la chambre ${history.roomId} annulé par ${receptionnistName}`;
      }
      // case 'BOOKED': {
      //   const datas = history.datas as CheckInProps;
      //   const receptionnistName = employers_datas[history.receptionnistId].name;
      //   return `Réservation de ${datas.client} fait par ${receptionnistName}`;
      // }
      // case 'BOOKED_CANCELED': {
      //   const datas = history.datas as CheckInProps;
      //   const receptionnistName = employers_datas[history.receptionnistId].name;
      //   return `Réservation de ${datas.client} annulée par ${receptionnistName}`;
      // }
      default: return "";
    }
  }, []);

  return (
    <table className="flex flex-col text-gray-600">
      <tbody>
        { notifications.slice(0,10)
          .sort((a, b) => b.date.getTime() - a.date.getTime())
          .map((data, i) => (

          <tr key={i} className="flex flex-row gap-3 items-start py-2 border-t-1 border-gray-400/50">
            <td className="text-[11px] font-bold">{getTime(data.date)}</td>
            <td>
              <div className="w-2 rounded-full aspect-square mt-[5px]"
                style={{ backgroundColor: colors[data.label] }}
              />
            </td>
            <td className="text-[11px] line-clamp-2 font-bold">{ getNotification(data) }</td>
          </tr>
        )) }
      </tbody>
    </table>
  );
}
