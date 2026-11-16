'use client';

import { twMerge } from "tailwind-merge";
import BedRoom from "../types/bedroom";
import { useVisual } from "../hooks/useVisual";

export default function Room({ id:bedRoomId, className }: {
  id: BedRoom.Id,
  className?: string,
}) {
  const { addPopup } = useVisual();

  return (
    <span className={twMerge("text-black text-[12px] a", className)}
      onClick={() => addPopup(['ROOM', bedRoomId])}>{ bedRoomId }
    </span>
  );
}

