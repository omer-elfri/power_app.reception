'use client';

import React from "react";
import { twMerge } from "tailwind-merge";
import { useBedroom } from "../../hooks/useBedroom";

import { DateRange, DayPicker } from "@daypicker/react";
import LabelInput from "../../components/LabelInput";
import { useDataContext } from "../../hooks";
import BedRoom from "../../types/bedroom";
import { getFrenchDate } from "../../tools/date";

export default function BookingForm({ bookId, className }: {
  bookId?: number,
  className?: string,
}) {
  const { reservation_book, addAlert, getBookedPeriod, } = useDataContext();
  const { bedRoomTab, book, } = useBedroom();

  const [selectedDate, setSelectedDate] = React.useState<DateRange>({ from: new Date() });
  const [selectedRoomId, setSelectedRoomId] = React.useState<BedRoom.Id>(bedRoomTab[0]?.id);
  const [clientName, setClientName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const roomBookeds = getBookedPeriod(selectedDate?.from, selectedDate?.to);
  const bookInfos = reservation_book.get.find(rsv => rsv.id === bookId);

  React.useEffect(() => {
    if (!bookInfos) return;
    setSelectedDate({ from: bookInfos.start, to: bookInfos.end });
    setClientName(bookInfos.name);
    setSelectedRoomId(bookInfos.roomId);
    setDescription(bookInfos.description ?? "");
  }, [bookInfos]);

  const subMitHandler = React.useCallback((e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedDate.from) {
      addAlert(['error', "Vous devez sélectionner une date d'arrivée"]);
      return;
    }
    if (selectedDate.to && selectedDate.from > selectedDate.to) {
      const tmp = selectedDate.from;
      selectedDate.from = selectedDate.to;
      selectedDate.to = tmp;
    }

    const start = selectedDate.from;
    const end = selectedDate.to ?? new Date(start.getTime() + 24*60*60*1000);

    if (!selectedRoomId) {
      addAlert(['error', "Vous devez préciser la chambre"]);
      throw Error("Vous devez préciser la chambre");
    }
    if (clientName === "") {
      addAlert(['error', "Vous devez préciser le nom du client"]);
      throw Error("Vous devez préciser le nom du client");
    }
    book(selectedRoomId, { name: clientName, start, end }, description);
  }, [book, selectedDate, clientName, selectedRoomId, description]);

  const disabled = clientName === "" || !selectedDate.from;

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

        <div className="grid grid-cols-[80px_1fr] gap-2">

          <LabelInput label="Chambre" name="roomId" required
            value={selectedRoomId.toString()} onChangeText={setSelectedRoomId}
            inputClassName="text-[12px] text-center h-8 !border-gray-400" options={
            bedRoomTab.map(room => {
              const rsv = roomBookeds.find(room_rsv => room_rsv.roomId === room.id);
              return ({
                k: room.id.toString(),
                value: `${room.id} ${rsv
                  ? " - " + rsv.name.toUpperCase() + " - " + getFrenchDate(rsv.start).slice(0,6) + "..." + getFrenchDate(rsv.end).slice(0,6)
                  : room.issue?.priority === 'high' ? " - hors service" : "" }`,
                disabled: !!rsv || room.issue?.priority === 'high',
              });
            })
          } />

          <LabelInput label="Nom du client" name="clientName" required autoFocus
            value={clientName} onChangeText={setClientName}
            inputClassName="uppercase h-8 !border-gray-400 shadow-[inset_0_1px_1px_1px__rgba(0,0,0,0.15)]"
          />

        </div>

        <LabelInput name="description" label="Description">
          <textarea name="description" id="description"
            value={description} onChange={e => setDescription(e.target.value)}
            className="shadow-[inset_0_1px_1px_1px__rgba(0,0,0,0.15)] h-20 \
            px-2 py-1 text-[12px] font-bold text-gray-800 !border-gray-400" />
        </LabelInput>

        <button type="submit" name="register" disabled={disabled}
          className="bg-gray-800 text-white text-[11px] self-end">Réserver
        </button>

      </form>

    </div>
  );
}

