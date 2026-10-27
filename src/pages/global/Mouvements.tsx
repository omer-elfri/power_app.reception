'use client'

import React from "react";
import { useDataContext } from "../../hooks";
import { getFrenchDateTime } from "../../tools/date";

import { IoArrowUpOutline }  from "react-icons/io5";
import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";
import { CheckInType, CustomerType } from "../../types/types";
import { TypeWithTrace } from "../../hooks/useBook";

export default function MouvementSection({ customers:customerTab }: {
  customers: TypeWithTrace<CustomerType>[],
}) {
  const { addPopup } = useDataContext();

  return (
    <div className="grid grid-cols-[auto_auto_auto_1fr_minmax(auto,40px)] \
        items-center gap-y-3 gap-x-3 text-left text-[11px] font-bold">
      <p className="">Arrivée</p>
      <p className="">CH</p>
      <p className="pl-3">Sens</p>
      <p className="">Client</p>
      <p className="">Départ</p>

      <hr className="col-span-full text-gray-400/40" />

      { customerTab.map((customer, i) => <React.Fragment key={i}>

        <div className="text-gray-600">{getFrenchDateTime(customer.date)}</div>

        <p className="text-black text-[12px] a"
          onClick={() => addPopup(['ROOM', customer.roomId])}>{customer.roomId}
        </p>

        <MoveSens move={customer.actions[0]} />

        { !customer.end
        ? <div className="text-gray-600 truncate a"
            onClick={() => addPopup(['ROOM', customer.roomId])}>{ customer.name }
          </div>
        : <div className="text-gray-600 truncate">{ customer.name }</div> }

        <p className="text-gray-600 text-center">{customer.end && getFrenchDateTime(customer.end)}</p>

      </React.Fragment> ) }

    </div>
  );
}
// warning chambre doit etre nettoyée
// redirection clean room Id


function MoveSens({ move }: {
  move: CheckInType,
}) {
  return (
    <div className="flex flex-row items-center text-gray-600">
      { move.status === 'CHECK_IN' ? <FiArrowUpRight className="text-green-800" />
      : move.status === 'CHECK_UPDATE' ? <FiArrowUpRight className="text-purple-800" />
      : move.status === 'CHECK_MOVE' ? <IoArrowUpOutline className="text-blue-800" />
      : move.status === 'CHECK_OUT' ? <FiArrowDownRight className="text-red-800" />
      : null }
      <span className="ml-1 text-gray-600">
        { move.status === 'CHECK_IN' ? "Arrivée"
        : move.status === 'CHECK_UPDATE' ? "Mise à jour"
        : move.status === 'CHECK_MOVE' ? move.datas.fromRoomId
        : move.status === 'CHECK_OUT' ? "Départ"
        : null }
      </span>
    </div>
  );
}

