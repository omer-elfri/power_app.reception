'use client';

import React from "react";
import { twMerge } from "tailwind-merge";
import { useRequest } from "../../hooks/useRequest";

import { DateRange, DayPicker } from "@daypicker/react";
import LabelInput from "../../components/LabelInput";
import { useDataContext } from "../../hooks";
import BedRoom from "../../types/bedroom";
import { getFrenchDate } from "../../tools/date";
import { State } from "../../types";

export default function BookingForm({ bookId, className, selectedDate, setSelectedDate, setDisabled }: {
  bookId?: number,
  className?: string,
  selectedDate: DateRange,
  setSelectedDate: State<DateRange>,
  setDisabled: State<boolean>,
}) {
  const { reservation_book, getBookedPeriod, } = useDataContext();
  const { bedRoomTab, } = useRequest();

  // const [selectedDate, setSelectedDate] = React.useState<DateRange>({ from: new Date() });
  const [selectedRoomId, setSelectedRoomId] = React.useState<BedRoom.Id>(bedRoomTab[0]?.id);
  const [clientName, setClientName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const roomBookeds = getBookedPeriod(selectedDate?.from, selectedDate?.to);
  const bookInfos = bookId ? reservation_book.getId(bookId) : null;

  React.useEffect(() => {
    if (!bookInfos) return;
    setSelectedDate({ from: bookInfos.start_date, to: bookInfos.end_date });
    setClientName(bookInfos.name);
    setSelectedRoomId(bookInfos.room_id);
    setDescription(bookInfos.description ?? "");
  }, [bookInfos]);

  React.useEffect(() => {
    setDisabled(clientName === "" || !selectedDate.from);
  }, [clientName, selectedDate]);

  return (
    <div className={twMerge("flex flex-col gap-2", className)}>
      
      <div className="flex flex-col gap-x-4 gap-y-2">

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
            inputClassName="uppercase h-8 !border-gray-400 shadow-[inset_0_1px_1px_1px__rgba(0,0,0,0.15)]"
          />

        </div>

        <LabelInput type='textarea' name="description" label="Description"
          value={description} onChangeText={setDescription}
          className="h-30"
        />

      </div>

    </div>
  );
}

