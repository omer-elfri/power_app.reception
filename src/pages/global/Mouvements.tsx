"use client"

import { IoArrowDownOutline, IoArrowUpOutline }  from "react-icons/io5";
import React from "react";
import BedRoom from "../../types/bedroom";

export default function MouvementSection({ datas }: {
  datas: {
    'sens': 'arrivée' | 'départ',
    'roomId': BedRoom.Id,
    'client': string,
    'come_at': string,
    'go_at': string,
  }[],
}) {
  return (
    <div className="grid grid-cols-[auto_auto_auto_1fr_auto] items-center gap-y-2 gap-x-3 text-left">

      <p className="text-[11px] font-bold">Arrivée</p>
      <p className="text-[11px] font-bold">CH</p>
      <p className="text-[11px] font-bold pl-3">Sens</p>
      <p className="text-[11px] font-bold">Client</p>
      <p className="text-[11px] font-bold">Départ</p>

      <hr className="col-span-full text-gray-400/40" />

      { datas.map((data, i) => <React.Fragment key={i}>
        <p className="text-[11px] font-bold text-gray-600">{data.come_at}</p>
        <p className="text-[11px] font-bold text-gray-600">{data.roomId}</p>
        <div className="flex flex-row items-center text-[11px] font-bold text-gray-600">
          { (data.sens === 'arrivée') ?
              <IoArrowUpOutline color="green-600/15" className="text-[11px] text-green-600" /> :
          (data.sens === 'départ') ?
            <IoArrowDownOutline className="text-[11px] text-red-600" /> : null }
          <span className="capitalize ml-1">{data.sens}</span>
        </div>
        <p className="text-[12px] truncate flex-1 text-gray-600">{data.client}</p>
        <p className="text-[12px] font-bold text-center text-gray-600">{data.go_at}</p>
      </React.Fragment> ) }

    </div>
  );
}
