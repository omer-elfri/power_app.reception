'use client';

import React from "react";
import { twMerge } from "tailwind-merge";
import { useBedroom } from "../../hooks/useBedroom";
import { roomIds } from "../../configs/room";

import { DateRange, DayPicker } from "@daypicker/react";
import LabelInput from "../../components/LabelInput";
import { useDataContext } from "../../hooks";
import BedRoom from "../../types/bedroom";
import { getFrenchDate } from "../../tools";

export default function BookingForm({ bookId, className }: {
  bookId?: number,
  className?: string,
}) {
  const { reservation_book, getBookedPeriod, setAlert } = useDataContext();
  const { book } = useBedroom();

  const [clientName, setClientName] = React.useState("");
  const [selectedRoomId, setSelectedRoomId] = React.useState<BedRoom.Id>(roomIds[0]);
  const [description, setDescription] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState<DateRange>();

  const roomBookeds = getBookedPeriod(selectedDate?.from, selectedDate?.to)
  const bookInfos = React.useMemo(() => {
    return reservation_book.get.find(rsv => rsv.id === bookId);
  }, [reservation_book.get, bookId]);

  React.useEffect(() => {
    if (!bookInfos) return;
    setSelectedDate({ from: bookInfos.start, to: bookInfos.end });
    setClientName(bookInfos.name);
    setSelectedRoomId(bookInfos.roomId);
    setDescription(bookInfos.description ?? "");
  }, [bookInfos]);

  const subMitHandler = React.useCallback((e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedDate?.from)
      throw Error("Vous devez sélectionner une date d'arrivée");
    if (selectedDate.to && selectedDate.from > selectedDate.to) {
      const tmp = selectedDate.from;
      selectedDate.from = selectedDate.to;
      selectedDate.to = tmp;
    }

    const clientName = e.target.clientName.value;
    const roomId = selectedRoomId;
    const start = selectedDate.from;
    const end = selectedDate.to ?? new Date(start.getTime() + 24*60*60*1000);
    const description = e.target.description.value;

    if (!roomId) {
      setAlert(['error', "Vous devez préciser la chambre"]);
      throw Error("Vous devez préciser la chambre");
    }
    if (clientName === "") {
      setAlert(['error', "Vous devez préciser le nom du client"]);
      throw Error("Vous devez préciser le nom du client");
    }
    setAlert(null);
    try {
      book(roomId, { name: clientName, start, end }, description);
      setAlert(['success', "Réservation bien éffectuée"]);
    }
    catch(e) {
      setAlert(['error', e instanceof Error ? e.message : String(e)]);
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
          value={clientName} onChangeText={setClientName}
          inputClassName="uppercase h-8 !border-gray-400 shadow-[inset_0_1px_1px_1px__rgba(0,0,0,0.15)]"
        />

        <LabelInput label="Chambre" name="roomId" required
          value={selectedRoomId} onChangeText={text => setSelectedRoomId(text as BedRoom.Id)}
          inputClassName="text-[12px] text-center h-8 !border-gray-400" options={
          roomIds.map(roomId => {
            const rsv = roomBookeds.find(room_rsv => room_rsv.roomId === roomId);
            return ({ k: roomId, value: `${roomId} ${rsv ? " - " + rsv.name.toUpperCase() + " - " + getFrenchDate(rsv.start).slice(0,6) + "..." + getFrenchDate(rsv.end).slice(0,6) : ""}`, disabled: !!rsv });
          })
        } />

        <LabelInput name="description" label="Description">
          <textarea name="description" id="description"
            value={description} onChange={e => setDescription(e.target.value)}
            className="shadow-[inset_0_1px_1px_1px__rgba(0,0,0,0.15)] h-20 px-2 py-1 text-[12px] font-bold text-gray-800 !border-gray-400" />
        </LabelInput>

        <button type="submit" name="register" disabled={!!getBookedPeriod(selectedDate?.from, selectedDate?.to).find(room => room.roomId === selectedRoomId) } className="bg-gray-800 text-white text-[11px] self-end">Réserver</button>

      </form>

    </div>
  );
}
