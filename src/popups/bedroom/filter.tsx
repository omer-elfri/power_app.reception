'use client';

import { twMerge } from "tailwind-merge";
import BedRoom from "../../types/bedroom";
import React from "react";
import { getString } from "../../tools";
import { FilterOption } from ".";
import { AsideDiv } from "../../components/FormAside";
import { useVisual } from "../../hooks/useVisual";

export default function RoomFilter({ status, rooms, className, setRoomFiltered }: {
  status: FilterOption | null,
  rooms: BedRoom.Type[],
  className?: string,
  setRoomFiltered: (rooms: BedRoom.Type[]) => void,
}) {
  const { switchPopup } = useVisual();

  const analysis: { [k in FilterOption]: BedRoom.Type[] } = React.useMemo(() => ({
    'powered': rooms.filter(room => !!room.power),
    'solded': rooms.filter(room => !!room.customer),
    'booked': rooms.filter(room => !!room.booked),
    'cleaning': rooms.filter(room => !!room.cleaning),
    'free': rooms.filter(room => !room.customer),
  }), [rooms]);

  React.useEffect(() => {
    setRoomFiltered(status ? analysis[status] : rooms);
  }, [analysis, status, rooms]);

  const FilterSelect = React.useCallback(({ label, value, nb, style }: {
    label: FilterOption | null,
    value: string,
    nb: number,
    style?: string,
  }) => {
    return (
      <div onClick={() => switchPopup(['BEDROOM', label])} className={twMerge(
        "flex flex-row font-bold text-[11px] px-2 py-1 rounded border-1 border-gray-600 cursor-pointer",
        status === label ? twMerge("bg-blue-600 text-white", style) : "bg-white text-gray-600"
      )}>
        <span className="font-semibold flex-1">{value}</span>
        <span className="">{getString(nb)}</span>
      </div>
    );
  }, [status, switchPopup]);

  return (
    <AsideDiv title="Filtres" className={twMerge("", className)} subClassName="flex flex-col gap-2">
      <FilterSelect label={null} value="Tout" nb={rooms.length} style="bg-blue-800/70" />
      <FilterSelect label="free" value="Disponibles" nb={analysis.free.length} style="bg-gray-600" />
      <FilterSelect label="solded" value="Vendues" nb={analysis.solded.length} style="bg-green-600" />
      <FilterSelect label="powered" value="Alimentées" nb={analysis.powered.length} style="bg-red-600" />
      <FilterSelect label="booked" value="Réservées" nb={analysis.booked.length} style="bg-purple-600" />
      <FilterSelect label="cleaning" value="En néttoyages" nb={analysis.cleaning.length} style="bg-blue-600" />
    </AsideDiv>
  );
}

