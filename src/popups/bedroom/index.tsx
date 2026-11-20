'use client';

import React from "react";
import { twMerge } from "tailwind-merge";
import { useRequest } from "../../hooks/useRequest";
import BedRoom from "../../types/bedroom";

import ItemPopup from "../items";
import RoomTable from "./table";
import RoomFilter from "./filter";
import RoomIssues from "./solded";

export type FilterOption = 'powered' | 'solded' | 'free' | 'cleaning' | 'booked' | 'issue';

export const gridStyle = "grid grid-cols-[40px_40px_80px_1fr_15px] items-center gap-3 py-2 pl-2 text-[12px] font-bold text-center";

export default function BedRoomTab({ status=null, className }: {
  status?: FilterOption | null,
  className?: string,
}) {
  const { bedRoomTab } = useRequest();
  const [roomFiltered, setRoomFiltered] = React.useState<BedRoom.Type[]>([]);

  return (
    <ItemPopup onglet="BEDROOM" className={twMerge("", className)}
      subClassName={twMerge("grid grid-cols-[200px_1fr] gap-3")}>

      <div className="flex flex-col gap-3 sticky top-0 self-start">

        <RoomFilter status={status}
          rooms={bedRoomTab}
          setRoomFiltered={setRoomFiltered}
        />
        <RoomIssues className="flex-1 min-h-40" />

      </div>

      <RoomTable roomFiltered={roomFiltered} />

    </ItemPopup>
  );
}

