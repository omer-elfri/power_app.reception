'use client';

import React from "react";
import { twMerge } from "tailwind-merge";
import { useBedroom } from "../../hooks/useBedroom";
import { roomIds } from "../../configs/room";

import { DateRange, DayPicker } from "@daypicker/react";
import LabelInput from "../../components/LabelInput";

export default function BookingForm({ className }: {
  className?: string,
}) {
  const { book } = useBedroom();
  const [selected, setSelected] = React.useState<DateRange>();
  const [infos, setInfos] = React.useState<['success' | 'error', string]>();

  const subMitHandler = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const clientName = e.target.clientName.value;
    const roomId = e.target.roomId.value;
    const start = selected?.from;
    const end = selected?.to ?? null;
    const description = e.target.description.value;

    if (clientName === "") {
      setInfos(['error', "Vous devez préciser le nom du client"]);
      return;
    }
    if (!start) {
      setInfos(['error', "Vous devez sélectionner une date d'arrivée"]);
      return;
    }
    if (!end) {
      setInfos(['error', "Vous devez sélectionner une date de départ"]);
      return;
    }
    setInfos(undefined);
    setTimeout(() => {
      try {
        book(roomId, { clientName, start, end, description });
        setInfos(['success', "Réservation bien éffectuée"]);
      }
      catch(e) {
        setInfos(['error', e instanceof Error
          ? e.message : String(e)]);
      }
      // setBookingPopup(false);
    }, 1000);
  }

  return (
    <div className={twMerge("flex flex-col gap-2", className)}>
      
      <form className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2" onSubmit={subMitHandler}>

        <div className="">
          <DayPicker mode="range" className="my-calendar" min={1} required
            selected={selected} onSelect={setSelected}
            disabled={{ before: new Date() }}
          />
        </div>

        <div className="flex flex-col gap-2">

          <LabelInput label="Nom du client" name="clientName" inputClassName="uppercase h-8 !border-gray-400" required autoFocus />

          <LabelInput label="Chambre" name="roomId" required options={
            roomIds.map(roomId => ({ k: roomId }))
          } inputClassName="shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] text-[12px] text-center h-8 !border-gray-400" />

          <LabelInput name="description" label="Description" className="flex-1">
            <textarea name="description" id="description" className="h-full px-2 py-1 text-[12px] font-bold text-gray-800 !border-gray-400" />
          </LabelInput>

        </div>

        <div className="flex flex-row gap-3 justify-end items-start col-span-full">
          { infos && (
            <div className={twMerge("px-2 py-2 text-center rounded text-[12px] font-bold flex-1",
              infos[0] === 'success' ? "bg-green-500/20 text-green-800" :
              infos[0] === 'error' ? "bg-red-500/20 text-red-800" : "")}>{infos[1]}
            </div>
          ) }
          <button type="submit" name="register" className="bg-gray-800 text-white text-[11px]">Réserver</button>
        </div>

      </form>

    </div>
  );
}
