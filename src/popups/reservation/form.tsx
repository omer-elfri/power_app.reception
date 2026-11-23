'use client';

import React from "react";
import { twMerge } from "tailwind-merge";

import { useDataContext } from "../../hooks";
import { useRequest } from "../../hooks/useRequest";
import { useAnalysis } from "../../hooks/useAnalysis";

import { DateRange, DayPicker } from "@daypicker/react";
import LabelInput from "../../components/LabelInput";
import { colors, State } from "../../types";
import BedRoom from "../../types/bedroom";
import MyButton from "../../components/MyButton";

export default function BookingForm({ className, selectedDate, setSelectedDate }: {
  className?: string,
  selectedDate: DateRange,
  setSelectedDate: State<DateRange>,
}) {
  const { getBookedPeriod, } = useDataContext();
  const { bedRoomTab } = useAnalysis();
  const { book } = useRequest();

  const [selectedRoomId, setSelectedRoomId] = React.useState<
    BedRoom.Id>(bedRoomTab.at(0)?.id ?? '');
  const [clientName, setClientName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [disabled, setDisabled] = React.useState(false);
  const roomBookeds = getBookedPeriod(selectedDate?.from, selectedDate?.to);

  React.useEffect(() => {
    setDisabled(clientName === "" || !selectedDate.from);
  }, [clientName, selectedDate]);

  return (
    <form className={twMerge("grid grid-cols-[80px_1fr] gap-x-2 gap-y-2", className)} onSubmit={async e => {
      e.preventDefault();
      const start_date = selectedDate.from ?? new Date();
      const end_date = selectedDate.to ?? new Date(
        new Date(start_date).setDate(start_date.getDate() + 1) );
      await book(selectedRoomId, { name: clientName, start_date, end_date, description });
    }}>
      
      <LabelInput label="Période" className="col-span-full">
        <div className="shadow-[inset_0_2px_4px_4px__rgba(0,0,0,0.15)] rounded px-3 py-1">
          <DayPicker mode="range" className="my-calendar" min={1} required
            selected={selectedDate} onSelect={setSelectedDate}
            disabled={{ before: new Date() }}
          />
        </div>
      </LabelInput>

      <LabelInput label="Chambre" name="roomId" required
        value={selectedRoomId.toString()} onChangeText={setSelectedRoomId}
        inputClassName="text-[12px] text-center h-8 !border-gray-400" options={
        bedRoomTab.map(room => {
          const rsv = roomBookeds.find(room_rsv => room_rsv.room_id === room.id);
          return ({ k: room.id.toString(), value: `${room.id} ${rsv
              ? " - " + rsv.name.toUpperCase()
              : room.issue?.priority === 'high' ? " - hors service" : "" }`,
            disabled: !!rsv || room.issue?.priority === 'high',
          });
        })
      } />

      <LabelInput label="Nom du client" name="clientName" required
        value={clientName} onChangeText={setClientName}
        inputClassName="uppercase h-8 !border-gray-400 shadow-[inset_0_1px_1px_1px__rgba(0,0,0,0.15)]"
      />

      <LabelInput type='textarea' name="description" label="Description"
        value={description} onChangeText={setDescription}
        className="col-span-full h-25"
      />

      <div className="col-span-full flex flex-row justify-end">
        <MyButton name="register" disabled={disabled}
          className="!py-1 text-white border-1"
          style={{ background: colors.coming, borderColor: colors.coming }}>Réserver
        </MyButton>
      </div>

    </form>
  );
}

