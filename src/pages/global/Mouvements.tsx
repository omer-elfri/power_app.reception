'use client'

import React from "react";
import { twMerge } from "tailwind-merge";

import { IoArrowDownOutline, IoArrowUpOutline }  from "react-icons/io5";
import { useDataContext } from "../../hooks";
import { getTime } from "../../tools";
import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";

export default function MouvementSection() {
  const { customerBook } = useDataContext();

  return (
    <div className="grid grid-cols-[auto_auto_auto_1fr_auto] items-center gap-y-3 gap-x-3 text-left text-[11px] font-bold">

      <p className="">Arrivée</p>
      <p className="">CH</p>
      <p className="pl-3">Sens</p>
      <p className="">Client</p>
      <p className="">Départ</p>

      <hr className="col-span-full text-gray-400/40" />

      { customerBook.map((move, i) => <React.Fragment key={i}>

        <div className="text-gray-600">{getTime(move.date)}</div>

        <p className="text-black text-[12px]">{move.roomId}</p>

        <div className="flex flex-row items-center text-gray-600">
          { move.status === 'CHECK_IN' ?
            <FiArrowUpRight className="text-green-800" />
          : move.status === 'UPDATE' ?
            <FiArrowUpRight className="text-purple-800" />
          : move.status === 'MOVE_IN' ?
            <IoArrowUpOutline className="text-blue-800" />
          : move.status === 'MOVE_OUT' ?
            <IoArrowDownOutline className="text-blue-800" />
          : move.status === 'CHECK_OUT' ?
            <FiArrowDownRight className="text-red-800" />
          : null }
          <span className="capitalize ml-1 text-gray-600">{
            move.status === 'MOVE_IN' ? "Déplacée" :
            move.status === 'MOVE_OUT' ? "Changée" :
            move.status === 'UPDATE' ? "Mise à jour" :
            move.status === 'CHECK_IN' ? "Arrivée" :
            move.status === 'CHECK_OUT' ? "Départ" : null }
          </span>
        </div>

        <div className={twMerge("text-gray-600 truncate", move.end ? "":"col-span-2" )}>
          { move.clientName }
        </div>

        { move.end && <p className="text-center text-black">{getTime(move.end)}</p> }

      </React.Fragment> ) }

    </div>
  );
}
