'use client'

import React from "react";
import { useDataContext } from "../../hooks";
import { getFrenchDateTime } from "../../tools";

import { IoArrowUpOutline }  from "react-icons/io5";
import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";
import { CheckInType, CustomerType, TypeWithTrace } from "../../types";

type MoveType = Omit<TypeWithTrace<CustomerType>, 'actions'> & CheckInType;

export default function MouvementSection() {
  const { setPopup, customer_book, customers } = useDataContext();
  const todayO = new Date(Date.now());
  todayO.setHours(0,0,0,0);

  const customerTab: MoveType[] = Object.values(customer_book.lasts)
    .map(({ actions, ...customer }) => (
      actions.map(action => ({ ...customer, ...action,
        //  end:action.status === 'CHECK_OUT' ? customer.end : undefined,
      }))
    ))
    .flatMap(elem => elem)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="grid grid-cols-[auto_auto_auto_1fr_minmax(auto,40px)] \
        items-center gap-y-3 gap-x-3 text-left text-[11px] font-bold">
      <p className="">Arrivée</p>
      <p className="">CH</p>
      <p className="pl-3">Sens</p>
      <p className="">Client</p>
      <p className="">Départ</p>

      <hr className="col-span-full text-gray-400/40" />

      { customerTab.map((move, i) => <React.Fragment key={i}>

        <div className="text-gray-600">{getFrenchDateTime(move.date)}</div>

        <p className="text-black text-[12px] hover:cursor-pointer hover:underline"
          onClick={() => setPopup(['ROOM', move.roomId])}>{move.roomId}
        </p>

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

        { customers[move.id] && !customers[move.id].end
        ? <div className="text-gray-600 truncate cursor-pointer hover:underline"
            onClick={() => setPopup(['ROOM', customers[move.id].roomId])}>{ move.name }
          </div>
        : <div className="text-gray-600 truncate">{ move.name }</div> }

        <p className="text-center">{move.end && getFrenchDateTime(move.end)}</p>

      </React.Fragment> ) }

    </div>
  );
}
// warning chambre doit etre nettoyée
// redirection clean room Id