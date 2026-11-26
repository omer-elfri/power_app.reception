'use client';

import { twMerge } from "tailwind-merge";
import { useAnalysis } from "../../hooks/useAnalysis";
import { useVisual } from "../../hooks/useVisual";
import { useAuth } from "../../hooks/useAuth";
import BedRoom from "../../types/bedroom";

import { PopupBody } from "..";
import { Title } from "../../components/SectionBox";
import MyButton from "../../components/MyButton";
import ValetBox from "./ValetBox";

export default function ValletPopup({ roomId:bedRoomId, className }: {
  roomId: BedRoom.Id,
  className?: string,
}) {
  const { cleaners } = useAuth();
  const { bedRooms } = useAnalysis();
  const { unPopup } = useVisual();
  const bedRoom = bedRooms[bedRoomId];

  const top = (
    <Title className="text-white" subClassName="items-end">
      <span className="text-[20px]">CH </span>
      <span className="text-[20px] text-green-200">{bedRoomId}</span>
      <span> Choisissez un vallet</span>
    </Title>
  );

  if (!bedRoom)
    return null;
    
  return (
    <PopupBody top={top}
      className={twMerge("bg-transparent gap-6", className)}>
      
      <div className="grid grid-cols-3 justify-center gap-5 p-2">
        { cleaners.map(cleaner => (
          <ValetBox key={cleaner.id} roomId={bedRoomId} cleaner={cleaner} />
        ) )}
      </div>

      <MyButton className="self-end bg-red-800/50 uppercase text-white" onClick={unPopup}>Fermer</MyButton>

    </PopupBody>
  );
}

