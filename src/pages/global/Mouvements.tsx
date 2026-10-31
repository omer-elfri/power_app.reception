'use client'

import React from "react";
import { twMerge } from "tailwind-merge";
import { useDataContext } from "../../hooks";
import { getFrenchDateTime } from "../../tools/date";
import { CheckInType } from "../../types/types";

import SectionBox, { Title } from "../../components/SectionBox";
import NoElem from "../../components/NoElem";
import { IoArrowUpOutline }  from "react-icons/io5";
import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";
import { TbArrowsDoubleNeSw } from "react-icons/tb";
import { GoPerson } from "react-icons/go";

export default function MouvementSection({ className }: {
  className?: string,
}) {
  const { addPopup, customer_book } = useDataContext();

  const gridStyle = "grid grid-cols-[auto_auto_auto_1fr_minmax(auto,40px)] gap-y-3 gap-x-3";

  return (
    <SectionBox className={twMerge("", className)}
      top={<Title icon={<TbArrowsDoubleNeSw size={20} />} className="mb-2" right={customer_book.list.length}>Mouvements du jour</Title>}>

      <div className={`${gridStyle} items-start text-left text-[11px] font-bold`}>

        <p className="">Arrivée</p>
        <p className="">CH</p>
        <p className="pl-3">Sens</p>
        <p className="">Client</p>
        <p className="">Départ</p>
        <hr className="col-span-full text-gray-400/40" />

        <NoElem list={customer_book.list} Icon={GoPerson} text="Rien à signaler" className="col-span-full">

          { customer_book.list.map((customer, i) => (
            <React.Fragment key={i}>
    
              <div className="text-gray-600">{getFrenchDateTime(customer.created_date)}</div>
    
              <p className="text-black text-[12px] a"
                onClick={() => addPopup(['ROOM', customer.room_id])}>{customer.room_id}
              </p>
    
              <MoveSens move={customer.actions[0]} />
    
              { !customer.end
              ? <div className="text-gray-600 truncate a"
                  onClick={() => addPopup(['ROOM', customer.room_id])}>{ customer.name }
                </div>
              : <div className="text-gray-600 truncate">{ customer.name }</div> }
    
              <p className="text-gray-600 text-center">{customer.end && getFrenchDateTime(customer.end)}</p>
    
            </React.Fragment>
          )) }

        </NoElem>

      </div>

    </SectionBox>
  );
}


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

