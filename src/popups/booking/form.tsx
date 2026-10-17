'use client';

import React from "react";
import { twMerge } from "tailwind-merge";
import { useBedroom } from "../../hooks/useBedroom";
import { roomIds } from "../../configs/room";

import { DateRange, DayPicker } from "@daypicker/react";
import LabelInput from "../../components/LabelInput";
import { useDataContext } from "../../hooks";

export default function BookingForm({ bookId, className }: {
  bookId?: number,
  className?: string,
}) {
  const { reservation_book, getBookedPeriod } = useDataContext();
  const { book } = useBedroom();

  const [clientName, setClientName] = React.useState("");
  const [selectedRoomId, setSelectedRoomId] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState<DateRange>();

  const [infos, setInfos] = React.useState<['success' | 'error', string]>();
  const roomBookeds = getBookedPeriod(selectedDate?.from, selectedDate?.to)
  const bookInfos = reservation_book.get.find(rsv => rsv.id === bookId);

  React.useEffect(() => {
    if (!bookInfos) return;
    setSelectedDate({ from: bookInfos.start, to: bookInfos.end });
    setClientName(bookInfos.name);
    setSelectedRoomId(bookInfos.roomId);
    setDescription(bookInfos.description ?? "");
  }, [bookInfos]);

  React.useEffect(() => {
    setTimeout(() => {
      if (infos) setInfos(undefined);
    }, 3000);
  }, [infos]);

  const subMitHandler = React.useCallback((e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const clientName = e.target.clientName.value;
    const roomId = e.target.roomId.value;
    const start = selectedDate?.from;
    const end = selectedDate?.to ?? new Date(Date.now() + 24*60*60*1000);
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
    try {
      book(roomId, { name: clientName, start, end }, description);
      setInfos(['success', "Réservation bien éffectuée"]);
    }
    catch(e) {
      setInfos(['error', e instanceof Error ? e.message : String(e)]);
    }
  }, [book, selectedDate, clientName, selectedRoomId, description]);

  return (
    <div className={twMerge("flex flex-col gap-2", className)}>
      
      <form className="flex flex-col gap-x-4 gap-y-2" onSubmit={subMitHandler}>

        <LabelInput label="Période">
          <div className="shadow-[inset_0_2px_4px_4px__rgba(0,0,0,0.15)] rounded px-3 py-1">
            <DayPicker mode="range" className="my-calendar" min={1} required
              selected={selectedDate} onSelect={setSelectedDate}
              disabled={{ before: new Date() }}
            />
          </div>
        </LabelInput>

        <LabelInput label="Nom du client" name="clientName" required autoFocus
          value={clientName} onChange={e => setClientName(e.target.value)}
          inputClassName="uppercase h-8 !border-gray-400 shadow-[inset_0_1px_1px_1px__rgba(0,0,0,0.15)]"
        />

        <LabelInput label="Chambre" name="roomId" required
          value={selectedRoomId} onChange={e => setSelectedRoomId(e.target.value)}
          inputClassName="text-[12px] text-center h-8 !border-gray-400" options={
          roomIds.map(roomId => {
            const rsv = roomBookeds.find(room_rsv => room_rsv.roomId === roomId);
            return ({ k: roomId, value: `${roomId} ${rsv ? " - " + rsv.name.toUpperCase() : ""}`, disabled: !!rsv });
          })
        } />

        <LabelInput name="description" label="Description">
          <textarea name="description" id="description"
            value={description} onChange={e => setDescription(e.target.value)}
            className="shadow-[inset_0_1px_1px_1px__rgba(0,0,0,0.15)] h-20 px-2 py-1 text-[12px] font-bold text-gray-800 !border-gray-400" />
        </LabelInput>

        { infos && (
          <div className={twMerge("px-2 py-2 text-center rounded text-[12px] font-bold flex-1",
            infos[0] === 'success' ? "bg-green-500/20 text-green-800" :
            infos[0] === 'error' ? "bg-red-500/20 text-red-800" : "")}>{infos[1]}
          </div>
        ) }

        <button type="submit" name="register" className="bg-gray-800 text-white text-[11px] self-end">Réserver</button>

      </form>

    </div>
  );
}
