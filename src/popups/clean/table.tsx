'use client';

import { twMerge } from "tailwind-merge";

import { useRequest } from "../../hooks/useRequest";
import { getFrenchDateTime } from "../../tools/date";

import NoElem from "../../components/NoElem";
import { AsideDiv } from "../../components/FormAside";
import { MyTr } from "../../components/MyTable";
import { BiBed } from "react-icons/bi";
import { useVisual } from "../../hooks/useVisual";

export default function LastCleanedAside({ className }: {
  className?: string,
}) {
  const { addPopup } = useVisual();
  const { bedRoomTab, isObsolet } = useRequest();

  const roomStages = Object.entries(Object.groupBy(bedRoomTab, room => room.stage));
  const gridStyle = "w-full grid grid-cols-[50px_40px_1fr_60px_50px] gap-2 py-2 font-bold text-[12px] text-gray-600";

  return (
    <AsideDiv no_bar title="Derniers néttoyages" className={twMerge("", className)}>

      <NoElem text="Aucun élément" Icon={BiBed} className="text-[15px] pr-3 overflow-auto" list={bedRoomTab}>

        <MyTr className={twMerge(gridStyle, "text-gray-800 text-[11px] border-y-1 border-gray-400/50 py-[5px]")}>
          <span>Assignée</span>
          <span>CH</span>
          <span>Vallet</span>
          <span>Statut</span>
          <span>Fin</span>
        </MyTr>

        <div className="flex flex-col overflow-auto">
          { roomStages.map(([stage, rooms]) => <div key={stage}>

            <div className={twMerge("col-span-full grid grid-cols-[10px_auto_1fr] items-center gap-2 py-2 font-bold text-[12px] text-gray-600")}>
              <hr className="text-gray-400/70" />
              <span className="text-gray-800">{stage}</span>
              {/* <hr className="text-gray-400/70" /> */}
            </div>

            { rooms.map(room => {
              const clean = room.cleaning ?? room.lastClean;
              return (
                <MyTr key={room.id} onClick={() => addPopup(['VALLET', room.id])}
                  className={twMerge("text-[11px] text-center border-b-1 border-gray-400/30 hover:bg-blue-300/20 cursor-pointer", gridStyle)}>
                  <p className="text-[11px]">{ room.lastClean ? getFrenchDateTime(room.lastClean.created_date) : "..." }</p>
                  <p className={room.lastClean ? "text-black text-[12px]" : ""}>{room.id}</p>
                  <p className="text-[11px]">{ room.lastClean?.valet.name ?? "..." }</p>
                  <div className="flex flex-row justify-center text-center">
                    { !clean ? "..." : !clean.done ?
                      <div className="bg-blue-300/20 border-1 text-center border-blue-800 text-blue-900 text-[10px] px-[4px] py-[0px] rounded">en cours</div>
                    : isObsolet(room.id) ?
                      <div className="bg-red-300/20 border-1 text-center border-red-800 text-red-900 text-[10px] px-[4px] py-[0px] rounded">sale</div>
                    :
                      <div className="bg-green-300/20 border-1 text-center border-green-800 text-green-900 text-[10px] px-[4px] py-[0px] rounded">propre</div>
                    }
                  </div>
                  <p className="text-[11px]">{ room.lastClean?.done ? getFrenchDateTime(room.lastClean.done) : "..." }</p>
                </MyTr>
              )}
            ) }

          </div> )}
        </div>


      </NoElem>

    </AsideDiv>
  );
}

