'use client'

import React from "react";

import { IoArrowDownOutline, IoArrowUpOutline }  from "react-icons/io5";
import { ActionId, useDataContext } from "../../hooks";
import { getTime } from "../../tools";
import BedRoom from "../../types/bedroom";
import { CheckInProps } from "../../hooks/bedroom";
import { twMerge } from "tailwind-merge";

export default function MouvementSection() {
  // const { moves } = useDataContext();
  const { histories } = useDataContext();
  
  const moves = React.useMemo(() => {
    const includedLabels: ActionId[] = [ 'CHECK_IN', 'CHECK_OUT' ];
    const res = histories
      .filter(history => includedLabels
        .includes(history.label))
      .map(history => {
        const datas = history.datas as BedRoom.CheckInType;
        return ({
          status: history.label,
          roomId: history.roomId,
          sens: history.label === 'CHECK_IN' ? "arrivée" : "départ",
          client: datas.name,
          come_at: history.label === 'CHECK_IN' ? getTime(history.date) : getTime(datas.date),
          go_at: history.label === 'CHECK_OUT' ? getTime(history.date) : null,
        })
      })
    return res;
  }, [histories]);

  return (
    <div className="grid grid-cols-[auto_auto_auto_1fr_auto] items-center gap-y-3 gap-x-3 text-left text-[11px] font-bold">

      <p className="">Arrivée</p>
      <p className="">CH</p>
      <p className="pl-3">Sens</p>
      <p className="">Client</p>
      <p className="">Départ</p>

      <hr className="col-span-full text-gray-400/40" />

      { moves.map((data, i) => <React.Fragment key={i}>

        <div className="text-gray-600">
          { data.come_at ?
            <p className="">{data.come_at}</p> :
            <p className="text-center">-</p> }
        </div>

        <p className="text-[12px] text-black ">{data.roomId}</p>

        <div className={twMerge("flex flex-row items-center text-gray-600",
            (data.sens === 'arrivée') ? "text-green-800" : "text-red-800")}>
          { (data.sens === 'arrivée') ? <IoArrowUpOutline /> :
            (data.sens === 'départ') ? <IoArrowDownOutline /> : null }
          <span className="capitalize ml-1 text-gray-600">{data.sens}</span>
        </div>

        <div className={twMerge("text-gray-600 truncate",
            (data.sens === 'départ') ? "" : "col-span-2")}>
          { data.client }
        </div>

        { (data.sens === 'départ') && <p className="text-center text-black">{data.go_at}</p> }

      </React.Fragment> ) }

    </div>
  );
}
