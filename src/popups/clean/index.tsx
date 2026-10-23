'use client';

import React from "react";
import { twMerge } from "tailwind-merge";
import { DayPicker } from "@daypicker/react";
import { useDataContext } from "../../hooks";
import Popup, { CloseBtn, PopupBody } from "..";

import { Title } from "../../components/SectionBox";
import LabelInput from "../../components/LabelInput";

import CleaningTable from "./table";
import CleaningForm from "./form";
import { ValletLine } from "./vallet";
import BedRoom from "../../types/bedroom";
import Employer from "../../types/employer";

export default function CleaningPopup({ roomId }: {
  roomId?: BedRoom.Id,
}) {
  const { cleaning_book, cleaners } = useDataContext();
  const [selectedDate, setSelectedDate] = React.useState<Date>();

  const cleanedAtDate = cleaning_book.get.filter(clean => {
    if (!selectedDate) return true;
    return (
      clean.date.getDate() === selectedDate.getDate() ||
      clean.done?.getDate() === selectedDate.getDate()
    );
  });

  return (
    <Popup>
      <PopupBody className="gap-3"
        top={<Title bar className="gap-2" right={<CloseBtn />}>Entretien</Title>}>

        <div className="flex-1 w-full h-full grid grid-cols-[230px_1fr] grid-rows-[280px_260px_auto] gap-2 gap-x-5">

          <CleaningForm roomId={roomId} />

          <CleaningTable className="row-span-2" list={cleanedAtDate} />

          <LabelInput label="Période">
            <div className="shadow-[inset_0_2px_4px_4px__rgba(0,0,0,0.15)] rounded px-3 py-1">
              <DayPicker mode="single" className="my-calendar" required
                selected={selectedDate} onSelect={setSelectedDate}
                disabled={{ after: new Date() }}
              />
            </div>
          </LabelInput>

          <div className="grid grid-cols-3 gap-3 px-2 py-3 col-span-full sticky bottom-0 bg-white">
            { cleaners.map((cleaner, i) =>
              <ValletLine key={cleaner.id} cleanerId={cleaner.id as Employer.Id}
                className={twMerge("p-2", (i !== cleaners.length-1) ? "border-r-1" : "")} />
            ) }
          </div>

        </div>

      </PopupBody>
    </Popup>
  );
}
