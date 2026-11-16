import { twMerge } from "tailwind-merge";

import ItemPopup from "../items";
import CleaningAside from "./cleaning";
import TodayCleanAside from "./today";
import ObsoletAside from "./obsolets";
import LastCleanedAside from "./table";
import BedRoom from "../../types/bedroom";
import { useVisual } from "../../hooks/useVisual";

export default function CleanTab({ className }: {
  className?: string,
}) {
  return (
    <ItemPopup onglet="CLEANING" className={twMerge("", className)}
      subClassName={twMerge("grid grid-cols-[250px_1fr] gap-3", )}>

      <div className="flex flex-col gap-3">
        <CleaningAside />
        <TodayCleanAside />
        <ObsoletAside className="flex-1" />
      </div>

      <LastCleanedAside className="" />

    </ItemPopup>
  );
}

export function ToRoom({ id, className, children }: {
  id: BedRoom.Id,
  className?: string,
  children?: React.ReactNode,
}) {
  const { addPopup } = useVisual();
  return (
    <div className={twMerge("flex flex-row items-center hover:text-blue-800 cursor-pointer text-center text-[10px]", className)}
      onClick={() => addPopup(['ROOM', id])}>{ children }
    </div>
  );
}

