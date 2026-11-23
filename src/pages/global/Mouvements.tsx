'use client'

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
import { getString } from "../../tools";
import Room from "../../components/Room";
import { useVisual } from "../../hooks/useVisual";

export default function MouvementSection({ className }: {
  className?: string,
}) {
  const { addPopup, } = useVisual();
  const { customer_book } = useDataContext();

  const gridStyle = "grid grid-cols-[40px_20px_60px_1fr_minmax(auto,40px)] gap-x-3";

  return (
    <SectionBox className={twMerge("", className)}
      top={<Title icon={<TbArrowsDoubleNeSw size={20} />} right={getString(customer_book.list.length)}>Mouvements du jour</Title>}>

      <div className={`flex flex-col justify-start text-left text-[11px] font-bold h-full`}>

        <div className={twMerge("border-y-1 border-gray-400/50 py-[6px] mb-1", gridStyle)}>
          <p className="">Arrivée</p>
          <p className="">CH</p>
          <p className="pl-3">Sens</p>
          <p className="">Client</p>
          <p className="">Départ</p>
        </div>

        {/* <hr className="col-span-full text-gray-400/40 mt-3 mb-1" /> */}

        <NoElem list={customer_book.list} Icon={GoPerson} text="Rien à signaler" className="col-span-full">
          { customer_book.list.map((customer, i) => (
            <div key={i} className={twMerge("py-[5px] cursor-pointer text-gray-600 group",
              gridStyle)}
              onClick={() => addPopup(['ROOM', customer.room_id])}>
    
              <div className="">{getFrenchDateTime(customer.created_date)}</div>
    
              <Room id={customer.room_id} className={!customer.end ? "group-hover:text-green-800" : "group-hover:text-red-800"} />
    
              <MoveSens move={customer.actions[0]} />
    
              { !customer.end
              ? <div className="truncate"
                  onClick={() => addPopup(['ROOM', customer.room_id])}>{ customer.name }
                </div>
              : <div className="truncate">{ customer.name }</div> }
    
              <p className="text-center">{customer.end && getFrenchDateTime(customer.end)}</p>
    
            </div>
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
    <div className="flex flex-row items-center">
      { move.status === 'CHECK_IN' ? <FiArrowUpRight className="text-green-800" />
      : move.status === 'CHECK_UPDATE' ? <FiArrowUpRight className="text-purple-800" />
      : move.status === 'CHECK_MOVE' ? <IoArrowUpOutline className="text-blue-800" />
      : move.status === 'CHECK_OUT' ? <FiArrowDownRight className="text-red-800" />
      : null }
      <span className="ml-1">
        { move.status === 'CHECK_IN' ? "Arrivée"
        : move.status === 'CHECK_UPDATE' ? "Mise à jour"
        : move.status === 'CHECK_MOVE' ? move.datas.fromRoomId
        : move.status === 'CHECK_OUT' ? "Départ"
        : null }
      </span>
    </div>
  );
}

