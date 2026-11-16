'use client';

import { twMerge } from "tailwind-merge";
import { useRequest } from "../../hooks/useRequest";
import NoElem from "../../components/NoElem";
import { AsideDiv } from "../../components/FormAside";

export default function RoomIssues({ className }: {
  className?: string,
}) {
  const { bedRoomTab } = useRequest();
  const roomIssued = bedRoomTab.filter(room => room.issue);

  return (
    <AsideDiv title="Problèmes" className={twMerge("", className)}>
      <NoElem list={roomIssued} text="Aucun problème signalé" className="min-h-40">
        { roomIssued.map(room => (
          <div key={room.id} className="flex flex-row gap-2">
            <p className="">{room.name}</p>
            <p className="text-[12px] text-gray-600">{room.issue?.message}</p>
          </div>
        )) }
      </NoElem>
    </AsideDiv>
  );
}

