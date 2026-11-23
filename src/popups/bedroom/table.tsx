'use client';

import React from "react";
import { twMerge } from "tailwind-merge";
import { useVisual } from "../../hooks/useVisual";
import { useAnalysis } from "../../hooks/useAnalysis";
import BedRoom from "../../types/bedroom";

import RoomStatus from "../../components/RoomStatus";
import NoElem from "../../components/NoElem";
import { AsideDiv } from "../../components/AsideDiv";
import { PersonSex2 } from "../../components/PersonSex";
import { IoWarning } from "react-icons/io5";
import { GiBroom } from "react-icons/gi";
import { HiLightningBolt } from "react-icons/hi";
import { MdDangerous } from "react-icons/md";
import { BiBed } from "react-icons/bi";
import { gridStyle } from ".";
import { getFrenchDate } from "../../tools/date";

export default function RoomTable({ roomFiltered, className }: {
  roomFiltered: BedRoom.Type[],
  className?: string,
}) {
  const roomStage = Object.entries( Object.groupBy(roomFiltered, room => room.stage) );

  return (
    <div className={twMerge("flex flex-col gap-3", className)}>

      <AsideDiv subClassName={twMerge("text-center !p-0", gridStyle)}>
        <span>CH</span>
        <span>Power</span>
        <span>Status</span>
        <span>Description</span>
      </AsideDiv>

      <NoElem list={roomFiltered} Icon={BiBed} size={70} text="Aucune chambre" className="h-90">

        { roomStage.map(([stage, rooms]) => (
          <React.Fragment key={stage}>

            <div className="grid grid-cols-[10px_auto] gap-2 items-center">
              <div className="pt-[2px] bg-gray-500" />
              <p className="text-[12px] font-bold flex flex-row gap-2">{stage}</p>
            </div>

            <AsideDiv className="py-1" subClassName="gap-0">
              { rooms.map(room => <RoomLine key={room.id} room={room} className="last:border-0" /> ) }
            </AsideDiv>

          </React.Fragment>
        )) }
      </NoElem>
      
    </div>
  );
}

function RoomLine({ room:bedRoom, className }: {
  room: BedRoom.Type,
  className?: string,
}) {
  const { addPopup } = useVisual();
  const { isObsolet } = useAnalysis();

  return (
    <div onClick={() => addPopup(['ROOM', bedRoom.id])}
      className={twMerge("cursor-pointer hover:bg-blue-300/10 text-gray-600 border-b-[1px] border-gray-400/30 \
        hover:[&>*]:scale-95 [&>*]:animate-1 [&>*]:transition-transform [&>*]:duration-200 [&>*]:ease-in-out", gridStyle, className)}>

      <span className="text-black">{bedRoom.name}</span>

      <div className="flex items-center justify-center">
        <HiLightningBolt className={twMerge("", bedRoom.power ? "text-yellow-500" : "text-gray-500/50")} />
      </div>

      <div className="flex flex-row justify-center">
        <RoomStatus room={bedRoom} />
      </div>

      <div className="flex flex-row justify-center items-center gap-3 text-[11px]">
        { bedRoom.customer ?
          bedRoom.customer.sexe + " " + bedRoom.customer.name.toUpperCase()

        : bedRoom.booked ?
          <PersonSex2 className="text-gray-800/60">{bedRoom.booked.name}</PersonSex2>

        : bedRoom.cleaning?.valet ? <>
          <GiBroom className={twMerge("", bedRoom.cleaning ? "text-blue-600" : "text-gray-600/50")} />
          <span className={twMerge("", bedRoom.cleaning ? "" : "text-gray-800/60")}>{bedRoom.cleaning.valet.name}</span>
        </>
        : bedRoom.clean?.done ?
          <span className="text-gray-800/60">{getFrenchDate(bedRoom.clean.done)}</span>
        
        : null }
      </div>

      <div className="">
        { isObsolet(bedRoom.id) && <IoWarning size={15} className="text-yellow-700" /> }
        { bedRoom.issue?.priority === 'low' && <IoWarning size={15} className="text-yellow-700" /> }
        { bedRoom.issue?.priority === 'medium' && <IoWarning size={15} className="text-red-700" /> }
        { bedRoom.issue?.priority === 'high' && <MdDangerous size={15} className="text-red-700" /> }
      </div>

    </div>
  );
}

