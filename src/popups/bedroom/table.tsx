'use client';

import { twMerge } from "tailwind-merge";
import { useVisual } from "../../hooks/useVisual";
import BedRoom from "../../types/bedroom";

import RoomStatus from "../../components/RoomStatus";
import NoElem from "../../components/NoElem";
import { AsideDiv } from "../../components/FormAside";
import { IoBed, IoWarning } from "react-icons/io5";
import { GiBroom } from "react-icons/gi";
import { HiLightningBolt } from "react-icons/hi";
import { MdDangerous } from "react-icons/md";
import { gridStyle } from ".";

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
        <span>Néttoyage</span>
      </AsideDiv>

      <NoElem list={roomFiltered} Icon={IoBed} text="Aucune chambre" className="gap-2">
        { roomStage.map(([stage, rooms], i) => (
          <AsideDiv key={stage} no_bar title={stage} className={i===roomStage.length-1 ? "flex-1" : ""} subClassName="gap-0">
            { rooms.map(room => <RoomLine key={room.id} room={room} /> ) }
          </AsideDiv>
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
  const clean = bedRoom.cleaning ?? bedRoom.lastClean;

  return (
    <div onClick={() => addPopup(['ROOM', bedRoom.id])}
      className={twMerge("cursor-pointer hover:bg-blue-300/10 text-gray-600 border-t-[1px] border-gray-400/30", gridStyle, className)}>

      <span className="text-black">{bedRoom.name}</span>

      <div className="flex items-center justify-center">
        <HiLightningBolt className={twMerge("", bedRoom.power ? "text-yellow-500" : "text-gray-500/50")} />
      </div>

      <div className="flex flex-row justify-center gap-2">
        <RoomStatus room={bedRoom} />
      </div>

      { clean ? (
        <div className="flex flex-row justify-center gap-3">
          <GiBroom className={twMerge("", bedRoom.cleaning ? "text-blue-600" : "text-gray-600/50")} />
          <span>{clean.valet.name}</span>
        </div>
      ) : <div /> }

      <div className="">
        { bedRoom.issue?.priority === 'low' && <IoWarning size={15} className="text-yellow-700" /> }
        { bedRoom.issue?.priority === 'medium' && <IoWarning size={15} className="text-red-700" /> }
        { bedRoom.issue?.priority === 'high' && <MdDangerous size={15} className="text-red-700" /> }
      </div>

    </div>
  );
}

