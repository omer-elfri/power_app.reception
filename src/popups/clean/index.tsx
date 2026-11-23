import { twMerge } from "tailwind-merge";

import ItemPopup from "../items";
import CleaningAside from "./cleaning";
import TodayCleanAside from "./today";

import LastCleanedAside from "./table";
import BedRoom from "../../types/bedroom";
import { useVisual } from "../../hooks/useVisual";
import { useAnalysis } from "../../hooks/useAnalysis";

export default function CleanTab({ className }: {
  className?: string,
}) {
  const { analysis } = useAnalysis();

  return (
    <ItemPopup onglet="CLEANING" className={twMerge("", className)}
      subClassName={twMerge("grid grid-cols-[250px_1fr] gap-3", )}>

      <div className="flex flex-col gap-3">
        { analysis.cleaning.total.length > 0 && <CleaningAside /> }
        <TodayCleanAside className="flex-1" />
        {/* <ObsoletAside /> */}
      </div>

      <LastCleanedAside />

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
    <div className={twMerge("flex flex-row items-center cursor-pointer text-center text-[10px]", className)}
      onClick={() => addPopup(['ROOM', id])}>{ children }
    </div>
  );
}

