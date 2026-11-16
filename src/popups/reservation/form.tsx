'use client';

import React from "react";
import { twMerge } from "tailwind-merge";

import { useDataContext } from "../../hooks";
import { useRequest } from "../../hooks/useRequest";
import { getFrenchDate } from "../../tools/date";

import { DateRange, DayPicker } from "@daypicker/react";

import LabelInput from "../../components/LabelInput";
import { State } from "../../types";
import BedRoom from "../../types/bedroom";

export default function BookingForm({ className, selectedDate, setSelectedDate }: {
  className?: string,
  selectedDate: DateRange,
  setSelectedDate: State<DateRange>,
}) {
  const { reservation_book, getBookedPeriod, } = useDataContext();
  const { bedRoomTab, } = useRequest();

  const [selectedRoomId, setSelectedRoomId] = React.useState<BedRoom.Id>(bedRoomTab.at(0)?.id ?? '');
  const [clientName, setClientName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [disabled, setDisabled] = React.useState(false);

  const roomBookeds = getBookedPeriod(selectedDate?.from, selectedDate?.to);

  React.useEffect(() => {
    setDisabled(clientName === "" || !selectedDate.from);
  }, [clientName, selectedDate]);

  return (
    <form className={twMerge("flex flex-col gap-2", className)} onSubmit={e => {
      e.preventDefault();
      const start_date = selectedDate.from ?? new Date();
      const end_date = selectedDate.to ?? new Date(start_date.getDate() + 1);
      reservation_book.add(selectedRoomId, { name: clientName, start_date, end_date }, description);
    }}>
      
      <div className="flex flex-col gap-x-4 gap-y-2">

        <LabelInput label="Période">
          <div className="shadow-[inset_0_2px_4px_4px__rgba(0,0,0,0.15)] rounded px-3 py-1 bg-white">
            <DayPicker mode="range" className="my-calendar" min={1} required
              selected={selectedDate} onSelect={setSelectedDate}
              disabled={{ before: new Date() }}
            />
          </div>
        </LabelInput>

        <div className="grid grid-cols-[80px_1fr] gap-2">

          <LabelInput label="Chambre" name="roomId" required
            value={selectedRoomId.toString()} onChangeText={setSelectedRoomId}
            inputClassName="text-[12px] text-center h-8 !border-gray-400 bg-white" options={
            bedRoomTab.map(room => {
              const rsv = roomBookeds.find(room_rsv => room_rsv.room_id === room.id);
              return ({
                k: room.id.toString(),
                value: `${room.id} ${rsv
                  ? " - " + rsv.name.toUpperCase() + " - " + getFrenchDate(rsv.start_date).slice(0,6) + "..." + getFrenchDate(rsv.end_date).slice(0,6)
                  : room.issue?.priority === 'high' ? " - hors service" : "" }`,
                disabled: !!rsv || room.issue?.priority === 'high',
              });
            })
          } />

          <LabelInput label="Nom du client" name="clientName" required autoFocus
            value={clientName} onChangeText={setClientName}
            inputClassName="uppercase h-8 !border-gray-400 shadow-[inset_0_1px_1px_1px__rgba(0,0,0,0.15)] bg-white"
          />

        </div>

        <LabelInput type='textarea' name="description" label="Description"
          value={description} onChangeText={setDescription}
          className="h-30" inputClassName="bg-white"
        />

      </div>

      <button type="submit" name="register" disabled={disabled}
        className="bg-gray-800 text-white text-[11px] self-end">Réserver
      </button>

    </form>
  );
}

