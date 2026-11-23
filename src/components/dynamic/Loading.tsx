'use client'

import { useVisual } from "../../hooks/useVisual";

export default function Loading() {
  const { loading } = useVisual();

  if (!loading)
    return null;
 
  return (
    <div className="flex justify-center items-center p-3 fixed inset-0 bg-black/10 backdrop-blur-[2px] z-102">
      <p className="font-bold text-black text-[14px] uppercase">Chargement ...</p>
    </div>
  );
}

