'use client';

import { twMerge } from "tailwind-merge";

import { useAnalysis } from "../../hooks/useAnalysis";
import { getFrenchDateTime } from "../../tools/date";

import NoElem from "../../components/NoElem";
import { AsideDiv } from "../../components/AsideDiv";
import { BiBed } from "react-icons/bi";
import { useVisual } from "../../hooks/useVisual";
import React from "react";
import BedRoom from "../../types/bedroom";
import { normalizeSearch } from "../../tools";

export default function LastCleanedAside({ searchText, className }: {
  searchText: string,
  className?: string,
}) {
  const { addPopup, checkError } = useVisual();
  const { bedRoomTab } = useAnalysis();

  const bedRoomFiltered = React.useMemo<BedRoom.Type[]>(() => {
    return bedRoomTab.filter(room => {
      const tab = [
        room.id, room.name,
        room.customer?.name,
        room.clean?.valet?.name,
      ].filter(elem => !!elem);

      return tab.some(elem => normalizeSearch(elem!)
        .includes( normalizeSearch(searchText) ) );
    });
  }, [bedRoomTab, searchText]);

  const roomStages = Object.entries(Object.groupBy(bedRoomFiltered, room => room.stage));
  const gridStyle = "w-full grid grid-cols-[50px_40px_1fr_80px_50px] gap-2 py-2 font-bold text-gray-600";

  const clickHandler = (room: BedRoom.Type) => {
    checkError(async () => {
      if (room.cleaning)
        throw ['info', `La chambre ${room.name} est déjà en néttoyage !`];
      addPopup(['VALLET', room.id]);
    });
  }

  return (
    <div className={twMerge("flex flex-col gap-2", className)}>

      <AsideDiv subClassName={twMerge(gridStyle, "text-gray-800 text-center text-[11px] py-[1px]")}>
        <span>Assignée</span>
        <span>CH</span>
        <span>Vallet</span>
        <span>Statut</span>
        <span>Fin</span>
      </AsideDiv>

      <NoElem text="Aucun élément" Icon={BiBed} className="text-[15px] pr-3 overflow-auto" list={bedRoomFiltered}>

        <div className="flex flex-col gap-1 overflow-auto">
          { roomStages.map(([stage, rooms]) =>
            <React.Fragment key={stage}>

              <div className={twMerge("grid grid-cols-[10px_auto_1fr] items-center gap-2 py-2 font-bold text-[12px] text-gray-600")}>
                <hr className="text-gray-400/70" />
                <span className="text-gray-800">{stage}</span>
              </div>

              <AsideDiv className="py-1" subClassName="gap-0">
                { rooms.map(room => (
                  <div key={room.id} onClick={() => clickHandler(room)}
                    className={twMerge("last:border-0 border-b-1 border-gray-400/30 py-1 text-center text-[11px] text-center hover:bg-blue-300/10 cursor-pointer", gridStyle)}>
                    <p>{ room.clean ? getFrenchDateTime(room.clean.created_date) : "..." }</p>
                    <p className={room.clean ? "text-black text-[12px]" : ""}>{room.id}</p>
                    <p>{ room.clean?.valet?.name ?? "..." }</p>
                    <div className="flex flex-row justify-center text-center"><Status room={room} /></div>
                    <p>{ room.clean?.done ? getFrenchDateTime(room.clean.done) : "..." }</p>
                  </div>
                )) }
              </AsideDiv>

            </React.Fragment>
          )}
        </div>

      </NoElem>

    </div>
  );
}

function Status({ room:bedRoom }: {
  room: BedRoom.Type,
}) {
  const { isObsolet } = useAnalysis();
  const style = "text-[10px] px-[4px] py-[0px] rounded border-1 text-center";

  if (!bedRoom.clean)
    return "...";
  if (bedRoom.cleaning)
    return <div className={twMerge("bg-blue-300/20 border-blue-800 text-blue-900", style)}>en cours</div>
  if (isObsolet(bedRoom.id))
    return <div className={twMerge("bg-red-300/20 border-red-800 text-red-900", style)}>sale</div>
  return <div className={twMerge("bg-green-300/20 border-green-800 text-green-900", style)}>propre</div>
}

